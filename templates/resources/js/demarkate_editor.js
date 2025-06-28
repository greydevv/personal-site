const MAX_ALLOC_SIZE = 1 << 20;
console.log(MAX_ALLOC_SIZE);

var getMemoryView = function() {
  throw "WASM module not initialized"
}

var copySourceClicked = function() {
  throw "WASM module not initialized"
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.log("Failed to copy text to clipboard");
  }
}

const importObject = {
  env: {
    printBytes: function(ptr, len) {
      let u8Array = getMemoryView().buffer.slice(ptr, ptr + len);
      console.log(new TextDecoder().decode(u8Array))
    },
    print: function(num) {
      console.log(num);
    }
  }
}

function asByteArrayWithOffset(view, offset) {
  return new Uint8Array(
    view.buffer,
    view.byteOffset + offset,
    view.byteLength - offset,
  );
}

function Slice(ptr, len) {
  this.ptr = ptr;
  this.len = len;

  this.deref = () => {
    const memoryView = getMemoryView();

    const bytes = new Uint8Array(
      memoryView.buffer,
      this.ptr,
      this.len,
    );

    return bytes;
  }
}

function alloc(src) {
  const ptr = 0;

  const memoryView = getMemoryView();
  const dest = new Uint8Array(
    memoryView.buffer,
    memoryView.byteOffset,
    Math.min(src.length, memoryView.byteLength)
  );

  const { written: len } = new TextEncoder().encodeInto(src, dest);

  return new Slice(ptr, len);
}

function free(slice) {
  const memoryView = getMemoryView();

  for (i = 0; i < slice.len; i++) {
    const offset = slice.ptr + i;
    memoryView.setUint8(offset, 0);
  }
}

function sliceFromU64(u64) {
  const view = new DataView(new ArrayBuffer(8), 0);
  view.setBigUint64(0, u64, true);

  return new Slice(
    view.getUint32(0, true),
    view.getUint32(0 + 4, true)
  );
}

WebAssembly.instantiateStreaming(fetch("/wasm/demarkate.wasm"), importObject)
  .then(
    (obj) => {
      const exports = obj.instance.exports;
      var memoryView = new DataView(exports.memory.buffer);

      getMemoryView = function() {
        if (memoryView.buffer !== exports.memory.buffer) {
          memoryView = new DataView(exports.memory.buffer);
        }

        return memoryView
      }

      const emptySourceHtml = "<p>...and it will render as you type :)</p>"
      const editor = document.getElementById("editor");
      const preview = document.getElementById("preview");
      preview.innerHTML = emptySourceHtml;

      copySourceClicked = function() {
        copyToClipboard(editor.value);
      }

      function render() {
        const src = alloc(editor.value);
        const out = sliceFromU64(exports.renderHtml(src.ptr, src.len));

        if (out.len > 0) {
          const text = new TextDecoder().decode(out.deref());
          preview.innerHTML = text;

          free(src);
        }

        if (editor.value === "") {
          preview.innerHTML = emptySourceHtml;
        }
      }

      function onWindowLoad() {
        const savedText = localStorage.getItem("markdownText");

        if (savedText) {
          editor.value = savedText
          render();
        }

        editor.addEventListener("input", () => {
          render();
          localStorage.setItem("markdownText", editor.value);
        });
      }

      if (document.readyState === "complete") {
        onWindowLoad();
      } else {
        window.addEventListener("load", (event) => {
          onWindowLoad();
        });
      }
    }
  )
  .catch(
    (e) => {
      console.log(e);
    }
  );
