Array.prototype.remByVal = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === val) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
}

var express = require("express"),
	app = express(),
	checkURL = require("valid-url"),
	hash = require("node-password-util").hash,
	compare = require("node-password-util").compare,
	shortid = require('shortid'),
	server = require('http').Server(app);
	io = require('socket.io').listen(server),
	fs = require("fs"),
	md5 = require('md5'),

	decks = {},
	users = {};

app.get("/assets/:folder/:file", (req, res) => {
	let ct = "text/plain";


	switch (req.params.file.split(".")[1]) {
		case "js": ct = "text/javascript"; break;
		case "css": ct = "text/css"; break;
		case "svg": ct = "image/svg+xml"; break;
	}

	res.set("Content-Type", ct);
	res.header(200);
	res.sendFile(__dirname+"/assets/"+req.params.folder+"/"+req.params.file);
}).get("/login", function(req, res) {
	res.render("login.ejs");
}).get("/signup", function(req, res) {
	res.render("signup.ejs");
}).get("/:deck", function(req, res) {
	let dk = "DK"+req.params.deck,
		title = "A private deck";

	if (decks[dk] == undefined) {
		title = "Deck not found !";
	} else if (decks[dk].public) {
		title = '"'+decks[dk].name+"\" by "+users[decks[dk].owner].name;
	}

	res.render("deck.ejs", {title: title+" - deckapp"});
}).get("/", function(req, res) {
	res.render("index.ejs");
});

function canAccess(user, socket) {
	let origin = socket.handshake.address,
		listed = false;

	user.computers.forEach(el => {
		if (el == origin) {
			listed = true;
		}
	});

	return listed;
}

function getIDByEmail(email) {
	let id = false;
	loopIntoUsers((user, id_) => {
		if (user.email == email.toLowerCase()) {
			id = id_;
		}
	});

	return id;
}

io.on('connection', function(socket){
	socket.on("login", function(id) {
		if (Object.keys(users).includes(id)) {
			if (canAccess(users[id], socket)) {
				socket.uid = id;
				socket.emit("login", true);
				getState(socket);
			} else {
				socket.emit("login", false);				
			}
		} else {
			socket.emit("login", false);
		}
	});

	socket.on("login-page", function(profile) {
		let testID = getIDByEmail(profile.email);

		if (testID == false) {
			socket.emit("login-page", 404);
			return false;
		}

		compare(users[testID], profile.password).then(match => {
			if (match) {
				if (!users[testID].computers.includes(socket.handshake.address)) {
					users[testID].computers.push(socket.handshake.address);
				}
				
				socket.emit("login-page", testID);
			} else {
				socket.emit("login-page", 403);
			}
		});
	});

	socket.on("logout", function() {
		if (socket.uid) {
			users[socket.uid].computers = users[socket.uid].computers.remByVal(socket.handshake.address);

			socket.emit("logout", 200);
		} else {
			socket.emit("logout", 404);
		}
	});

	socket.on("signup", (newProfile) => {
		if (!checkSignup(newProfile)) {
			socket.emit("signup", 403);
			return false;
		}

		let id = "DKID"+shortid.generate(),
			email = newProfile.email.toLowerCase(),
			avatar = newProfile.avatar == "" ? "https://www.gravatar.com/avatar/"+md5(newProfile.email)+"?size=50&default=retro" : newProfile.avatar;

		users[id] = {
			name: newProfile.username,
			email: email,
			password: newProfile.password,
			avatar: avatar,
			computers: [socket.handshake.address],
			decks: []
		};

		hash(users[id]).then(() => {
			console.log(users[id]);
		});

		socket.emit("signup", id);
	});

	socket.on("state", function() {
		getState(socket);
	});

	socket.on("link", (link, add, deck) => { // Insert [link] in [deck]
		checkUser(socket, function(id) {
			if (!checkURL.isUri(link)) {
				socket.emit("link", 404);
			}

			let dk = "DK"+deck;
			if (Object.keys(decks).includes(dk)) {
				if (decks[dk].owner != id) {
					socket.emit("link", 403);
					return false;
				}

				if (add) {
					if (!decks[dk].links.includes(link)) {
						decks[dk].links.push(link);
					}
				} else {
					let index = decks[dk].links.indexOf(link);

					if (index > -1) {
						decks[dk].links.splice(index, 1);
					}
				}

				decks[dk].lastModify = new Date().toISOString();
				socket.emit("link", 200, add ? "added" : "removed");
			} else {
				socket.emit("deck", 404);
			}
		});
	});

	socket.on("deck", (newDeck, deckID, rename) => {
		checkUser(socket, function(id) {
			deckID = "DK"+deckID;

			if (newDeck == true) {
				let deckID = "DK"+shortid.generate();
				decks[deckID] = {
					name: "New deck",
					owner: id,
					public: false,
					created: new Date().toISOString(),
					lastModify: new Date().toISOString(),
					links: []
				};

				users[id].decks.push(deckID);

				socket.emit("deck", decks[deckID], deckID.replace("DK", ""));
			} else if (newDeck == false && deckID != undefined) {
				if (!decks[deckID]) {
					socket.emit("deck", 404);
					return false;
				}

				if (decks[deckID].owner == id) {
					delete decks["DK"+deckID];
				} else {
					socket.emit("deck", 403);
				}
			} else if (newDeck == undefined) {
				if (!decks[deckID]) {
					socket.emit("deck", 404);
					return false;
				}

				if (decks[deckID].owner == id) {
					socket.emit("deck", decks[deckID], deckID.replace("DK", ""));
				} else {
					socket.emit("deck", 403);
				}
			} else if (newDeck == "rename" && rename != undefined) {
				if (!decks[deckID]) {
					socket.emit("deck", 404);
					return false;
				}

				if (decks[deckID].owner == id) {
					decks[deckID].name = rename;
					socket.emit("deck", 200, "rename");
				} else {
					socket.emit("deck", 403);
				}
			}
		});
	});
});

function loopIntoUsers(cb) {
	Object.keys(users).forEach(el => {
		cb(users[el], el);
	});
}

function getState(socket) {
	checkUser(socket, function(id) {
		let decksOfUser = {},
			profile = {};

		users[id].decks.forEach(el => {
			decksOfUser[el.replace("DK", "")] = decks[el];
		});

		Object.keys(users[id]).forEach(el => {
			if (el != "decks") {
				profile[el] = users[id][el];
			}
		});

		socket.emit("state", {
			profile: profile,
			decks: decksOfUser
		});
	});
}

server.listen(process.env.PORT || 3000);

console.log("DECKAPP ENGINE v1.0 - starting");

function checkUser(socket, cb) {
	let id = socket.uid;

	if (Object.keys(users).includes(id)) {
		cb(id);
	} else {
		socket.emit("login", false);
	}
}

function checkEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	let isValidEmail = re.test(String(email).toLowerCase()),
		exists = false;

	loopIntoUsers((user, id) => {
		if (user.email == email) {
			exists = true;
		}
	});

	return !exists && isValidEmail;
}

function getBadChars(str) {
    return str.replace(/[A-z0-9\-éèëï]/g, "")+(str.match(/\[|\]/g) || [""])[0];
}

function checkUsername(username) {
	let isOkay = true,
		firstChar = username.substring(0, 1),
		lastChar = username.slice(-1),
		badChars = getBadChars(username);

	if (username.length < 5 || username.length > 20 || badChars.length != 0 || ["_", "-"].includes(firstChar) || ["_", "-"].includes(lastChar)) {
		isOkay = false;
	}

	return isOkay;
}

function checkPassword(password) {
	return (password.match(/[0-9]/g) || []).join("").length >= 2 && password.length >= 7;
}

function checkSignup(profile) {
	return checkEmail(profile.email) && checkUsername(profile.username) && checkPassword(profile.password);
}