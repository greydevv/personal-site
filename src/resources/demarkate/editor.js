const module = await initializeWasmModule();

const editor = document.getElementById("editor");
const preview = document.getElementById("preview");
const error = document.getElementById("error");
const output_window = document.getElementById("output_window");
const translucent_dismisser = document.getElementById("translucent_dismisser")
const raw_output = document.getElementById("output");

window.viewSourceClicked = function() {
  output_window.style.display = "block";
  translucent_dismisser.style.display = "block";
  raw_output.textContent = JSON.stringify(editor.value);
}

window.closeOutputClicked = function() {
  output_window.style.display = "none";
  translucent_dismisser.style.display = "none";
  raw_output.textContent = "";
}

function setError(content) {
  preview.style.display = "none";
  error.style.display = "block";
  error.innerHTML = content;
}

function setPreview(content) {
  preview.style.display = "block";
  error.style.display = "none";
  preview.innerHTML = content;
}

function render() {
  if (editor.value === "") {
    setPreview("<p>...and it will render as you type :)</p>");
    return;
  }

  const output = module.render(editor.value)
  if (output === null) {
    setError(`<p>error: ${output}</p>`);
  } else {
    setPreview(output);
  }
}

function onWindowLoad() {
  const savedText = localStorage.getItem("markdownText");
  editor.value = savedText;
  render();

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

// WebAssembly.instantiateStreaming(fetch("/resources/demarkate/demarkate.wasm"), importObject)
//   .then(
//     (obj) => {
//       const exports = obj.instance.exports;
//       const editor = document.getElementById("editor");
//       const preview = document.getElementById("preview");
//       const error = document.getElementById("error");
//       const output_window = document.getElementById("output_window");
//       const translucent_dismisser = document.getElementById("translucent_dismisser")
//       const raw_output = document.getElementById("output");
//
//       function setError(content) {
//         preview.style.display = "none";
//         error.style.display = "block";
//         error.innerHTML = content;
//       }
//
//       function setPreview(content) {
//         preview.style.display = "block";
//         error.style.display = "none";
//         preview.innerHTML = content;
//       }
//
//       function render() {
//         if (editor.value === "") {
//           setPreview("<p>...and it will render as you type :)</p>");
//           return;
//         }
//
//         allocator = new WasmAllocator(exports);
//
//         const input = allocBytes(editor.value);
//         allocator.free(input.ptr, input.len);
//
//         const output = Output(exports.renderHtml(input.ptr, input.len));
//         if (output.err_code == 0) {
//           setPreview(output.string);
//         } else {
//           setError(`<p>error: ${output.string}</p>`);
//         }
//
//         allocator.checkAllocsAndFrees();
//       }
//
//     }
//   )
//   .catch(
//     (e) => {
//       console.log(e);
//     }
//   );
