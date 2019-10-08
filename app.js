var app = require("express")(),
    serve = require('serve-static'),
    checkURL = require("valid-url"),
    db = {
        UID926817453752: {links: []}
    };

app.use(serve("./assets"));

app.get("/", function(req, res) {
    res.render("index.ejs");
}).get("/id", function(req, res) {
    let id = "UID"+Math.floor(Math.random() * 1000000000000);

    db[id] = {
        links: []
    };

    res.header(200);
    res.json({
        id: id
    });

}).get("/link/add/:link/:id", function(req, res) {
    if (checkURL.isWebUri(req.params.link)) {
        if (Object.keys(db).includes(req.params.id)) {
            if (!db[req.params.id].links.includes(req.params.link)) {
                db[req.params.id].links.push(req.params.link);

                res.header(200);
                res.json({
                    status: 200,
                    message: "Link added !",
                    link: db[req.params.id].links[db[req.params.id].links.length -1]
                });
            } else {
                res.header(200);
                res.json({
                    status: 200,
                    message: "Link already registred.",
                    link: db[req.params.id].links[db[req.params.id].links.length -1]
                });
            }
        } else {
            res.header(403);
            res.json({
                status: 403,
                message: "Bad User ID"
            });
        }
    } else {
        res.header(403);
        res.json({
            status: 403,
            message: "Bad link"
        });
    }
}).get("/link/remove/:link/:id", function(req, res) {
    if (checkURL.isWebUri(req.params.link)) {
        if (Object.keys(db).includes(req.params.id)) {
            if (db[req.params.id].links.includes(req.params.link)) {

                let index = db[req.params.id].links.indexOf(req.params.link);

                if (index > -1) {
                    db[req.params.id].links.splice(index, 1);
                }

                res.header(200);
                res.json({
                    status: 200,
                    message: "Link removed !",
                    link: req.params.link
                });
            } else {
                res.header(200);
                res.json({
                    status: 200,
                    message: "Link not registred.",
                    link: db[req.params.id].links[db[req.params.id].links.length -1]
                });
            }
        } else {
            res.header(403);
            res.json({
                status: 403,
                message: "Bad User ID"
            });
        }
    } else {
        res.header(403);
        res.json({
            status: 403,
            message: "Bad link"
        });
    }
}).get("/links/:id", function(req, res) {
    if (Object.keys(db).includes(req.params.id)) {
        res.header(200);
        res.json({
            status: 200,
            message: "All links",
            links: db[req.params.id].links
        });
    } else {
        res.header(403);
        res.json({
            status: 403,
            message: "Bad User ID"
        });
    }
});

app.listen(80);