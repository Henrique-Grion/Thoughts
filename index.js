const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require('express-flash')

// Data Base
const conn = require("./db/conn");

// Models
const Thought = require("./models/Thought");

// routes
const thoughtsRoutes = require("./routes/thoughtsRoutes");
const authRoutes = require("./routes/authRoutes");
const ThoughController = require("./controllers/ThoughtController");

const app = express();

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

//session middleware
app.use(
    session({
        name: 'session',
        secret: 'nosso_secret',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function () { },
            path: './sessions',
        }),
        cookie: {
            secure: false,
            maxAge: 3600000,
            expires: new Date(Date.now() + 3600000),
            httpOnly: true,
        },
    }),
)

app.use(flash())

app.use(express.static("public"));

// set session to res
app.use((req, res, next) => {
    if (req.session.userid) {
        res.locals.session = req.session;
    }
    next();
});

app.use("/thoughts", thoughtsRoutes);
app.use("/", authRoutes);

app.get("/", ThoughController.showThoughts);

conn
    .sync()
    .then(() => {
        app.listen(3000);
    })
    .catch((err) => console.log(err));