const User = require('../models/User.js');


const bcrypt = require("bcrypt");
// to use the methods in auth.js
const auth = require('../auth.js');

const { errorHandler } = auth;

// User registration
module.exports.registerUser = (req, res) => {

    // Checks if the email is in the right format
    if (!req.body.email.includes("@")){
        return res.status(400).send({error : 'Email invalid'});
    }
    // Checks if the password has atleast 8 characters
    else if (req.body.password.length < 8) {
        return res.status(400).send({error: 'Password must be atleast 8 characters'});
    // If all needed requirements are achieved
    } else {
        let newUser = new User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            password : bcrypt.hashSync(req.body.password, 10)
        })

        return newUser.save()
        .then((result) => res.status(201).send({message: 'Registered Successfully'}))
        .catch(error => errorHandler(error, req, res));
    }
};

// User authentication
module.exports.loginUser = (req, res) => {
	if(req.body.email.includes('@')){
		return User.findOne({email: req.body.email})
		.then(result => {
			// if email was not found in the db
			if(result === null){
				return res.status(404).send({error: 'No email found'});
			}
			// The email was found in the databse:
			else{
				
				const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

				// we need to check the isPasswordCorrect
				// if the pass is correct this will run
				if(isPasswordCorrect){
					// we are going to generate an access token
					return res.status(200).send({ access : auth.createAccessToken(result)})
				}else{
					return res.status(401).send({ error: 'Email and password do not match' });
				}

			}
		})
		.catch(err => errorHandler(err, req, res));
	}else{
		return res.status(400).send({ error: 'Invalid Email' });
	}
};


// Retrieve User Details
module.exports.UserDetails = (req, res) => {
    return User.findById(req.user.id)
    .then(user => {

        if(!user){
            
            return res.status(404).send({ error: 'User not found' })
        }else {
            // if the user is found, return the user.
            user.password = "";
            return res.status(200).send({user: user});
        }  
    })
    .catch(error => errorHandler(error, req, res));
};