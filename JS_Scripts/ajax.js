var idUser = null;
var json_songs;
var object_id_song;
var player = null;
var timer;
var first_scroll = [false, false]
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

$(document).ready(function () {
    // Comprobamos si existe alguna sesion activa nada mas cargar la pagina
    check_session();
    $("#time_slider").val(0);

    // Boton que permite cargar todas las canciones
    $('#button_songs').click(function () {
        if($(".sidebar")[0].style.left != sidebarWidth){
            closeSidebar();
        }
        let query = $('#button_songs').val();
        $.ajax({
            type: 'POST',
            url: "PHP/db_control.php",
            data: {
                'queryValue': query
            },
            beforeSend: function () {
                console.log("Consultando la bbdd, espere");
            },
            success: function (response) {
                loadSongsTable(response);
            },
            error: function (xhr, status) {
                console.log("Error en la consulta de datos");
            }
        });
        if(!first_scroll[0]){ // Fix temporal
            first_scroll[0] = true;
        }
        else{
            document.getElementsByClassName('contenido')[0].scrollIntoView();
        }
    });

    //Boton que permite cargar las canciones favoritas del usuario con la sesion iniciada
    $("#button_fav_songs").click(function () {
        let query = $('#button_fav_songs').val();
        $.ajax({
            type: "POST",
            url: "PHP/db_control.php",

            data: {
                'queryValue': query
            },
            success: function (response) {
                loadSongsTable(response);
            },
            error: function (xhr, status) {
                console.log("Error en la consulta de datos");
            }
        });
    });

    //Boton que permite cargar las listas de música favoritas del usuario con la sesion iniciada
    $("#button_fav_songs_lists").click(function () {
        let query = $('#button_fav_songs_lists').val();
        $.ajax({
            type: "POST",
            url: "PHP/db_control.php",
            data: {
                'queryValue': query
            },
            success: function (response) {
                loadListsTable(response, query);
            },
            error: function (xhr, status) {
                console.log("Error en la consulta de datos");
            }
        });
    });

    //Boton que permite cargar los artistas en el carrusel de contenido
    $("#button_artists").click(function () {
        let query = $('#button_artists').val();
        $.ajax({
            type: "POST",
            url: "PHP/db_control.php",
            data: {
                'queryValue': query
            },
            success: function (response) {
                loadListsTable(response, query);
            },
            error: function (xhr, status) {
                console.log("Error en la consulta de datos");
            }
        });
    });

    //Boton que permite cargar todas las listas de música en el carrusel de contenido
    $("#button_songs_lists").click(function () {
        let query = $('#button_songs_lists').val();
        $.ajax({
            type: "POST",
            url: "PHP/db_control.php",
            data: {
                'queryValue': query
            },
            success: function (response) {
                loadListsTable(response, query);
            },
            error: function (xhr, status) {
                console.log("Error en la consulta de datos");
            }
        });
    })

    //Boton que permite cargar las categorias disponibles en la web
    $("#button_categories").click(function () {
        let query = $('#button_categories').val();
        $.ajax({
            type: "POST",
            url: "PHP/db_control.php",
            data: {
                'queryValue': query
            },
            success: function (response) {
                loadListsTable(response, query);
            },
            error: function (xhr, status) {
                console.log("Error en la consulta de datos");
            }
        });
    })

    //Buscador de listas en el carrusel de contenido
    if ($(".splide__list")) {
        $("#searchTextBox").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $(".splide__list li").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    }

    //Buscador de canciones en la tabla de canciones
    if ($("myTable")) {
        $("#searchTextBox").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#myTable tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    }

    //Form de registro para un nuevo usuario
    $("#form-submit-register").on('submit', function(e){
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "PHP/lr_control.php",
            data: $('#form-submit-register').serialize(),
            success: function (response) {
                if(response == -1){
                    $("#register_alert").text("Error en la confirmacion de contraseña");
                }
                else if(response == 0){ //Error bbdd, usuario ya registrado
                    $("#register_alert").text("Registro cancelado, cuenta ya existente en la aplicacion");
                }
                else{
                    $("#register_alert").text("Usuario registrado con exito, ya puedes iniciar sesion en tu cuenta. Bienvenido " + response);
                    document.getElementById("form-submit-register").reset();
                }
            },
            error: function (xhr, status) {
                console.log("Error en la consulta de datos, usuario inexistente");
            }
        });
    });

    //Form de login para un usuario ya registrado
    $('#form-submit-login').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "PHP/lr_control.php",
            data: $('#form-submit-login').serialize(),
            success: function (response) {
                if (response == 0){
                    $("#login_alert").text("Datos introducidos incorrectos");
                }
                else{
                    idUser = response;
                    $("#login_alert").text("Login realizado con exito, volviendo a la pagina principal...");
                    setTimeout(() => {
                        document.location.href="index.html";
                    }, 1000);
                }
            },
            error: function (xhr, status) {
                console.log("Error en la consulta de datos, usuario inexistente");
            }
        });
    });

    //Logout, para finalizar la sesion de un usuario logeado
    $("#logout-button").click(function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "PHP/lr_control.php",
            data: {
                'queryValue': 'destroy-session'
            },
            success: function (response) {
                idUser = null;
                console.log("Sesion finalizada")
                $("#button_fav_songs").hide();
                $("#button_fav_songs_lists").hide();
                $('#button_songs').trigger('click');
                $("#login-button").show();
            }
        });
    });

    //Boton de skip a la cancion previa en la lista
    $("#prev_song").click(function () {
        let index = json_songs.findIndex(function(item, i){
            return item.idCancion === object_id_song.substr(object_id_song.length - 1);
          });
        if ((index - 1) < 0){
            object_id_song = object_id_song.substr(0, object_id_song.length - 1) + json_songs[json_songs.length - 1]['idCancion'];
        }
        else{
            object_id_song = object_id_song.substr(0, object_id_song.length - 1) + json_songs[index - 1]['idCancion'];

        }
        reply_click_song(object_id_song);
    });

    //Boton de skip a la cancion siguiente en la lista
    $("#next_song").click(function () { 
        let index = json_songs.findIndex(function(item, i){
            return item.idCancion === object_id_song.substr(object_id_song.length - 1);
          });
        console.log(index);
        if ((index + 1) > (json_songs.length - 1)){
            object_id_song = object_id_song.substr(0, object_id_song.length - 1) + json_songs[0]['idCancion'];
        }
        else{
            object_id_song = object_id_song.substr(0, object_id_song.length - 1) + json_songs[index + 1]['idCancion'];
        }
        reply_click_song(object_id_song);
    });

    $("#button_songs_lists").trigger('click');
    $('#button_songs').trigger('click');

});

// Metodo que nos permite comprobar si el usuario contiene una sesion ya iniciada en la web
function check_session(){
    $.ajax({
        type: "POST",
        url: "PHP/lr_control.php",
        data: {
            'check_session' : 0
        },
        success: function (response) {
            if (response != 0){
                idUser = response;
                $("#button_fav_songs").show();
                $("#button_fav_songs_lists").show();
                $("#login-button").hide();
            }
            else{
                $("#button_fav_songs").hide();
                $("#button_fav_songs_lists").hide();
            }
        }
    });
}

// Metodo que nos permite cargar canciones en la tabla
function loadSongsTable(response) {
    json_songs = $.parseJSON(response);
    if ($("#tablaCanciones").children().length != 0) {
        $("#tablaCanciones").DataTable().destroy();
    }
    $("#tablaCanciones").html("<thead> <tr> <th>Titulo</th> <th>Artista</th> <th>Genero</th> <th>Duracion</th> <th>Publicacion</th> </tr> </thead> <tbody id='myTable'>");

    if (idUser) { //Añadir boton de favoritos y tenerlo mapeado. (On Development...)
        for (row of json_songs) {
            $("#tablaCanciones").append("<tr id='song-" + row["idCancion"] + "' onClick='reply_click_song(this.id)'> <td>" + row["titulo"] + " <button class='material-icons'>favorite_border</button><span>On Development...</span> </td> <td>" + row["artista"] + "</td> <td>" + row["genero"] + "</td> <td>" + row["duracion"] + "</td> <td>" + row["publicacion"] + "</td> </tr>");
        }
        $("#tablaCanciones").append("</tbody>");
    }
    else {
        for (row of json_songs) {
            $("#tablaCanciones").append("<tr id='song-" + row["idCancion"] + "' onClick='reply_click_song(this.id)'> <td>" + row["titulo"] + "</td> <td>" + row["artista"] + "</td> <td>" + row["genero"] + "</td> <td>" + row["duracion"] + "</td> <td>" + row["publicacion"] + "</td> </tr>");
        }
        $("#tablaCanciones").append("</tbody>");
    }
    $('#tablaCanciones').DataTable();
}

// Metodo que nos permite cargar listas del tipo artistas, predeterminadas, generos musicales o las listas favoritos de un usuario logeado en el carrusel de contenido
function loadListsTable(response, query) {
    $(".splide__list").empty();
    if($(".sidebar")[0].style.left != sidebarWidth){
        closeSidebar();
    }
    json_lists = $.parseJSON(response);
    if (query == "artists-list") {
        $("#contenido_list_type").text("Artistas destacados");
    }
    else if (query == "songs-lists") {
        $("#contenido_list_type").text("Listas de música");
    }
    else if (query == "category-lists") {
        $("#contenido_list_type").text("Géneros");
    }
    else {
        $("#contenido_list_type").text("Mis Listas Favoritas");
    }
    for (row of json_lists) {
        $(".splide__list").append("<li class='splide__slide' title='" + row["nombreLista"] + "'> <div id='access-list-" + row["idLista"] + "' onClick='reply_click_list(this.id)' class='splide__slide__container'> <img src='" + row["listaImagen"] + "' alt='" + row["nombreLista"] + "' title='" + row["nombreLista"] + "'/> </div> <h4>" + row["nombreLista"] + "</h4> </li>");
    }
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
    
    if(!first_scroll[1]){ // Fix temporal
        first_scroll[1] = true;
    }
    else{
        document.getElementsByClassName('contenido')[0].scrollIntoView();
    }
    
}

// Metodo que nos permite cargar en la tabla de canciones el contenido de una lista del carrusel "clickada"/elegida por el usuario.
function reply_click_list(id) {
    if($(".sidebar")[0].style.left != sidebarWidth){
        closeSidebar();
    }
    let list_name = id.substr(0, 11);
    let id_list;
    if (id.length == 13){
        id_list = parseInt(id.substr(id.length - 1));
    }
    else if(id.length == 14){
        id_list = parseInt(id.substr(id.length - 2));
    }
    $.ajax({
        type: "POST",
        url: "PHP/db_control.php",
        data: {
            'queryValue': list_name,
            'id_list': id_list
        },
        success: function (response) {
            loadSongsTable(response);
        }
    });
    document.getElementsByClassName('contenido')[0].scrollIntoView();
}

// Metodo que nos permite cargar y escuchar en el reproductor de musica una cancion "clickada"/elegida por el usuario de la tabla cargada de canciones.
function reply_click_song(id) {
    if ($("#openPlayer").text() == "keyboard_arrow_up"){
        openPlayer();
    }
    object_id_song = id;
    let song_ID;

    // 2º Metodo, más optimo pero en desarrollo
    /*
    let song_object;
    song_object = json_songs.find(song => song['idCancion'] === parseInt(id.substr(id.length - 1)));
    console.log(song_object);
    song_ID = song_object['enlace'];
    $("#artist_name").html("<strong>" + song_object['artista'] + "</strong>");
    $("#song_name").html("<strong>" + song_object['titulo'] + "</strong>");
    $("#category_name").html("<strong>" + song_object['genero'] + "</strong>");
    */
   let id_song_match = id;
   if (id.length == 6){
       id_song_match = parseInt(id.substr(id.length - 1));
   }
   else if(id.length == 7){
       id_song_match = parseInt(id.substr(id.length - 2));
   }
    //1º Metodo
    for (var key in json_songs) {
        if (json_songs[key]['idCancion'] == id_song_match) {
            song_ID = json_songs[key]['enlace'];
            //Aqui se pueden coger el resto de campos y cargarlos en unos <p> o lo que sea
            $("#artist_name").html("<strong>" + json_songs[key]['artista'] + "</strong>");
            $("#song_name").html("<strong>" + json_songs[key]['titulo'] + "</strong>");
            $("#category_name").html("<strong>" + json_songs[key]['genero'] + "</strong>");
            break;
        }
    }
    if(player != null){
        player.destroy();
        clearInterval(timer);
        $('#time_slider').val(0);
        $('#time_slider').unbind();
        $('#vol_slider').unbind();
        $("#play").unbind();
    }
    onYouTubeIframeAPIReady(song_ID);
}

//Este metodo crea un <iframe> (y un reproductor de Youtube) despues de que se desargue el codigo API de youtube (Youtube API)
function onYouTubeIframeAPIReady(song_ID) {
    if(song_ID){
        player = new YT.Player('music_player', {
            height: '360',
            width: '640',
            videoId: song_ID,
            events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange
            }
          });
    }
}

// Metodo vinculado al reproductor de Youtube que solo tendra funcionalidad una vez cargado completamente el reproductor de Youtube.
function onPlayerReady(event) {
    event.target.playVideo();
    $("#play").text("pause_circle_outline");
    event.target.setVolume( $('#vol_slider').val());
    $("#time_slider").attr('max', event.target.getDuration());
    $("#total_time").text(Math.trunc(event.target.getDuration() / 60) + ":" + (event.target.getDuration() % 60));
    $("#play").click(function () {
        if (event.target.getPlayerState() == 1){
            $("#play").text("play_circle_outline");
            event.target.pauseVideo();
        }
        else{
            $("#play").text("pause_circle_outline");
            event.target.playVideo();
        }
    });
    if (YT.PlayerState.PLAYING  && !YT.PlayerState.ENDED){
        timer = setInterval(() => {
            if (parseInt(event.target.getCurrentTime() % 60) < 10){
                $("#current_time").text(Math.trunc(event.target.getCurrentTime() / 60) + ":0" + (parseInt(event.target.getCurrentTime() % 60)));
            }
            else{
                $("#current_time").text(Math.trunc(event.target.getCurrentTime() / 60) + ":" + (parseInt(event.target.getCurrentTime() % 60)));
            }
            $("#time_slider").val(event.target.getCurrentTime());
            $('#vol_slider').val(event.target.getVolume());
            $('#vol_output').text(event.target.getVolume() + "%"); 
        }, 1000);
    }

    $('#time_slider').on('input', function () {
        event.target.seekTo($(this).val(), true);
        $('#time_slider').val($(this).val());
    });
    
    $('#vol_slider').on('input', function () {
        event.target.setVolume($(this).val());
        $('#vol_slider').val($(this).val());
        $('#vol_output').text($(this).val() + "%"); 
    });
}

// Metodo vinculado al reproductor de Youtube que se llamará unicamente cuando se produzca algun tipo de cambio en el reproductor tipo Play, Pause, saltar cancion, etc.
function onPlayerStateChange(event) {
    if(event.target.getPlayerState() == 0){
        player.stopVideo();
        $("#time_slider").val(0);
        $("#next_song").trigger("click");
    }
}

