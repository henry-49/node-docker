// import user model
const User = require("../models/userModel");

const bcrypt = require("bcryptjs");

// sign up controller
exports.signUp = async (req, res) => {

    const {username, password} = req.body;
    
    try {
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            username,
            password: hashPassword
        });
        
        req.session.user = newUser;

        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        });
    } catch (error) {
        // console.log(error);
        res.status(400).json({
            status: 'fail'
        });
    }
};


// login controller
exports.login = async (req, res) => {
    const {username, password} = req.body;

    try {
        // check if user exist
        const user = await User.findOne({username})
        
        if(!user){
           return res.status(404).json({
                status: 'fail',
                message: 'user not found'
            })
        }
        // compare user password
        const isCorrect = await bcrypt.compare(password, user.password);

        if(isCorrect){
            // get the session of the login user
            req.session.user = user;

            res.status(200).json({
                status: 'success'
            });
        }else{
            res.status(400).json({
                status: 'fail',
                message: 'incorrect username or password'
            });
        }
    } catch (error) {
        // console.log(error);
        res.status(400).json({
            status: 'fail'
        });
    }

}