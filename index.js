// [SECTION] Dependencies and Modules
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");


// cors package will allow our bacckend application to be useable or available to our frontend application.
const cors = require("cors");


// Section: Routes
const userRoutes = require("./routes/user.js");
//[SECTION] Activity: Allows access to routes defined within our application
const workoutRoutes = require("./routes/workout.js");


// Configuring dotenv
dotenv.config();

//[SECTION] Environment Setup
// const port = 4000;

//[SECTION] Server Setup
const app = express();

//[SECTION] Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const corsOptions = {
    origin: ['http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));


//[Section] Google Login
// Creates a session with the given data
// resave prevents the session from overwriting the secret while the session is active
// saveUninitialized prevents the data from storing data in the session while the data has not yet been initialized

/*//session is a way to store information about a user across different request
app.use(session({
	secret: process.env.clientSecret,
	resave: false,
	saveUninitialized: false
}))*/



// [SECTION] Database Setup
mongoose.connect(process.env.MONGODB_STRING);

let db = mongoose.connection;
db.on("error", console.error.bind(console, "Error in the database connection!"));
db.once("open", ()=> console.log("Now connected to MongoDB Atlas."));

// Backend Routes
app.use("/users", userRoutes);
app.use("/workouts", workoutRoutes);


//[SECTION] Server Gateway Response
if(require.main === module){
	app.listen(process.env.PORT || 3000, ()=> {
		console.log(`API is now running at port ${process.env.PORT || 3000}`);
	})
}

//This is for the grading.
module.exports = {app, mongoose};