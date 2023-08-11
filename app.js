const express = require('express');
const bodyParser = require('body-parser');

const authRoute = require('./routes/auth');
const businessRoute = require('./routes/business');
const imageRoute = require('./routes/images');
const userRoute = require('./routes/user');
const favoriteRoute = require('./routes/favorite');
const friendRoute = require('./routes/friend');
const businessHoursRoute = require('./routes/businessHours');
const friendRequestRoute = require('./routes/friendRequest');
const floorplanRoute = require('./routes/floorplan');
const reservableRoute = require('./routes/reservable');

//Bhavya you are a homosexual
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS, PUT");
    next();
});

//For sending img files to the front end
//app.use('/uploads', express.static('uploads'));

//For login, signup and delete account
app.use("/auth", authRoute);

//For getting user info
app.use("/user", userRoute);

//For getting business info
app.use("/business", businessRoute);

//For uploading img files
app.use("/image", imageRoute);

//For handling favorites
app.use("/favorite", favoriteRoute);

//For handling friends
app.use("/friend", friendRoute);

//For handling business hours
app.use("/hours", businessHoursRoute);

//For handling friend requests
app.use("/request", friendRequestRoute);

//For handling floorplans
app.use("/floorplan", floorplanRoute);

//For handling reservables
app.use("/reservable", reservableRoute);
module.exports = app;