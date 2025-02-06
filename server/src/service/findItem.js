const createError = require("http-errors");
const mongoose = require("mongoose");
const User = require("../models/user.model");

const findWithId = async (Model, id, options = {}) => {
    try {
      
        const item = await Model.findById(id , options);
      
        if (!item) throw createError(404, `${Model.modelName} not found with this ID`);
        
        return item;
    } catch (error) {
        if (error instanceof mongoose.Error) {
            throw createError(400, "Invalid item ID");
        }
        throw error;
        
    }
}


    module.exports = {findWithId};