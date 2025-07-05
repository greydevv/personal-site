const module = await initializeWasmModule();

function render() {
  const body = document.getElementById("body");
  const output = module.render(body.innerHTML);

  if (output === null) {
    body.innerHTML = "<p>Something went wrong :(</p>"
  } else {
    body.style.display = "block";
    body.innerHTML = output;
  }
}

if (document.readyState === "complete") {
  render();
} else {
  window.addEventListener("load", (event) => {
    render();
  });
}
