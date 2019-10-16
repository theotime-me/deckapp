const link = {
	add(link) {
		socket.emit("link", link, true, deckID);
	},

	remove(link) {
		socket.emit("link", link, false, deckID);
	}
};