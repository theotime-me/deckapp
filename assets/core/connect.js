var socket = io(),
    uid = $.getCookie("DKID") || false;

if (uid) {
    socket.emit("login", uid);    
} else {
    $("#nav .profile").remove("load");
    setTimeout(function() {
        $("#nav a").removeClass("hidden");
    }, 100);

    $.log("NOT Logged", "error");

    if (!["/login", "/signup"].includes(location.pathname)) {
        location.href = "/login";
    }
}

socket.on("state", data => {
    let profile = data.profile;

    $("#nav .profile").prop("src", profile.avatar).removeClass("load");
    setTimeout(function() {
        $("#nav a").removeClass("hidden");
    }, 100);
});


socket.on("login", (isLogged) => {
    if (isLogged) {
        $.log("Logged", "success");

        if (["/login", "/signup"].includes(location.pathname)) {
            location.href = "/";
        }
    } else {
        $.log("NOT Logged", "error");

        if (!["/login", "/signup"].includes(location.pathname)) {
            location.href = "/login";
        }
    }
});

function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

socket.on("logout", status => {
    if (status == 200) {
        eraseCookie("DKID");
        location.href = "/login";
    }
});
