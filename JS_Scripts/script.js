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
