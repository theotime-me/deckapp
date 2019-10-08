function getData(expandedURL, i, cb) {
	expanded.push(expandedURL);

	switch (expandedURL.nature) {
		case "youtube-video": 
			$.ajax({
				url: "https://www.googleapis.com/youtube/v3/videos?part=snippet&id="+expandedURL.id+"&key=AIzaSyDV70ZXwnBFKJQu6P8zyYUx2gXXXJzMKlY",
				async: true,
				success(obj){
					let video = obj.items[0].snippet;

					expandedURL.description = video.description;
					expandedURL.title = video.title;
					expandedURL.author = video.channelTitle;
					expandedURL.channelUrl = "https://youtube.com/channel/"+video.channelId;
					expandedURL.date = video.publishedAt;

					display(expandedURL, i);
				}
			});
		break;

		case "deezer-track":
			$.ajax({
				url: "https://cors-anywhere.herokuapp.com/https://api.deezer.com/track/"+expandedURL.id,
				async: true,
				success(obj){
					expandedURL.url = obj.link;
					expandedURL.title = obj.title;
					expandedURL.duration = obj.duration;
					expandedURL.artist = {
						name: obj.artist.name,
						picture: obj.artist.picture_medium,
						url: obj.artist.link
					};
					expandedURL.album = {
						title: obj.album.title,
						cover: obj.album.cover_medium,
						date: obj.album.release_date,
						url: obj.album.link
					};

					display(expandedURL, i);
				}
			});
		break;

		case "short-url":
			switch (expandedURL.shortener) {
				case "sck.pm":
					$.getJSON("https://thme-cors.herokuapp.com/https://api.sck.pm/expand?"+expandedURL.id, function(obj) {
						expandedURL.target = obj.url;

						display(expandedURL, i);
					});
				break;

				default:
					expandedURL.target = expandedURL.id;
					display(expandedURL, i);
			}
		break;

		case "google-search": 
			$.ajax({
				url: "https://www.googleapis.com/customsearch/v1?cx=017567266544748746605:9-8clqys140&key=AIzaSyCyZgRt-igTYO05X_8LgDwoOsZgdqf4h3U&q="+expandedURL.search+"&num=4",
				async: true,
				success(obj){
					let results = obj.items;

					expandedURL.results = [];

					for (let i = 0; i<4; i++) {
						expandedURL.results.push({
							title: results[i].title,
							url: results[i].link,
							displayUrl: results[i].displayLink,
							desc: results[i].snippet
						});
					}

					display(expandedURL, i);
					if (cb) {
						cb();
					}
				}
			});
		break;

		default:
			display(expandedURL, i);
			if (cb) {
				cb();
			}
	}
}