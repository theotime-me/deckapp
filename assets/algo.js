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
		break;

		case "youtu.be":
			out.nature = "youtube-video";
			out.id = path.split("/")[path.split("/").length -1];
		break;

		case "discordapp.com": case "discord.gg":
			out.nature = "discord-invite";
			out.id = path.split("/")[path.split("/").length -1];
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
		break;

		case "goo.gl": case "bit.ly": case "ouo.io": case "is.gd": case "v.gd": case "lc.cx": case "tinyurl.com": case "sck.pm":
			let id = path,
				shortener = domain;

			out.nature = "short-url";
			out.shortener = shortener;
			out.id = id;
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
		break;

		case "wikipedia.org":
			let lang = domain.replace("wikipedia.org", ""),
				page = decodeURIComponent(path.replace("wiki/", "")).replace(/_/g, " ");

			out.nature = "wikipedia-page";
			out.page = page;
			out.lang = lang;
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

	return out;
}