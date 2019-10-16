function algo(url) {
	let noHttp = url.replace(/http:\/\/|https:\/\//, "").replace("www.", ""),
		domain = noHttp.split("/")[0],
		noSubdomain = domain.split(".")[domain.split(".").length -2]+"."+domain.split(".")[domain.split(".").length -1];
		path = noHttp.replace(domain+"/", ""),
		out = {
			nature: "undefined",
			url: url
		};

		if (path.endsWith("/")) {
			path = path.substring(0, path.length - 1);
		}

	if (["fonts.google.com", "docs.google.com", "thetimes.co.uk"].includes(domain)) {
		noSubdomain = domain;
	}

	switch(noSubdomain) {
		case "ecosia.org": case "yahoo.com": case "duckduckgo.com": case "qwant.com": case "yandex.com":
			let s1 = path.replace(/\?|&/g, "&SPLIT&"),
			s2 = s1.split("&SPLIT&"),
			search = "";

			for (let i = 0; i<s2.length; i++) {
				if (s2[i].split("=")[0] == (noSubdomain == "yandex.com" ? "text" : (noSubdomain == "yahoo.com" ? "p" : "q"))) {
					search = decodeURIComponent(s2[i].split("=")[1].replace(/\+/g, " "));
					break;
				}
			}

			out.engine = domain.split(".")[domain.split(".").length -2];
			out.nature = out.engine+"-search";
			out.search = search;

			switch (noSubdomain) {
				case "yahoo.com": out.color = "410093"; break;
				case "ecosia.org": out.color = "36ACB8"; break;
				case "duckduckgo.com": out.color = "DE5833"; break;
				case "qwant.com": out.color = "353c52"; break;
				case "yandex.com": out.color = "ffcc00"; break;
			}
		break;

		case "github.com": 
			if (path.includes("/") && !path.endsWith("/")) {
				if (path.split("/")[path.split("/").length -1].includes(".")) {
					out.nature = "github-file";
					out.user = path.split("/")[0];
					out.repos = path.split("/")[1];
					out.ext = path.split(".")[path.split(".").length -1];
					out.file = path.split("/")[path.split("/").length -1];
				} else if (path.split("/")[2] == "tree") {
					out.nature = "github-folder";
					out.user = path.split("/")[0];
					out.repos = path.split("/")[1];
					out.path = path.split("/tree/master/")[1];
				} else {
					out.nature = "github-repos";
					out.user = path.split("/")[0];
					out.repos = path.split("/")[1];
				}
			} else if (path.includes("/") && path.split("/")[1] != "") {
				out.nature = "github-user";
				out.user = path.split("/")[0];
			}

			out.color = "333";
		break;

		case "docs.google.com":
			if (["document", "presentation", "spreadsheets"].includes(path.split("/")[0])) {
				out.type = path.split("/")[0];
				out.id = path.split("/")[2];
				out.nature = "google-docs-file";
			}

			out.color = "4285f4";
		break;

		case "fonts.google.com":
			if (path.startsWith("specimen/")) {
				out.nature = "google-font";
				out.font = path.split("/")[1];
			}

			out.color = "ff5252";
		break;

		case "google.com": case "google.fr":
			if (path.startsWith("search")) {
				let s1 = path.replace(/\?|&/g, "&SPLIT&"),
					s2 = s1.split("&SPLIT&"),
					search = "";

					for (let i = 0; i<s2.length; i++) {
						if (s2[i].split("=")[0] == "q") {
							search = decodeURIComponent(s2[i].split("=")[1].replace(/\+/g, " "));
							break;
						}
					}

				out.nature = "google-search";
				out.engine = "google";
				out.search = search;
			} else if (path.startsWith("maps")) {
				if (path.startsWith("maps/place/")) {
					let p1 = path.replace("maps/place/", ""),
						p2 = p1.split("/")[0],
						place = decodeURIComponent(p2.replace(/\+/g, " ")),

						l1 = path.replace("maps/place/"+p2+"/", ""),
						l2 = l1.split("/")[0].replace("@", ""),
						lat = l2.split(",")[0],
						lng = l2.split(",")[1];

					out.nature = "gmaps-place";
					out.place = place;
					out.lat = lat;
					out.lng = lng;
				} else if (path.startsWith("maps/@")) {
					let l1 = path.replace("maps/@", ""),
						lat = l1.split(",")[0],
						lng = l1.split(",")[1],
						zoom = l1.split(",")[2];

					out.nature = "gmaps-location";
					out.lat = lat;
					out.zoom = zoom;
					out.lng = lng;
				} else {
					let l1 = path.replace("maps/", ""),
						l2 = l1.split("/")[0].replace("@", ""),
						lat = l2.split(",")[0],
						lng = l2.split(",")[1];

					out.nature = "gmaps-location";
					out.lat = lat;
					out.lng = lng;
				}
			}

			out.color = "4285f4";
		break;

		case "deezer.com":
			let pages = path.split("/"),
				find = true;
			if (pages[pages.length-2] == "track") {
				out.nature = "deezer-track";
			} else if (pages[pages.length-2] == "artist") {
				out.nature = "deezer-artist";
			} else if (pages[1] == "album") {
				out.nature = "deezer-album";
			} else if (pages[pages.length-2] == "playlist") {
				out.nature = "deezer-playlist";
			} else {
				find = false;
			}

			if (find) {
				out.lang = pages[pages.length-3];
				out.id = pages[pages.length-1];
			}

			out.color = "ff0092";
		break;

		case "youtube.com":
			if (path.startsWith("watch")) {
				let id1 = path.replace(/\?|&/g, "&SPLIT&"),
				id2 = id1.split("&SPLIT&"),
				id = "";

				for (let i = 0; i<id2.length; i++) {
					if (id2[i].split("=")[0] == "v") {
						id = decodeURIComponent(id2[i].split("=")[1].replace(/\+/g, " "));
						break;
					}
				}

				out.nature = "youtube-video";
				out.id = id;
			} else if (path === "") {
				out.nature = "youtube";
			} else {
				let channel = path.split("/")[path.split("/").length -1];

				out.nature = "youtube-channel";
				out.channel = channel;
			}

			out.color = "ff0000";
		break;

		case "youtu.be":
			out.nature = "youtube-video";
			out.id = path.split("/")[path.split("/").length -1];

			out.color = "ff0000";
		break;

		case "discordapp.com": case "discord.gg":
			out.nature = "discord-invite";
			out.id = path.split("/")[path.split("/").length -1];

			out.color = "7289da";
		break;

		case "twitter.com":
			if (path != "") {
				if (path.includes("/status/")) {
					out.nature = "twitter-status";
					out.user = path.split("/")[0];
					out.status = path.split("/")[2];
				} else {
					out.nature = "twitter-user";
					out.user = path.split("?")[0];
				}
			}

			out.color = "1da1f2";
		break;

		case "goo.gl": case "bit.ly": case "ouo.io": case "is.gd": case "v.gd": case "lc.cx": case "tinyurl.com": case "sck.pm":
			let id = path,
				shortener = domain;

			out.nature = "short-url";
			out.shortener = shortener;
			out.id = id;

			switch(noSubdomain) {
				case "goo.gl": out.color = "4285f4"; break;
				case "bit.ly": out.color = "ee6123"; break;
				case "ouo.io": out.color = "865cda"; break;
				case "is.gd": out.color = "f00"; break;
				case "v.gd": out.color = "0b0"; break;
				case "tinyurl.com": out.color = "0A2746"; break;
				case "lc.cx": out.color = "F4511E"; break;
				case "sck.pm": out.color = "337ab7"; break;
			}
		break;

		case "stackoverflow.com":
			if (path.startsWith("questions")) {
				let q1 = path.split("/")[path.split("/").length -1],
					question = upCase(q1.replace(/-/g, " ")),
					id = path.split("/")[path.split("/").length -2];

				out.nature = "stackoverflow-question";
				out.question = question;
				out.id = id;
			} else if (path.startsWith("users")) {
				let user = upCase(decodeURIComponent(path.split("/")[path.split("/").length -1])),
					id = path.split("/")[path.split("/").length -2];

				out.nature = "stackoverflow-user";
				out.user = user;
				out.id = id;
			}

			out.color = "f48024";
		break;

		case "wikipedia.org":
			let lang = domain.replace("wikipedia.org", ""),
				page = decodeURIComponent(path.replace("wiki/", "")).replace(/_/g, " ");

			out.nature = "wikipedia-page";
			out.page = page;
			out.lang = lang;
			out.color = "000000";
		break;

		case "instagram.com":
			if (path.split("/")[0] == "p") {
				out.nature = "instagram-picture";
				out.id = path.split("/")[1];
			} else if (path.split("/")[0] == "stories") {
				out.nature = "instagram-story";
				out.user = path.split("/")[1];
			} else if (path.split("/").length == 1 && path.split("/")[1]) {
				out.nature = "instagram-user";
				out.user = path.split("/")[0];
			}

			out.color = "e1306c";
		break;

		case "codepen.io":
			if (path.split("/").length == 1) {
				out.nature = "codepen-user";
				out.user = path.split("/")[0];
			} else if (["pen", "full", "details", "debug", "pres", "live", "collab", "professor"].includes(path.split("/")[1])) {
				out.nature = "codepen-pen";
				out.user = path.split("/")[0];
				out.view = path.split("/")[1];
				out.id = path.split("/")[2];
			}

			out.color = "47cf73";
		break;

		case "franceculture.fr":
			if (path.split("/").length >= 3 && path.split("/")[0] == "emissions") {
				let elements = path.split("/");

				out.title = upCase(elements[2].replace(/-/g, " "))
				out.emission = upCase(elements[1].replace(/-/g, " "))
				out.nature = "franceculture-emission";
			} else if (path.split("/").length == 2) {
				let elements = path.split("/");

				out.title = upCase(elements[1].replace(/-/g, " "));
				out.category = upCase(elements[0].replace(/-/g, " "));
				out.nature = "franceculture-actu";
			}

			out.color = "802489";
		break;

		case "lemonde.fr":
			if (path.split("/").length >= 6) {
				let elements = path.split("/");

				out.title = upCase(elements[5].split("_")[0].replace(/-/g, " "));
				out.date = elements[4]+"/"+elements[3]+"/"+elements[2];
				out.nature = "newspaper-article";
				out.newspaper = "lemonde";
				out.newspaperText = "Le Monde";
			}
		break;

		case "nytimes.com":
			if (path.split("/").length >= 6) {
				let elements = path.split("/");

				out.title = upCase(elements[5].split(".")[0].replace(/-/g, " "));
				out.date = elements[2]+"/"+elements[1]+"/"+elements[0];
				out.nature = "newspaper-article";
				out.newspaper = "nytimes";
				out.newspaperText = "The New York Times";
			}
		break;

		case "thetimes.co.uk":
			if (path.split("/").length >= 3) {
				let elements = path.split("/"),
					title = elements[2].split("-");

				title.pop();

				out.title = upCase(title.join(" "));
				out.date = elements[4]+"/"+elements[3]+"/"+elements[2];
				out.nature = "newspaper-article";
				out.newspaper = "thetimes";
				out.newspaperText = "The Times";
			}
		break;

		case "huffingtonpost.fr":
			if (path.split("/").length >= 2) {
				let elements = path.split("/"),
					title = elements[1].split("-");

				title.shift();

				out.title = upCase(title.join(" ").split("_")[0]);
				out.nature = "newspaper-article";
				out.newspaper = "huffpost";
				out.newspaperText = "Le Huffpost";
			}
		break;

		case "francetvinfo.fr": case "lexpress.fr":
			if (path.split("/").length >= 2) {
				let elements = path.split("/"),
					title = elements[3].split("-");

				out.title = upCase(title.join(" ").split("_")[0]);
				out.nature = "newspaper-article";
				out.newspaper = domain.split(".")[0];
				out.newspaperText = out.newspaper == "francetvinfo" ? "France Info" : "L' Express";
			}

			switch (noSubdomain) {
				case "fracetvinfo": out.color = "ffc300"; break;
				case "lexpress": out.color = "ee535f"; break;
			}
		break;

		case "parismatch.com":
			if (path.split("/").length >= 2) {
				let elements = path.split("/"),
					title = elements[2].split("-");

				title.pop();

				out.title = upCase(title.join(" "));
				out.nature = "newspaper-article";
				out.newspaper = "parismatch";
				out.newspaperText = "Paris Match";
				out.color = "f00";
			}
		break;

		case "lepoint.fr":
			if (path.split("/").length >= 2) {
				let elements = path.split("/"),
					title = elements[1].split("-");

				title.pop();

				let	date = title[title.length -3]+"/"+title[title.length -2]+"/"+title[title.length -1];

				title.pop();
				title.pop();
				title.pop();

				out.title = upCase(title.join(" ").split("_")[0]);
				out.date = date;
				out.nature = "newspaper-article";
				out.newspaper = "lepoint";
				out.newspaperText = "Le Point";

				out.color = "ac0000";
			}
		break;

		case "lejdd.fr":
			if (path.split("/").length >= 2) {
				let elements = path.split("/"),
					title = elements[1].split("-");

				title.pop();

				out.title = upCase(title.join(" "));
				out.nature = "newspaper-article";
				out.newspaper = "lejdd";
				out.newspaperText = "Le JDD";
			}

			out.color = "f00";
		break;

		case "20minutes.fr":
			if (path.split("/").length >= 2) {
				let elements = path.split("/"),
					title = elements[1].split("-");

				title.shift();

				let d = title.join("").split("");
				out.date = d[6]+d[7]+"/"+d[4]+d[5]+"/"+d[0]+d[1]+d[2]+d[3];

				title.shift();

				out.title = upCase(title.join(" "));
				out.nature = "newspaper-article";
				out.newspaper = "20minutes";
				out.newspaperText = "20 Minutes";
				out.color = "0b4892";
			}
		break;

		case "lefigaro.fr":
			if (path.split("/").length >= 2) {
				let elements = path.split("/"),
					title = elements[elements[0] == "langue-francaise" ? 2 : 1].split("-"),
					date = title[title.length -1],
					d = date.split("");

				title.pop();

				out.title = upCase(title.join(" "));
				out.date = d[6]+d[7]+"/"+d[4]+d[5]+"/"+d[0]+d[1]+d[2]+d[3];
				out.nature = "newspaper-article";
				out.newspaper = "lefigaro";
				out.newspaperText = "Le Figaro";
				out.color = "163860";
			}
		break;

		case "newyorker.com":
			if (path.split("/").length >= 3) {
				let elements = path.split("/"),
					title = elements[2].split("-");

				out.title = upCase(title.join(" "));
				out.nature = "newspaper-article";
				out.newspaper = "thenewyorker";
				out.newspaperText = "The New Yorker";
			}

			out.color = "000";
		break;
	}

	let TestImgUrl = url.split("?")[0];

	if (TestImgUrl.endsWith(".jpg") || TestImgUrl.endsWith(".png") || TestImgUrl.endsWith(".gif") ||TestImgUrl.endsWith(".webm")) {
		let file = TestImgUrl.split("/")[TestImgUrl.split("/").length -1],
			ext = file.split(".")[file.split(".").length -1],
			noExt = file.replace(ext, "");

		out.nature = "image-file";
		out.title = noExt+"<span>"+ext+"</span>";
	}

	if (TestImgUrl.endsWith(".xml")) {
		out.nature = "xml";
		out.color = "f26522";
	}

	return out;
}