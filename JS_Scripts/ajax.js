var idUser = null;
var json_songs;
var object_id_song;
var player = null;
var timer;
var first_scroll = false;
// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//loadDefaultLists();

$(document).ready(function () {
    check_session();
    $("#time_slider").val(0);

    $('#button_songs').click(function () {
        let query = $('#button_songs').val();
        console.log(query);
        $.ajax({
            type: 'POST',
            url: "PHP/db_control.php",
            data: {
                'queryValue': query
            },
            beforeSend: function () {
                $('#text_message').text("Consultando la bbdd, espere");
                console.log("Consultando la bbdd, espere");
            },
            success: function (response) {
                loadSongsTable(response);
            },
            error: function (xhr, status) {
                $('#text_message').text("Error en la consulta de datos");
            }
        });
    });
    $("#button_fav_songs").click(function () {
        let query = $('#button_fav_songs').val();
        console.log(idUser);
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
                $('#text_message').text("Error en la consulta de datos");
            }
        });
    });

    $("#button_fav_songs_lists").click(function () {
        let query = $('#button_fav_songs_lists').val();
        console.log(idUser);
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
                $('#text_message').text("Error en la consulta de datos");
            }
        });
    });

    $("#button_artists").click(function () {
        let query = $('#button_artists').val();
        console.log(query);
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
                $('#text_message').text("Error en la consulta de datos");
            }
        });
    });

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
                $('#text_message').text("Error en la consulta de datos");
            }
        });
    })

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
                $('#text_message').text("Error en la consulta de datos");
            }
        });
    })

    //Buscador listas
    if ($(".splide__list")) {
        $("#searchTextBox").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $(".splide__list li").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    }

    //Buscador canciones
    if ($("myTable")) {
        $("#searchTextBox").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#myTable tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    }

    //Register new user
    $("#form-submit-register").on('submit', function(e){
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "PHP/lr_control.php",
            data: $('#form-submit-register').serialize(),
            success: function (response) {
                console.log(response);
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
                $('#text_message').text("Error en la consulta de datos, usuario inexistente");
            }
        });
    });

    //Loging with forms
    $('#form-submit-login').on('submit', function (e) {
        e.preventDefault();
        console.log("HOLA");
        $.ajax({
            type: "POST",
            url: "PHP/lr_control.php",
            data: $('#form-submit-login').serialize(),
            success: function (response) {
                console.log(response);

                if (response == 0){
                    $("#login_alert").text("Datos introducidos incorrectos");
                    console.log(response);
                    //location.reload();
                    //idUser = response;
                    //console.log(idUser);

                }
                else{
                    idUser = response;
                    $("#login_alert").text("Login realizado con exito, volviendo a la pagina principal...");
                    setTimeout(() => {
                        document.location.href="index.html";
                    }, 1500);
                }
                /*
                $('#text_message').text("Sesion iniciada");
                $("#button_fav_songs").show();
                $("#button_fav_songs_lists").show();
                $('#button_songs').trigger('click');
                */
            },
            error: function (xhr, status) {
                $('#text_message').text("Error en la consulta de datos, usuario inexistente");
            }
        });
    });

    //Logout
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
                console.log(idUser)
                console.log("Sesion finalizada")
                $("#button_fav_songs").hide();
                $("#button_fav_songs_lists").hide();
                $('#text_message').text("Sesion finalizada");
                $('#button_songs').trigger('click');
            }
        });
    });    
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

function check_session(){
    $.ajax({
        type: "POST",
        url: "PHP/lr_control.php",
        data: {
            'check_session' : 0
        },
        success: function (response) {
            console.log(response);
            if (response != 0){
                console.log(response);
                idUser = response;
                $("#button_fav_songs").show();
                $("#button_fav_songs_lists").show();
            }
            else{
                $("#button_fav_songs").hide();
                $("#button_fav_songs_lists").hide();
            }
        }
    });
}

function loadSongsTable(response) {
    $('#text_message').text("Hecho!");
    json_songs = $.parseJSON(response);
    console.dir(json_songs);
    if ($("#tablaCanciones").children().length != 0) {
        $("#tablaCanciones").DataTable().destroy();
    }
    $("#tablaCanciones").html("<thead> <tr> <th>Titulo</th> <th>Artista</th> <th>Genero</th> <th>Duracion</th> <th>Publicacion</th> </tr> </thead> <tbody id='myTable'>");

    if (idUser) { //Añadir boton de favoritos y tenerlo mapeado.
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

function loadListsTable(response, query) {
    $(".splide__list").empty();
    if($(".sidebar")[0].style.left != sidebarWidth){
        closeSidebar();
    }
    $('#text_message').text("Hecho!");
    json_lists = $.parseJSON(response);
    console.dir(json_lists);
    if (query == "artists-list") {
        $("#contenido_list_type").text("Artistas destacados");
    }
    else if (query == "songs-lists") {
        $("#contenido_list_type").text("Listas de música");
    }
    else if (query == "category-lists") {
        $("#contenido_list_type").text("Generos");
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
    
    if(!first_scroll){ // Temporal fix
        first_scroll = true;
    }
    else{
        window.scrollTo(0,document.body.scrollHeight);
    }
    
}

function loadDefaultLists() { // Cambiar
    /*
    $.ajax({
        type: "POST",
        url: "PHP/db_control.php",
        data: {
            'queryValue': 'default-lists'
        },
        success: function (response) {
            $('#text_message').text("Hecho!");
            json_def_lists = $.parseJSON(response);
            console.dir(json_def_lists);
            for (row of json_def_lists) {
                console.log("Hello")
                $("<br><br><button type='button' id='access-list-" + row["idLista"] + "' onClick='reply_click_list(this.id)'>" + row["nombreLista"] + "</button>").insertAfter("#button_categories");
            }
        }
    });*/
}

function reply_click_list(id) {
    console.log(id);
    let list_name = id.substr(0, 11);
    console.log(list_name);
    let id_list = parseInt(id.substr(id.length - 1));
    console.log(id_list);
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
}

function reply_click_song(id) {
    if ($("#openPlayer").text() == "keyboard_arrow_up"){
        openPlayer();
    }
    object_id_song = id;
    let song_object;
    let song_ID;
    console.log(id);
    // PROBAR 2º Metodo
    /*
    song_object = json_songs.find(song => song['idCancion'] === parseInt(id.substr(id.length - 1)));
    console.log(song_object);
    song_ID = song_object['enlace'];
    $("#artist_name").html("<strong>" + song_object['artista'] + "</strong>");
    $("#song_name").html("<strong>" + song_object['titulo'] + "</strong>");
    $("#category_name").html("<strong>" + song_object['genero'] + "</strong>");
    */
    
    //1º Metodo
    for (var key in json_songs) {
        if (json_songs[key]['idCancion'] == parseInt(id.substr(id.length - 1))) {
            song_ID = json_songs[key]['enlace'];
            //Aqui se pueden coger el resto de campos y cargarlos en unos <p> o lo que sea
            $("#artist_name").html("<strong>" + json_songs[key]['artista'] + "</strong>");
            $("#song_name").html("<strong>" + json_songs[key]['titulo'] + "</strong>");
            $("#category_name").html("<strong>" + json_songs[key]['genero'] + "</strong>");
            break;
        }
    }
    
    console.log(song_ID);
    //This function creates an <iframe> (and YouTube player) after the API code downloads
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

function onYouTubeIframeAPIReady(song_ID) {
    if(song_ID){
        player = new YT.Player('music_player', {
            height: '360',
            width: '640',
            videoId: song_ID,
            //playerVars: { 'autoplay': 1, 'controls': 0 },
            events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange
            }
          });
    }
}

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
        console.log(event.target.getPlayerState());
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
            //console.log(event.target.getCurrentTime());
        }, 1000);
    }

    $('#time_slider').on('input', function () {
        //console.log($('#time_slider').val());
        event.target.seekTo($(this).val(), true);
        $('#time_slider').val($(this).val());
    });
    
    $('#vol_slider').on('input', function () {
        //console.log($('#vol_slider').val());
        event.target.setVolume($(this).val());
        $('#vol_slider').val($(this).val());
        $('#vol_output').text($(this).val() + "%"); 
    });
}

function onPlayerStateChange(event) {
    if(event.target.getPlayerState() == 0){
        player.stopVideo();
        $("#time_slider").val(0);
        $("#next_song").trigger("click");
    }
}

