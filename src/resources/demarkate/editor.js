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
  if (output.err_code === 0) {
    setPreview(output.html);
  } else {
    setError(`<p>error: ${output.html}</p>`);
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
