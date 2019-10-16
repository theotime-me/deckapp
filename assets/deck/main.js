function upCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

let eNavLogo = $("#nav .logo"),
	expanded = [],
	deckID = location.pathname.replace("/", ""),
	currentDeck = {};
	withData = [],
	userProfile = {},
	highlightJSimported = false,
	current = 0,
	icons = {
		public: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
		private: 'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z'
	};

function displayPlaylist(deck, deckID_){
	expanded = [];

	$.scrollTop();

	if (deckID != deckID_) {
		deckID = deckID_;
		window.history.replaceState({deckID: deckID, deck: deck}, deckID, "/"+deckID);
	}

	$.title('"'+deck.name+"\" by "+userProfile.name+" - deckapp");

	$("#playlist .name").val(deck.name);
	$("#playlist .lastModify b").html(fancyDate(deck.lastModify));
	$("#playlist .newLink input").attr("placeholder", 'add a new link to "'+deck.name+'"');
	$("#playlist .links").html("");
	$("#playlist .access svg path").attr("d", deck.public ? icons.public : icons.private);
	$("#playlist .access span").html(deck.public ? "Public" : "Private");

	$(".newLink").removeClass("hidden");

	setTimeout(function() {
		$(".links").removeClass("hidden");
	}, 100);
	
	for (let i = 0; i<deck.links.length; i++) {
		$("#playlist .links").append('<a class="child" target="blank"><svg width="40" viewBox="0 0 24 24"><path class="icon" d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg><span class="text"> Chargement ...</span><span class="otherData"></span><div class="icons"><svg onclick="removeLink(event, this)" class="remove" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg><svg class="open" viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg></div></a>');
		getData(algo(deck.links[i]), i);
	}
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

	if (document.querySelector(".quick"+i+" iframe") && !$(".quick"+i+" iframe").attr("src")) {
		$(".quick"+i+" iframe").prop("src", $(".quick"+i+" iframe").data("src"));
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
	if ($("#playlist .newLink input").is(":focus") && e.keyCode == 13) {
		setTimeout(function(){
			let val = $("#playlist .newLink input").val();
			$("#playlist .newLink input").val("");

			if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(val)) {
				link.add(val);
			} else {
				$("#playlist .newLink input").selector[0].focus();
				$("#playlist .newLink").addClass("invalid");
				setTimeout(function(){
					$("#playlist .newLink").removeClass("invalid");
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

if ($.getCookie("DKID")) {
	userID = $.getCookie("DKID");
	$.setCookie("DKID", userID, 999);
}

if (userID) {
	getDeck();
} else {
	intro();
}

function intro() {
	$.getJSON("id", function(rep) {
		userID = rep.id;
		$.setCookie("userID", rep.id, 999);

		getDeck();
	});
}

function getDeck() {
	socket.emit("deck", undefined, deckID);
}

socket.on("deck", (deck, deckID_) => {
	if (typeof deck !== "number") {
		currentDeck = deck;
		displayPlaylist(deck, deckID_);
	} else if (deck != 200) {
		console.log(deck);
		alert("deck error");
	}
});

socket.on("link", status => {
	if (status == 200) {
		getDeck();
	}
});

socket.on("state", data => {
	userProfile = data.profile;
});

let xRename;

$(".header .name").on("keydown", function() {
	let el = this;
	clearTimeout(xRename);
	xRename = setTimeout(function() {
		rename(el.value);
	}, 300);
});

function rename(value) {
	console.log("a rename");
	socket.emit("deck", "rename", deckID, value);
	$("#playlist .newLink input").attr("placeholder", 'add a new link to "'+value+'"');
	$.title('"'+value+"\" by "+userProfile.name+" - deck");
}

function fancyDate(date) {
	let d = new Date(date).getTime(),
		diff = new Date().getTime() - d,
		day = new Date(date).getDay(),
		dateInMonth = new Date(date).getDate(),
		month = new Date(date).getMonth(),
		year = new Date(date).getFullYear(),
		out = "";

	day = [
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday"
	][day];

	month = [
		"January",
		"Februar",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	][month];

	if (diff < 86400000) {
		if (diff < 3600000) {
			if (diff < 60000) {
				out = "Few seconds ago";
			} else {
				out = Math.floor(diff/60000)+" minutes ago";
			}
		} else {
			out = Math.floor(diff/3600000)+" hour"+(Math.floor(diff/3600000) > 1 ? "s" : "")+" ago";
		}
	} else if (diff < 172800000) {
		out = "Yesterday";
	} else if (diff < 604800000) {
		out = upCase(day);
	} else {
		out = day+" "+dateInMonth+" "+month+" "+year;
	}

	return out;
}

function fancyLink(url) {
	return url.split("//")[1].split("/")[0];
}

const deck = {
    new() {
		$(".links").addClass("hidden");

		setTimeout(function() {
			$(".newLink").addClass("hidden");
		}, 100);

        setTimeout(function() {
            socket.emit('deck', true);
        }, 300);
    },

    open(id) {
        location.href = "/"+id;
    }
};