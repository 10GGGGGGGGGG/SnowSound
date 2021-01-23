var sidebarWidth = "-15%";
/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openSidebar() {
  document.getElementsByClassName("sidebar")[0].style.left = "0%";
}
/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeSidebar() {
  document.getElementsByClassName("sidebar")[0].style.left = sidebarWidth;
}

function sidebarAssign(sidebarResize) {
  if (sidebarResize.matches) {
    sidebarWidth = "-40%";
  } else {
    sidebarWidth = "-15%";
  }
}
var sidebarResize = window.matchMedia("(max-width: 500px)");
sidebarAssign(sidebarResize); // Call listener function at run time
sidebarResize.addListener(sidebarAssign);

function openPlayer() {
  const bottom = document.querySelector(".player").style.bottom;
  if (bottom == "-70px" || bottom == "") {
    document.getElementById("openPlayer").innerHTML = "keyboard_arrow_down";
    document.getElementById("trapezoid").style.bottom = "70px";
    document.getElementsByClassName("player")[0].style.bottom = "0px";
  } else {
    document.getElementById("openPlayer").innerHTML = "keyboard_arrow_up";
    document.getElementById("trapezoid").style.bottom = "0px";
    document.getElementsByClassName("player")[0].style.bottom = "-70px";
  }
}

var vol_slider = document.getElementById("vol_slider");
var vol_output = document.getElementById("vol_output");
vol_output.innerHTML = vol_slider.value + "%";

vol_slider.oninput = function () {
  vol_output.innerHTML = this.value + "%";
};

new Splide(".splide", {
  perPage: 3,
  cover: true,
  height: "12rem",
  lazyLoad: "nearby",
  gap: "10px",
  pagination: false,
  breakpoints: {
    height: "8rem",
  },
}).mount();
