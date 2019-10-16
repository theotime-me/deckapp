function upCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

socket.on("state", (data) => {
    display.shown(data.decks);
    display.all(data.decks);
    $(".intro h1 span").html(data.profile.name).addClass("ready");
});

socket.on("deck", (deck_, deckID) => {
    if (!deck_) {
        console.error("Deck error");
    } else {
        deck.open(deckID);
    }
});

$(window).on("click", ev => {
    if (!$(".others .decks").is(":hover")) {
        display.select(false);
    }
});

const deck = {
    new() {
        for(let i = 0; i<$(".shown > div").selector.length; i++) {
            setTimeout(function() {
                $($(".shown > div").selector[i]).addClass("hidden");
            }, i*100);
        }

        setTimeout(function() {
            socket.emit('deck', true);
        }, 300);
    },

    open(id) {
        location.href = "/"+id;
    }
};