<?php
require('db.php');
session_start();

if (isset($_POST['check_session'])){
    if((!isset($_SESSION['idUsuario']))){
        echo 0;
    }
    else{
        echo $_SESSION['idUsuario'];
    }
}

if (isset($_POST['queryValue']) && ($_POST['queryValue'] == "destroy-session")) {
    session_destroy();
    echo "Sesion finalizada";
}

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