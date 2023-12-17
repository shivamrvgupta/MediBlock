const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

    // Define user schema
    const adminSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            maxLength: 200
        },
        user_type:{
            type: String,
            default: "Admin",
        },
        email:{
            type: String,
            required: true,
            maxLength: 200
        },
        password:{
            type: String,
            required: true,
            maxLength: 200
        },
        created_date: {
            type:Date,
            default: Date.now
        },
        updated_date: {
            type:Date,
            default: Date.now
        },
    });

// Define the comparePassword method for the userSchema
adminSchema.methods.comparePassword = async function(candidatePassword) {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return false;
    }
};


const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin
