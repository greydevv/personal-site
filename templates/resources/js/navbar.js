const currentPath = window.location.pathname;
const items = document.querySelectorAll(".nav-item");

items.forEach(item => {
  const path = new URL(item.href).pathname;

  if (path === currentPath) {
    item.classList.add("font-semibold");
  }
});
