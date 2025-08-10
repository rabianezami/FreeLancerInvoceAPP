export function loadNavbarFooter() {
  // بارگذاری navbar
  fetch("navbar.html")
    .then(res => res.text())
    .then(html => document.getElementById("navbar-placeholder").innerHTML = html)
    .catch(err => console.error("Navbar load error:", err));

  // بارگذاری footer
  fetch("footer.html")
    .then(res => res.text())
    .then(html => document.getElementById("footer-placeholder").innerHTML = html)
    .catch(err => console.error("Footer load error:", err));
}

// نمایش پیام
export function showMessage(message, type = "success") {
  alert(`${type.toUpperCase()}: ${message}`);
}

// هنگام بارگذاری صفحه، navbar و footer را بارگذاری کن
document.addEventListener("DOMContentLoaded", () => {
  loadNavbarFooter();
});
