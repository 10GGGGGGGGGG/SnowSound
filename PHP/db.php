<?php
// Enter your Host, username, password, database below.
// I left password empty because i do not set password on localhost.
	
$con = mysqli_connect("localhost","root","","id15898328_snowsound_db");
    if (mysqli_connect_errno()){
 echo "Failed to connect to MySQL: " . mysqli_connect_error();
 die();
 }
 
date_default_timezone_set('Europe/Madrid');
$error="";
?>