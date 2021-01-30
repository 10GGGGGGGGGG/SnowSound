<?php

//Conexion a la base de datos
$con = mysqli_connect("localhost","root","","id15898328_snowsound_db");
//$con = mysqli_connect("localhost","id15898328_snowsound_db_admin","Aw(4Sy]5AO[/+m_l","id15898328_snowsound_db");

    if (mysqli_connect_errno()){
 echo "Failed to connect to MySQL: " . mysqli_connect_error();
 die();
 }
 
date_default_timezone_set('Europe/Madrid');
$error="";
?>