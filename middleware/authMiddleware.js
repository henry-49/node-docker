// middleware to protect our routes
const protect = (req, res, next) => {
    const {user} = req.session

    if(!user) {
        return res.status(401).json({
            status: 'fail',
            message: 'unauthorized'
        })
    }
    req.user = user;

    // if logged in call the next method
    next();
};

module.exports = protect;