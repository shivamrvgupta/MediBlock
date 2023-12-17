const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

    // Define user schema
    const doctorsSchema = new mongoose.Schema({
        token: {
            type : String,
            default: null
        }, 
        user_type:{
            type : String,
            default: "Doctor"
        },
        profile: {
            type: String,
            required: true,
        },
        first_name: {
            type: String,
            required: true,
            maxLength: 200
        },
        last_name: {
            type: String,
            required: true,
            maxLength: 200
        },
        experience:  { 
            type: String,
            required: true,
            maxLength: 200
        },
        email:  { 
            type: String,
            required: true,
            maxLength: 200
        },
        password:  { 
            type: String,
            required: false,
            maxLength: 200
        },  
        gender:  { 
            type: String,
            required: false,
            maxLength: 200
        },
        phone:  { 
            type: String,
            required: true,
            maxLength: 200
        },
        city:  { 
            type: String,
            required: true,
            maxLength: 200
        },
        charges:  { 
            type: String,
            required: true,
            maxLength: 200
        },
        specialist:  { 
            type: String,
            required: true,
            maxLength: 200
        },
        service:  { 
            type: String,
            required: true,
            maxLength: 200
        },
        state:  { 
            type: String,
            required: true,
            maxLength: 200
        },
        is_active:  { 
            type: Boolean,
            required: true,
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

const Doctors = mongoose.model('Doctors', doctorsSchema);
module.exports = Doctors
