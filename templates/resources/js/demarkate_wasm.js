var getMemoryView = function() {
  throw "editor not initialized"
}

var togglePreview = function() {
  throw "editor not initialized"
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
  const memoryView = getMemoryView();

  const ptr = 0;
  const dest = asByteArrayWithOffset(memoryView, ptr);
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

function clickedRender() {
  throw "WASM module not initialized"
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

      function render() {
        const src = alloc(editor.value);
        const out = sliceFromU64(exports.renderHtml(src.ptr, src.len));

        if (out.len > 0) {
          const text = new TextDecoder().decode(out.deref());
          preview.innerHTML = text;

          free(src);
        }
      }

      const editor = document.getElementById("editor");
      const preview = document.getElementById("preview");
      var isPreview = false;

      togglePreview = function() {
        isPreview = !isPreview;

        if (isPreview) {
          render();
          editor.style.display = "none";
          preview.style.display = "block";
        } else {
          editor.style.display = "block";
          preview.style.display = "none";
        }
      }

      window.addEventListener("load", (event) => {
        const savedText = localStorage.getItem("markdownText");

        if (savedText) {
          editor.value = savedText
        }

        // Save as user types
        editor.addEventListener("input", () => {
          localStorage.setItem("markdownText", editor.value);
        });
      });
    }
  )
  .catch(
    (e) => {
      console.log(e);
    }
  );
