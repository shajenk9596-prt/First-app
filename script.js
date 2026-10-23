/* Opens and closes the menu on phones */
var btn = document.querySelector(".menu-btn");
var nav = document.getElementById("nav");
btn.addEventListener("click", function () {
  var open = nav.classList.toggle("open");
  btn.setAttribute("aria-expanded", open);
});
nav.addEventListener("click", function (e) {
  if (e.target.tagName === "A") {
    nav.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }
});