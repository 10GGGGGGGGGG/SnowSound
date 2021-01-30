<?php
require('db.php');
session_start();

//Si la solicitud es de cargar todas las canciones de la aplicacion, consultamos a la bbdd para obtener todos los datos de todas las canciones almacenenadas en la bbdd
if (isset($_POST['queryValue']) && ($_POST['queryValue'] == "all-songs")){
  $sel_query="select * from cancion;";
  $result_bbdd = mysqli_query($con,$sel_query);
  songs_response_json_encode($result_bbdd);
}

//Si la solicitud es de algun tipo de carga de lista en especifico del tipo artista, predeterminada o en base al genero musical, consultamos a la bbdd para obtener el idLista, su nombre y la imagen que tendra en el carrusel para aquella tipo de lista que el usuario solicito
if (isset($_POST['queryValue']) && (($_POST['queryValue'] == "artists-list")||($_POST['queryValue'] == "default-lists")||($_POST['queryValue'] == "category-lists")||(isset($_SESSION['idUsuario']) && $_POST['queryValue'] == "fav-songs-lists"))){
  if ($_POST['queryValue'] == "artists-list"){
    $sel_query="select idLista, nombreLista, listaImagen from lista where tipoLista = 'artista';";
  }
  else if($_POST['queryValue'] == "default-lists"){
    $sel_query="select idLista, nombreLista, listaImagen from lista where tipoLista = 'defaults';";
  }
  else if($_POST['queryValue'] == "category-lists"){
    $sel_query="select idLista, nombreLista, listaImagen from lista where tipoLista = 'genero';";
  }
  else{
    $sel_query="select idLista, nombreLista, listaImagen from usuario INNER JOIN listas_favoritas on usuario.idUsuario = listas_favoritas.usuario_idUsuario INNER JOIN lista on listas_favoritas.lista_idLista = lista.idLista WHERE idUsuario = " . $_SESSION['idUsuario'] . ";";
  }
  $result_bbdd = mysqli_query($con,$sel_query);
  list_response_json_encode($result_bbdd);
}

// Si la solicitud es de cargar todas las listas de la aplicacion, se consulta a la bbdd para obtener el idLista, su nombre y la imagen que tendra en el carrusel
if (isset($_POST['queryValue']) && ($_POST['queryValue'] == "songs-lists")){
  $sel_query="select idLista, nombreLista, listaImagen from lista;";
  $result_bbdd = mysqli_query($con,$sel_query);
  list_response_json_encode($result_bbdd);
}

// Si la solicitud es de acceder a una lista del carrusel, accedemos a las canciones dentro de esa lista para que se puedan cargar en la tabla de canciones
if (isset($_POST['queryValue']) && ($_POST['queryValue'] == "access-list")){
  $sel_query = "select idCancion, titulo, artista, genero, duracion, publicacion, enlace  FROM lista INNER JOIN lista_has_cancion on lista.idLista = lista_has_cancion.lista_idLista INNER JOIN cancion ON lista_has_cancion.cancion_idCancion = cancion.idCancion where idLista = ". $_POST['id_list'] .";";
  $result_bbdd = mysqli_query($con,$sel_query);
  songs_response_json_encode($result_bbdd);
}

// Si el usuario tiene una sesion iniciada y desea acceder a sus canciones favoritas guardadas, se consultara la bbdd para obtener la informacion completa de las canciones guardadas como favorito del usuario
if (isset($_POST['queryValue']) && isset($_SESSION['idUsuario']) && ($_POST['queryValue'] == "fav-songs")){
  $sel_query = "select idCancion, titulo, artista, genero, duracion, publicacion, enlace FROM (`usuario` INNER JOIN canciones_favoritas on usuario.idUsuario = canciones_favoritas.usuario_idUsuario) INNER JOIN cancion ON canciones_favoritas.cancion_idCancion = cancion.idCancion WHERE idUsuario = ".$_SESSION['idUsuario'] .";";
  $result_bbdd = mysqli_query($con,$sel_query);
  songs_response_json_encode($result_bbdd);
}

//Este metodo, permite devolver en un formato codificado tipo json los datos de todas las canciones que se hayan seleccionado
function songs_response_json_encode($result_bbdd){
  $response = array();
  $json = array();
  while($row = mysqli_fetch_array($result_bbdd)){
    $response['idCancion'] = $row['idCancion'];
    $response['titulo'] = $row['titulo'];
    $response['artista'] = $row['artista'];
    $response['genero'] = $row['genero'];
    $response['duracion'] = $row['duracion'];
    $response['publicacion'] = $row['publicacion'];
    $response['enlace'] = $row['enlace'];
    array_push($json, $response);
  }

  echo json_encode($json);
}

//Este metodo, tambien permite devolver en un formato codificado tipo json, pero esta vez, los datos de las listas que se hayan seleccionado
function list_response_json_encode($result_bbdd){
  $response = array();
  $json = array();
  while($row = mysqli_fetch_array($result_bbdd)){
    $response['idLista'] = $row['idLista'];
    $response['nombreLista'] = $row['nombreLista'];
    $response['listaImagen'] = $row['listaImagen'];
    array_push($json, $response);
  }

  echo json_encode($json);
}
?>