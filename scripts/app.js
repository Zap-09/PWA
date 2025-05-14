


/// Adds style to footer
const currentPage = window.location.pathname.split("/").pop(); // get current filename
console.log(currentPage)
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});
