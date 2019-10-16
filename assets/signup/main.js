let icons = {
    lock: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z",
    unlock: "M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z",
    done: 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z',
    invalid: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    eye_outline: 'M12 6.5c3.79 0 7.17 2.13 8.82 5.5-1.65 3.37-5.02 5.5-8.82 5.5S4.83 15.37 3.18 12C4.83 8.63 8.21 6.5 12 6.5m0-2C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5m0-2c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5 4.5-2.02 4.5-4.5-2.02-4.5-4.5-4.5z',
    eye_filled: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
    account: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z',
    next: 'M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z',
},

signupProfile = {
    username: $(".input.username input").val(),
    email: $(".input.email input").val(),
    avatar: "",
    password: ""
};

function onGoogleSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();

    signupProfile.username = profile.getName();
    signupProfile.email = profile.getEmail();
    signupProfile.avatar = profile.getImageUrl();

    next();
}

function next() {
    if (!checkUsername(signupProfile.username) || !checkEmail(signupProfile.email)) {
        alert("incorrent information about your email or your username");
        return false;
    }

    $(".input.password input").val("");
    checkData(false);

    $(".box.first").addClass("hidden");
    $(".box.password").css("display", "block");

    setTimeout(function() {
        $(".box.first").css("display", "none");
        $(".box.password").removeClass("hidden");
    }, 200);
}

$(".input.email input").on("keydown", function(ev) {
    let el = this;
    setTimeout(function() {
        let val = (el.value);
        signupProfile.email = val;

        checkFirstData(val, signupProfile.username);
    }, 50);
});

$(".input.username input").on("keydown", function(ev) {
    let el = this;
    setTimeout(function() {
        let val = (el.value);
        signupProfile.username = val;

        checkFirstData(signupProfile.email, val);
    }, 50);
});

checkFirstData($(".input.email input").val(), $(".input.username input").val());

function checkFirstData(email, username) {
    let emailOK = checkEmail(email),
        usernameOK = checkUsername(username),
        usernameReason = checkUsername(username, true);

    $(".box.first .button").addClass("disabled");

    if (!usernameOK) {
        $(".box.first .button span").html("username "+usernameReason);
        $(".box.first .button svg path").attr("d", icons.invalid);
    } else if (!emailOK) {
        $(".box.first .button span").html("invalid email");
        $(".box.first .button svg path").attr("d", icons.invalid);
    } else {
        $(".box.first .button svg path").attr("d", icons.next);
        $(".box.first .button span").html("continue");
        $(".box.first .button").removeClass("disabled");
    }
}

$(".box.first .next").on("click", function() {
    next();
});

function checkUsername(username, reason_) {
    reason = "okay";
    let firstChar = username.substring(0, 1),
        lastChar = username.slice(-1);

    if (username.length < 5) {
        reason = "is too short";
    } else if (username.length > 20) {
        reason = "is too long";
    }

    let badChars = getBadChars(username);

    if (badChars.length != 0) {
        let badLetter = badChars.substring(0, 1);
        reason = "contains "+(badLetter == " " ? "a space" : '\"'+badLetter+'\"');
    } else if (["_", "-"].includes(firstChar)) {
        reason = "starts by \""+firstChar+'"';
    } else if (["_", "-"].includes(lastChar)) {
        reason = "ends by \""+lastChar+'"';
    }

    if (reason_) {
        return reason;
    } else {
        return reason == "okay";
    }
}

function getBadChars(str) {
    return str.replace(/[A-z0-9\-éèëï]/g, "")+(str.match(/\[|\]/g) || [""])[0];
}

$(".box.password input").on("keydown", function(ev) {
    let el = this;
    setTimeout(function() {
        let val = $(el).val(),
            help = $(".box.password .help"),
            factors = {
                length_: false,
                numbers: false
            },
            allFactorsOk = true;

        if (val.length >= 7) {
            $(".length", help).removeClass("invalid");
            $(".length svg path").attr("d", icons.done);
            factors.length_ = true;
        } else {
            $(".length", help).addClass("invalid");
            $(".length svg path").attr("d", icons.invalid);
            factors.length_ = false;
        }

        if ((val.match(/[0-9]/g) || []).join("").length >= 2) {
            $(".numbers", help).removeClass("invalid");
            $(".numbers svg path").attr("d", icons.done);
            factors.numbers = true;
        } else {
            $(".numbers", help).addClass("invalid");
            $(".numbers svg path").attr("d", icons.invalid);
            factors.numbers = false;
        }

        Object.keys(factors).forEach(el => {
            if (factors[el] == false) {
              allFactorsOk = false;
            }
        });

        if (allFactorsOk) {
            $(".input svg.lock path").attr("d", icons.lock);
            signupProfile.password = val;
        } else {
            $(".input svg.lock path").attr("d", icons.unlock);
        }

        checkData(allFactorsOk);
    }, 50);
});

function checkData(passwordFactors) {
    if (passwordFactors && checkEmail(signupProfile.email)) {
        $(".continue").removeClass("disabled");
        $(".continue span").html("Sign up");
        $(".continue svg path").attr("d", icons.account);
    } else {
        $(".continue").addClass("disabled");

        if (!checkEmail(signupProfile.email)) {
            $(".continue span").html("bad email");
            $(".continue svg path").attr("d", icons.invalid);
        } else if (!passwordFactors) {
            $(".continue span").html("password isn't strong");
            $(".continue svg path").attr("d", icons.unlock);
        }
    }
}

function checkEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function togglePasswordView() {
    let box = $(".input.password"),
        input = $("input", box),
        path = $("svg.eye path", box);

    if (input.attr("type") == "password") {
        input.attr("type", "text");
        path.attr("d", icons.eye_outline);
    } else {
        input.attr("type", "password");
        path.attr("d", icons.eye_filled);
    }

    input.first().focus();
}

$(".box.password .continue").on("click", function() {
    if (!$(this).hasClass("disabled")) {
        finish();
    }
});

function finish() {
    if (checkEmail(signupProfile.email) && checkUsername(signupProfile.username)) {
        sendData(signupProfile);
        $(".continue.button span").addClass("hidden");
    }
}

function sendData() {
    signupProfile.passwordMD5 = true;
    signupProfile.password = md5(signupProfile.password);
    socket.emit("signup", signupProfile);
}

socket.on("signup", id => {
    if (id == 403) {
        alert("Invalid information about your email, your password can be too weak and maybe your username is incorrect, sorry ^^");
        console.log(signupProfile);
    } else {
        $.setCookie("DKID", id, 999);
        location.href = "/";
    }
});