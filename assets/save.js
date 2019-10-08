const link = {
	add(link, cb) {
		$.getJSON("link/add/"+encodeURIComponent(link)+"/"+userID, function(rep) {
			if (cb) cb(rep);

			links();
		});
	},

	remove(link, cb) {
		$.getJSON("link/remove/"+encodeURIComponent(link)+"/"+userID, function(rep) {
			if (cb) cb(rep);

			links();
		});
	}
};

const links = function(cb) {
	$.getJSON("links/"+userID, function(rep) {
		playlist = rep.links == undefined ? [] : rep.links;

		if (cb) cb(rep); else displayPlaylist();
	});
};