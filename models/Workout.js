    const mongoose = require('mongoose');

    const workoutSchema = new mongoose.Schema({
        userId: {
            type: String,
            required: [true, "User ID is Required"]
        },
        name: {
            type: String,
            required: [true, 'Workout Name is Required']
        },
        duration: {
            type: String,
            required: [true, 'duration is Required']
        },
        dateAdded:{
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            default: "In Progress"
        }
    });


    module.exports = mongoose.model('Workout', workoutSchema);