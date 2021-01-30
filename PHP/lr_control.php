<?php
require('db.php');
session_start();

// Consultamos si existe una sesion iniciada, si existe, devolvemos el usuario para que pueda tenerse en cuenta en el front-end
if (isset($_POST['check_session'])){
    if((!isset($_SESSION['idUsuario']))){
        echo 0;
    }
    else{
        echo $_SESSION['idUsuario'];
    }
}
// Si el usuario "cierra sesion" en la aplicacion, internamente se destruye la sesion de usuario
if (isset($_POST['queryValue']) && ($_POST['queryValue'] == "destroy-session")) {
    session_destroy();
    echo "Sesion finalizada";
}
/* 
   Si el usuario mete los campos email y password, quiere decir que esta en el formulario de inicio de sesion. Por lo que, se comprobara la existencia del usuario
   en la bbdd. Si existe, se inicializaran las variables de la sesion con su idUsuario y se retornara tambien su idUsuario al JS para su control en el Front-End.
   De no existir el usuario en la base de datos, se retornara un valor de 0, que será tratado en el JS como un login fallido con un mensaje de "Datos introducidos
   incorrectos".
*/ 
if (isset($_POST['email']) && isset($_POST['password'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $email = mysqli_real_escape_string($con, $email);
    $email = stripslashes($email);
    $password = stripslashes($password);
    $password = mysqli_real_escape_string($con, $password);

    $query = "select * FROM usuario WHERE email='$email' and password='" . $password . "';";
    $result = $con->query($query);
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
          $_SESSION['idUsuario'] = $row['idUsuario'];
        }
        echo $_SESSION['idUsuario'];
    } else {
        echo 0;
    }
}
/*
   Por otro lado, si el usuario mete los campos de email y password en su version formulario de registro, ademas de los campos username(nombre de usuario) y la confirmacion
   de la contraseña introducida. Se tomaran distintos caminos dependiendo de lo que ocurra. 
   1. Si el usuario introduce contraseña y verificacion de contraseña distintos, se devuelve un valor -1 que sera tratado en el JS mediante la notificacion al usuario de que
   los campos introducidos  son distintos.
   2. Si el usuario rellena el formulario de registro correctamente, se procedera a insertar al nuevo usuario en la bbbdd de la aplicacion. En caso de fallo, querra decir que
   el usuario muy probablemente ya tenga una cuenta existente; de lo contrario, el usuario será registrado con exito en la bbdd de la aplicacion.
*/
if (isset($_POST['email_R']) && isset($_POST['username']) && isset($_POST['password_R']) && isset($_POST['confirm_password'])){
    $email = $_POST['email_R'];
    $username = $_POST['username'];
    $password = $_POST['password_R'];

    $email = mysqli_real_escape_string($con, $email);
    $email = stripslashes($email);
    $username = stripslashes($username);
    $username = mysqli_real_escape_string($con, $username);
    $password = stripslashes($password);
    $password = mysqli_real_escape_string($con, $password);
    if($password != stripslashes($_POST['confirm_password'])){
        echo -1;
    }
    else{
        $query = "insert into usuario (nombre, password, email) VALUES ('". $username ."', '". $password ."', '". $email ."');";
        if ($con->query($query) === TRUE) {
            echo $username;
        } else {
            echo 0;
        }
    }
}

?>