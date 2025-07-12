const module = await initializeWasmModule();

function render() {
  const body = document.getElementById("body");
  const output = module.render(body.innerHTML);

  if (output.err_code === 0) {
    body.style.display = "block";
    body.innerHTML = output.html;
  } else {
    body.innerHTML = "<p>Something went wrong :(</p>"
  }
}

if (document.readyState === "complete") {
  render();
} else {
  window.addEventListener("load", (event) => {
    render();
  });
}
