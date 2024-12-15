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

// Checkout Function: 
module.exports.AddToWorkouts = async (req, res) => {
    try {
        
        const userId = req.user.id; 
        

        // Find the user's cart
        const workout = await Workout.findOne({ userId });
        if (!workout) {
            return res.status(404).json({ message: 'Workout not found for the user.' });
        }

        // Check if cart contains items
        if (!workout.cartItems || workout.cartItems.length === 0) {
            return res.status(400).json({ message: 'Workout is empty. Cannot proceed to checkout.' });
        }

        // Create a new Order
        const newWorkout = new Workout({
            userId,
            productsOrdered: cart.cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                subtotal: item.subtotal
            })),
            totalPrice: cart.totalPrice
        });

        // Save the order
        const savedOrder = await newOrder.save();

        // Respond to client
        res.status(201).json({ message: "Ordered Successfully" });
    } catch (err) {
        // Catch and handle errors
        res.status(500).json({ error: "No items to Checkout" });
    }
};

module.exports.getMyWorkouts = (req, res) => {
    const userId = req.user.id; 

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

