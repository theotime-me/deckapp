function display(withData, i){
	let text = "Erreur",
		icon = false,
		className = false,
		otherData = false,
		customIcon = false,
		href = withData.url,
		onclick = false;

	switch (withData.nature) {
		case "github-file":
			onclick = "quick("+i+", event)";

			className = "github";
			text = withData.file+"<span> - "+withData.user+"/"+withData.repos+"</span>";
			icon = "M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z";
			$("#playlist .links a.child").selector[i].insertAdjacentHTML('afterend', "<div class='code quick quick"+i+"'><pre><code></code></pre></div>");
			fetch('https://api.github.com/repos/'+withData.user+"/"+withData.repos+'/contents/'+withData.url.split("/blob/master/")[1])
			.then(function(response) {
				return response.json();
			}).then(function(data) {
				$(".quick"+i+" pre code").addClass(withData.ext);

				hljs.highlightBlock($(".quick"+i+" pre code").selector[0]);

				var iframe = document.querySelector('.quick'+i+" pre code"),
					code = atob(decodeURIComponent(data.content));
				iframe.innerHTML = code.length >= 1500 ? code.substring(0, 1450)+"...<a class='more-github' target='blank' href='"+withData.url+"'>Voir le code on Github</span" : code;
			});
		break;

		case "github-folder":
			className = "github";
			text = withData.path+"<span> - "+withData.user+"/"+withData.repos+"</span>";
			icon = "M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z";
		break;

		case "github-user":
			className = "github";
			text = withData.user+" <span>on Github</span>";
			icon = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z";
		break;

		case "github-repos":
			className = "github";
			text = withData.user+"/"+withData.repos+" <span>on Github</span>";
			icon = "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z";
		break;

		case "short-url":
			className = "short-url";
			text = "<span>"+withData.shortener+'<svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg></span>'+withData.target;
			icon = "M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z";

			otherData = withData.full;
		break;

		case "youtube-video":
			let d = new Date(withData.date),
				day = d.getDate(),
				sup = "th",
				year = d.getFullYear();
				month = d.getMonth();

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

				switch (day) {
					case 1: sup = "st"; break;
					case 2: sup = "nd"; break;
					case 3: sup = "rd"; break;
				}

			onclick = "quick("+i+", event)";
			className = "youtube";
			text = withData.title.replace("- "+withData.author, '<span><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>'+withData.author+"</span>");
			$("#playlist .links a.child").selector[i].insertAdjacentHTML('afterend', "<div class='youtube quick quick"+i+"'><iframe frameborder='0' height='315' width='560' allowfullscreen data-src='https://www.youtube-nocookie.com/embed/"+withData.id+"'></iframe><h3>"+(withData.title.length >= 35 ? withData.title.substring(0, 32)+"..." : withData.title)+"</h3><h4>posted by <a class='inline' href='"+withData.channelUrl+"' target='blank'>"+withData.author+"</a> the "+day+"<sup>"+sup+"</sup> "+month+" "+year+"</h4><p>"+(withData.description.length > 300 ? withData.description.substring(0, 250)+"<span class='text-end'>"+withData.description.substring(250, 300)+"...</span> <a href='https://youtube.com/watch/?v="+withData.id+"' target='blank'>Read more on Youtube</a>" : withData.description)+"</p></div>");
			icon = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z";
		break;

		case "youtube-channel":
			className = "youtube";
			text = withData.channel;
			icon = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z";
		break;

		case "discord-invite":
			className = "discord";
			text = 'Discord invite<span><svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>'+withData.id+"</span>";
			icon = "M21.99 8c0-.72-.37-1.35-.94-1.7L12 1 2.95 6.3C2.38 6.65 2 7.28 2 8v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2l-.01-10zM12 13L3.74 7.84 12 3l8.26 4.84L12 13z";
		break;

		case "codepen-user":
			className = "codepen";
			text = withData.user;
			icon = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z";
		break;

		case "codepen-pen":
			onclick = "quick("+i+", event)";
			className = "codepen";
			text = "Pen de "+upCase(withData.user);
			icon = "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z";

			$("#playlist .links a.child").selector[i].insertAdjacentHTML('afterend', "<div class='quick quick"+i+"'><iframe frameborder='0' height='330' width='90%' allowfullscreen data-src='https://codepen.io/"+withData.user+"/embed/"+withData.id+"/?theme-id=light&default-tab=result'></iframe></div>");
		break;

		case "instagram-user":
			className = "instagram";
			text = withData.user;
			icon = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z";
		break;

		case "google-docs-file":
			text = "Google "+withData.type;

			switch (withData.type) {
				case "presentation": text = "Google slide"; icon = "M10 8v8l5-4-5-4zm9-5H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"; break;
				case "document": icon = "M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z"; break;
				case "spreadsheets": text = "Google sheet"; icon = "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"; break;
			}

			className = "gdocs-"+text.replace("Google ", "");

			text += '<span><svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/></svg>'+withData.id.substring(0, 20)+"...</span>";
		break;

		case "google-font":
			className = "gfont";
			text = withData.font+" <span>on Google Fonts</span>";
			icon = "M9.93 13.5h4.14L12 7.98zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.05 16.5l-1.14-3H9.17l-1.12 3H5.96l5.11-13h1.86l5.11 13h-2.09z";
		break;

		case "instagram-picture":
			className = "instagram";
			text = "Photo Instagram";
			icon = "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.9 13.98l2.1 2.53 3.1-3.99c.2-.26.6-.26.8.01l3.51 4.68c.25.33.01.8-.4.8H6.02c-.42 0-.65-.48-.39-.81L8.12 14c.19-.26.57-.27.78-.02z";
		break;

		case "instagram-story":
			className = "instagram";
			text = "story de "+upCase(withData.user);
			icon = "M17 1.01L7 1c-1.1 0-1.99.9-1.99 2v18c0 1.1.89 2 1.99 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z";
		break;

		case "twitter-user":
			className = "twitter";
			text = withData.user;
			icon = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z";
		break;

		case "twitter-status":
			className = "twitter";
			text = "Tweet de "+withData.user;
			icon = "M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z";
		break;

		case "xml":
			let length = withData.title.length+1+withData.description.length;
			className = "xml";
			text = withData.title+'<span><svg viewBox="0 0 24 24"><path d="M3 18h12v-2H3v2zM3 6v2h18V6H3zm0 7h18v-2H3v2z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>'+(length > 70 ? withData.description.substring(0, 67)+"..." : withData.description);
			customIcon = true;
			icon = '<circle cx="6.18" cy="17.82" r="2.18"/><path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/>';
			onclick = "quick("+i+", event)";
			$("#playlist .links a.child").selector[i].insertAdjacentHTML('afterend', `<div class='xml quick quick${i}'>
				<div class="header"><img src="${withData.img}" /><h4>${withData.title}</h4></div>
				<div class="latest">
					<p>LATEST <span>· ${fancyDate(withData.lastModif)}</span></p>
					<a target="blank" href="${withData.items[0].link}">${withData.items[0].title}<span>${fancyLink(withData.items[0].link)}</span></a>
				</div>
			</div>`);
		break;

		case "google-search":
			onclick = "quick("+i+", event)";
			let results = "";

			for (let i = 0; i<4; i++) {
				let title = withData.results[i].title;
				results += "<a target='blank' href='"+withData.results[i].url+"'><span class='title'>"+(title.length >= 45 ? title.substring(0, 42)+"..." : title)+"</span><span class='url'>"+withData.results[i].displayUrl+"</span></a>";
			}
			$("#playlist .links a.child").selector[i].insertAdjacentHTML('afterend', "<div class='search quick quick"+i+"'>"+results+"</div>");
		break;

		case "newspaper-article":
			text = '<span>'+withData.newspaperText+'</span><svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/></svg>'+withData.title+(["lemonde", "nytimes", "lefigaro", "lepoint", "20minutes"].includes(withData.newspaper) ?'<span><svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>'+withData.date+"</span>" : "");
			icon = "M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z";
		break;

		case "franceculture-emission":
			className = "franceculture"
			text = '<span>'+withData.emission+'</span><svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/></svg>'+withData.title;
			icon = "M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.89 2 2 2h16c1.11 0 2-.9 2-2V8c0-1.11-.89-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h-2v2H4V8h16v4z";
		break;

		case "franceculture-actu":
			className = "franceculture"
			text = '<span>'+withData.category+'</span><svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/></svg>'+withData.title;
			icon = "M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z";
		break;

		case "gmaps-place":
			onclick = "quick("+i+", event)";
			text = withData.place;
			icon = "M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z";

			$("#playlist .links a.child").selector[i].insertAdjacentHTML('afterend', "<div class='quick quick"+i+"'><iframe frameborder='0' height='315' width='90%' data-src='https://www.google.com/maps/embed/v1/place?key=AIzaSyAJSyBgYsGbs7br8JiQw70NYIFbaQClaXc&q="+withData.place+"'></iframe></div>");
		break;

		case "gmaps-location":
			onclick = "quick("+i+", event)";
			text = "Google maps location";
			icon = "M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z";

			$("#playlist .links a.child").selector[i].insertAdjacentHTML('afterend', "<div class='quick quick"+i+"'><iframe frameborder='0' height='315' width='90%' data-src='https://www.google.com/maps/embed/v1/view?key=AIzaSyAJSyBgYsGbs7br8JiQw70NYIFbaQClaXc&center="+withData.lat+","+withData.lng+"&zoom="+withData.zoom+"'></iframe></div>");
		break;

		case "stackoverflow-question":
			className = "stackoverflow";
			text = withData.question;
			icon = "M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z";
		break;

		case "deezer-track":
			let date = withData.album.date.split("-"),
				duration = withData.duration,
				minutes = Math.floor(duration / 60),
				seconds = duration - minutes * 60,
				albumName = withData.album.title.length > 25 ? withData.album.title.substring(0, 20)+"..." : withData.album.title;

			seconds = (seconds < 10 ? "0"+seconds : seconds);
				
			duration = minutes+":"+seconds;

			date.reverse();
			date.join("O");

			date = date[0]+"/"+date[1]+"/"+date[2];

			onclick = "quick("+i+", event)";
			className = "deezer";
			text = withData.title+" - "+withData.artist.name;
			icon = "M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z";
			$("#playlist .links a.child").selector[i].insertAdjacentHTML('afterend', "<div class='quick deezer quick"+i+"'><a class='img' href='"+withData.album.url+"' target='blank'><img class='cover' src='"+withData.album.cover+"'></a><h4>"+(withData.title.length > 25 ? withData.title.substring(0, 22)+"..." : withData.title)+"</h4><a href='"+withData.url+"' class='play' target='blank'><svg viewBox='0 0 24 24'><path d='M0 0h24v24H0z' fill='none'/><path d='M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'/></svg><span class='duration'>"+duration+"</span><span class='listen'>Listen \""+albumName+"\" on Deezer</span></a><a class='author' href='"+withData.artist.url+"' target='blank'><img src='"+withData.artist.picture+"' /><span class='text'>"+withData.artist.name+"</span><span class='date'>"+date+"</span></a></div>");
		break;

		case "wikipedia-page":
			text = withData.page+" <span>on Wikipedia</span>";
			icon = "M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z";
		break;

		case "image-file":
			onclick = "quick("+i+", event)";
			className = "file";
			text = withData.title;
			icon = "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.9 13.98l2.1 2.53 3.1-3.99c.2-.26.6-.26.8.01l3.51 4.68c.25.33.01.8-.4.8H6.02c-.42 0-.65-.48-.39-.81L8.12 14c.19-.26.57-.27.78-.02z";
			$("#playlist .links a.child").selector[i].insertAdjacentHTML('afterend', "<div class='quick quick"+i+"'><img src='"+withData.url+"'></div>");
		break;

		default:
			text = withData.url.split("//")[1];

			if (text.endsWith("/")) {
				text = text.substring(0, text.length - 1);
			}

			icon = "M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z";
	}

	if (withData.nature.endsWith("search")) {
		className = "search";
		text = "Recherche "+withData.engine+": <span>"+withData.search+"</span>";
		icon = "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z";
	}

	$("#playlist .links a.child .text").selector[i].innerHTML = text;	

	if (customIcon) {
		$("#playlist .links a.child > svg").selector[i].innerHTML = icon;
	} else {
		$("#playlist .links a.child > svg").selector[i].innerHTML = "<path class='icon' d='"+icon+"'></path>";
	}

	if (href != false) {
		$("#playlist .links a.child").selector[i].setAttribute("href", withData.url);
	}

	if (otherData) {
		$("#playlist .links a.child .otherData").selector[i].innerHTML = otherData;
	}

	if (className) {
		$("#playlist .links a.child").selector[i].classList.add(className);
	}

	if (onclick) {
		$("#playlist .links a.child").selector[i].setAttribute("onclick", onclick);
	}
}