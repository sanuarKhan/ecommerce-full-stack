const data = require('../data');
const User = require('../models/user.model');
const seedUser = async (req, res, next) => {
    try {
    // Delete all users
        await User.deleteMany({});
      // Insert new user   
        const users = await User.insertMany(data.users);
        
        return res.status(201).json({ users });
        console.log(User)
    }
    catch (error) {
       next(error);
    }
}
module.exports = { seedUser };
