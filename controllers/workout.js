const Workout = require('../models/Workout.js');

const bcrypt = require("bcrypt");
// to use the methods in auth.js
const auth = require('../auth.js');

const {errorHandler} = require("../auth.js");

module.exports.addWorkout = (req, res) => {
    // Validate request body
    if (!req.body.name || !req.body.duration) {
        return res.status(400).send({ 
            success: false, 
            message: "All fields (name, duration) are required." 
        });
    }

    let newWorkout = new Workout({
        name: req.body.name,
        duration: req.body.duration
    });

    // Check if product already exists
    return Workout.findOne({ name: req.body.name })
        .then(existingWorkout => {
            if (existingWorkout) { 
                return res.status(409).send({ 
                    message: "Workout already exists." 
                });
            } else {
                return newWorkout.save()
                    .then(result => res.status(201).send({
                        result
                    }))
                    .catch(error => errorHandler(error, req, res));
            }
        })
        .catch(error => errorHandler(error, req, res)); 
};


/*module.exports.addWorkout = (req, res) => {
    try {
        // Ensure user is logged in
        if (!req.user || !req.user._id) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized: User not logged in.",
            });
        }
        const userId = req.user._id;

        // Validate request body
        const { name, duration } = req.body;
        if (!name || !duration) {
            return res.status(400).send({
                success: false,
                message: "All fields (name, duration) are required.",
            });
        }

        // Create a new workout with userId
        const newWorkout = new Workout({
            name,
            duration,
            user: userId, // Add the userId to associate with the logged-in user
        });

        // Check if the workout already exists for this user
        Workout.findOne({ name, user: userId })
            .then((existingWorkout) => {
                if (existingWorkout) {
                    return res.status(409).send({
                        success: false,
                        message: "Workout with this name already exists for the user.",
                    });
                } else {
                    // Save the new workout
                    return newWorkout
                        .save()
                        .then((result) =>
                            res.status(201).send({
                                success: true,
                                message: "Workout added successfully.",
                                result,
                            })
                        )
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send({
                                success: false,
                                message: "Error saving workout.",
                                error: error.message,
                            });
                        });
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send({
                    success: false,
                    message: "Error finding workout.",
                    error: error.message,
                });
            });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "An unexpected error occurred.",
            error: error.message,
        });
    }
};*/



module.exports.getMyWorkouts = (req, res) => {
    const userId = req.user._id; 

    Workout.find({ userId }) 
        .then(workout => {
            if (workout.length > 0) {
                return res.status(200).json({ workout });
            } else {
                return res.status(404).json({ message: 'No workout found for this user.' });
            }
        })
        .catch(error => errorHandler(error, req, res)); 
};

module.exports.updateWorkout = (req, res)=>{

    let updateWorkout = {
        name: req.body.name,
        duration: req.body.duration,
    }

    return Workout.findByIdAndUpdate(req.params.workoutId, updateWorkout)
    .then(workout => {
        if (workout) {
            res.status(200).send({message : 'Workout updated successfully', workout});
        } else {
            res.status(404).send({message : 'Workout not found'});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.deleteWorkout = (req, res) => {

    const workoutId = req.params.workoutId;

        if (!workoutId) {
            return res.status(400).send({ success: false, message: 'Workout ID is required' });
        }

        Workout.findByIdAndDelete(workoutId)
            .then(deletedWorkout => {
                if (!deletedWorkout) {
                    return res.status(404).send({ success: false, message: 'Workout not found' });
                }

                return res.status(200).send({ success: true, message: 'Workout deleted successfully' });
            })
            .catch(error => errorHandler(error, req, res));
    };


module.exports.completeWorkoutStatus = (req, res) => {
  
    let updatedWorkout = {
        status: "Completed!"
    }

    Workout.findByIdAndUpdate(req.params.workoutId, updatedWorkout)
        .then(workout => {
            if (workout) {
                if (workout.status === "Completed!") {
                    return res.status(200).send({message: 'Workout is already completed.', workout});
                }
                return res.status(200).send({success: true, message: 'Workout status updated successfully', updatedWorkout});
            } else {
                return res.status(404).send({message: 'Workout not found'});
            }
        })
        .catch(error => errorHandler(error, req, res));
};

