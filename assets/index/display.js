const display = {
    sort(decks) {
        let lastModifyDates = [],
            decksOut = {};
        
        Object.keys(decks).forEach(el => {
            let deck = decks[el];

            lastModifyDates.push(deck.lastModify);
        });

        lastModifyDates.sort();
        lastModifyDates.reverse();
        
        lastModifyDates.forEach(el => {
            for (let i = 0; i<Object.keys(decks).length; i++) {
                if (el == decks[Object.keys(decks)[i]].lastModify) {
                    decksOut[Object.keys(decks)[i]] = decks[Object.keys(decks)[i]];
                }
            }
        });

        return decksOut;
    },

    shown(decks) {
        decks = this.sort(decks);

        $(".shown").html("");

        let decksDisplayed = 0;

        Object.keys(decks).forEach(el => {
            let deck = decks[el],
                graph = [],
                graphDrawn = "";
                deck.id = el;
                decksDisplayed++;

            if (decksDisplayed > 2) {
                return false;
            }

            deck.links.forEach(el => {
                let algoed = algo(el),
                    clr = "#"+(algoed.color == "000" ? "333" : algoed.color),
                    nature = algoed.nature == "undefined" ? "link" : algoed.nature;

                console.log(algoed);

                if (graph[nature] == undefined) {
                    graph[nature] = {
                        color: clr,
                        times: 1
                    };
                } else {
                    graph[nature].times++;
                }
            });

            Object.keys(graph).forEach(el => {
                let percent = graph[el].times / deck.links.length * 235,
                    nature = el.split("-")[0];

                el = graph[el];

                graphDrawn += `<div style="background-color: ${el.color}; width: ${percent}px">${nature.length*10 > percent ? nature.substring(0, Math.floor(percent /10)-2).length < 2 ? "" :nature.substring(0, Math.floor(percent /10)-2)+"..." : nature}</div>`;
            });

            if (deck.links.length == 0) {
                graphDrawn = `<div class="empty">No links</div>`;
            }

            $(".shownLoader").addClass("hidden");
            $(".shown").append(`<div class="hidden">
            <div class="infos">
                <p class="private"><svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg> Private</p>
                <p class="links"><svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg> ${deck.links.length} links</p>
                <div class="graph">
                    ${graphDrawn}
                </div>
            </div>
            <div class="name">
                <svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
                <div class="text">
                    <a href="/${deck.id}">${deck.name}</a>
                    <p>${deps.fancyDate(deck.lastModify)}</p>
                </div>
            </div>
        </div>`);
        });

        $(".shown").append(`<div class="hidden add" onclick="deck.new()">
        <svg viewBox="0 0 24 24"><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
        <div class="name">
        <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            <div class="text">
                <a>Create a new deck</a>
                <p>just now !</p>
            </div>
        </div></div>`);

        VanillaTilt.init($(".shown > div:not(.add)").selector, {
            reverse: true,
            max: 7,
            scale: 1.1
        });

        for(let i = 0; i<$(".shown > div").selector.length; i++) {
            setTimeout(function() {
                $($(".shown > div").selector[i]).removeClass("hidden");
            }, i*100+300);
        }

        setTimeout(function() {
            $(".shownLoader").css("display", "none");
        }, 200);

        console.log(decks);
    },

    all(decks) {
        decks = this.sort(decks);

        Object.keys(decks).forEach(el => {
            let deck = decks[el];
                deck.id = el;

            $(".others .decks").append(`<a onclick="display.select(this)" ondblclick="deck.open($(this).data('deck'))" data-deck="${deck.id}">
                <svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
                <div class="text">
                    <span class="name">${deck.name}</span>
                    <span class="lastModify">${deps.fancyDate(deck.lastModify)}</span>
                    <span class="owner">me</span>
                </div>
            </a>`);
        });
    },

    select(el) {
        $(".others a").removeClass("selected");

        if ($.isElement(el)) {
            $(el).addClass("selected");
        }
    },

    profile(data) {
        $(".intro h1 span").html(data.name).addClass("ready");
        $("#nav .profile").prop("src", data.avatar).removeClass("load");

        setTimeout(function() {
            $("#nav a").removeClass("hidden");
        }, 100);
    }
};