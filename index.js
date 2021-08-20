const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const redis = require('redis');
const cors = require("cors");
let RedisStore = require('connect-redis')(session)


const {
     MONGO_USER,
     MONGO_PASSWORD, 
     MONGO_IP, 
     MONGO_PORT, 
     REDIS_URL,
     REDIS_PORT,
     SESSION_SECRET
    } = require('./config/config');

    let redisClient = redis.createClient({
        host: REDIS_URL,
        port: REDIS_PORT
    });

const port = process.env.PORT || 3000;

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

// connect with retry after 5s
const connectWthRetry = () => {
    mongoose
    .connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => console.log("successfully connected to DB"))
    .catch((e) => {
        console.log(e)
        setTimeout(connectWthRetry, 5000)
    });
};

connectWthRetry();

// to trust proxies the will be forward from Nginx
app.enable("trust proxy");

app.use(cors({}));

// middleware for redis session
app.use(
    session({
    store: new RedisStore({client: redisClient}),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 30000       //30s
    }
}));

// middleware for express to parse json
app.use(express.json());

// localhost:3000/api/v1/posts
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);




app.get('/api/v1', (req, res) => {
    res.send("<h3>Using docker hub to push changes!</h3>");
    console.log("Yeah it ran");
});

app.listen(port, () => console.log(`Listing on port ${port}`));