function upCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

let eNavLogo = $("#nav .logo"),
	playlist = [],
	expanded = [],
	withData = [],
	highlightJSimported = false,
	current = 0;

eNavLogo.on("mouseenter", () => {
	Nr($("#nav .page h4").first(), "HOME");
	eNavLogo.leave(() => {
		Nr($("#nav .page h4").first(), "PLAYLISTS");
	});
});

function displayPlaylist(){
	expanded = [];

	$.scrollTop();

	$("#playlist .links").html("");
	
	for (let i = 0; i<playlist.length; i++) {
		$("#playlist .links").append('<a class="child" target="blank"><svg width="40" viewBox="0 0 24 24"><path class="icon" d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg><span class="text"> Chargement ...</span><span class="otherData"></span><div class="icons"><svg onclick="removeLink(event, this)" class="remove" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg><svg class="open" viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg></div></a>');
		getData(algo(playlist[i]), i);
	}

	$("#playlist .links").append('<a class="add"><svg width="40" viewBox="0 0 24 24"><path class="icon" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg><input placeholder="ajouter un lien"></a>');
}

function quick(i, ev) {
	if (ev) ev.preventDefault();

	if ($(".links a .remove").is(":hover")) {
		closeQuicks();
		return false;
	}

	let a = $(".quick"+i).hasClass("visible");
	closeQuicks();

	if (a) {
		$(".quick"+i).removeClass('visible');
	} else {
		$(".quick"+i).addClass('visible');
	}
}

function closeQuicks() {
	$(".quick").removeClass('visible');
}

$("#playlist").on("click", el => {
	if (!$("a").is(":hover") && !$(".quick").is(":hover")) {
		closeQuicks();
	}
});

window.onkeydown = function(e) {
	if ($("#playlist .links a.add input").is(":focus") && e.keyCode == 13) {
		setTimeout(function(){
			let val = $("#playlist .links a.add input").val();

			if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(val)) {
				link.add(val);
			} else {
				$("#playlist .links .add input").selector[0].focus();
				$("#playlist .links .add").addClass("invalid");
				setTimeout(function(){
					$("#playlist .links .add").removeClass("invalid");
				}, 200);
			}
		}, 200);
	} else if (e.keyCode == 27) {
		hideBoxs();
	}
};

function blank(url) {
	var link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    link.href = url;
    link.target = '_blank';
    var event = new MouseEvent('click', {
        'view': window,
        'bubbles': false,
        'cancelable': true
    });
    link.dispatchEvent(event);
}

function removeLink(ev, el) {
	let lnk = $(el.parentNode.parentNode).attr("href");

	link.remove(lnk);

	if (ev) {
		ev.preventDefault();
	}
}

$("#boxs").click(() => {
	if (!$("#boxs div").is(":hover")) {
		hideBoxs();
	}
});

function hideBoxs(){
	$("#boxs").removeClass("hide");
	setTimeout(function(){
		$("#boxs").addClass("right");
		setTimeout(function(){
			$("#boxs").addClass("no-transition");
			$("#boxs").removeClass(["right", "visible"]);
			setTimeout(function(){
				$("#boxs").removeClass("no-transition");
			}, 400);
		}, 400);
	}, 400);
}

// display box Add Playlist
$(".addPlaylist").click(() => {
	$("#boxs").addClass("visible");
	$("#addPlaylist input").selector[0].value = "";
	$("#addPlaylist input").selector[0].focus();
	setTimeout(function(){
		$("#boxs").addClass("hide");
	}, 500);
});

let userID = false;

if ($.getCookie("userID")) {
	userID = $.getCookie("userID");
	$.setCookie("userID", userID, 999);
}

if (userID) {
	links();
} else {
	intro();
}

function intro() {
	$.getJSON("id", function(rep) {
		userID = rep.id;
		$.setCookie("userID", rep.id, 999);

		links();
	});
}