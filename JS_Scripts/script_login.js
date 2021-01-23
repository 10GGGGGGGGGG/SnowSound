//document.getElementById(id).style.property = new style
//var x = document.getElementsByClassName("example")[0];
var login = true;
function changePosition() {
  var panel = document.getElementsByClassName("moving_panel")[0];
  if (login) {
    panel.style.transform = "translate(0%)";
    console.log(document.getElementById("switchButton").value);
    document.getElementById("switchButton").innerHTML = "INGRESAR";
    panel.style.borderTopLeftRadius = "2vw";
    panel.style.borderBottomLeftRadius = "2vw";
    panel.style.borderTopRightRadius = "0";
    panel.style.borderBottomRightRadius = "0";
    login = false;
  } else {
    panel.style.transform = "translate(100%)";
    document.getElementById("switchButton").innerHTML = "REGISTRARSE";
    panel.style.borderTopLeftRadius = "0";
    panel.style.borderBottomLeftRadius = "0";
    panel.style.borderTopRightRadius = "2vw";
    panel.style.borderBottomRightRadius = "2vw";
    login = true;
  }
}
/*document.getElementsByClassName("moving_panel")[0];
  transform: translateX(100%);*/
/*
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
  }*/
