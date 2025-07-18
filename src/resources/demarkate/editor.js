const module = await initializeWasmModule();

const editor = document.getElementById("editor");
const preview = document.getElementById("preview");
const error = document.getElementById("error");
const output_window = document.getElementById("output_window");
const translucent_dismisser = document.getElementById("translucent_dismisser")
const raw_output = document.getElementById("output");

// Performance tracking
let n_keystrokes = 0;
let render_time_sum = 0;
let render_time_avg = 0;

function updateDebugDisplay(memoryUsage) {
  const avg_speed_el = document.getElementById("avg-speed-display");
  const mem_usage_el = document.getElementById("mem-usage-display");

  const mem_usage = module.allocator.mem.buffer.byteLength;
  mem_usage_el.textContent = `${mem_usage} bytes`
  avg_speed_el.textContent = `${render_time_avg.toFixed(5)}ms`;
}

function trackRenderTime(textLength, duration) {
  n_keystrokes++;
  render_time_sum += duration;
  render_time_avg = render_time_sum / n_keystrokes;
  updateDebugDisplay();
}

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

  const start_time = performance.now();
  const output = module.render(editor.value);
  const end_time = performance.now();

  trackRenderTime(editor.value.length, end_time - start_time);

  if (output.err_code === 0) {
    setPreview(output.html);
  } else {
    setError(`<p>error: ${output.html}</p>`);
  }
}

function onWindowLoad() {
  const saved_text = localStorage.getItem("markdownText");
  editor.value = saved_text;
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
