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
    document.getElementById("main_text").innerHTML = "¡Encantado de conocerte!";
    document.getElementById("second_text").innerHTML =
      "Ingresa tus datos para crear una cuenta gratuita de SnowSound y y vivir la experiencia completa.";
    login = false;
  } else {
    panel.style.transform = "translate(100%)";
    document.getElementById("switchButton").innerHTML = "REGISTRARSE";
    panel.style.borderTopLeftRadius = "0";
    panel.style.borderBottomLeftRadius = "0";
    panel.style.borderTopRightRadius = "2vw";
    panel.style.borderBottomRightRadius = "2vw";

    document.getElementById("main_text").innerHTML = "¡Bienvenido de nuevo!";
    document.getElementById("second_text").innerHTML =
      "Introduce tu usuario y contraseña y accede a tu área personal para disfrutar al máximo de las funcionalidades de SnowSound.";
    login = true;
  }
}
