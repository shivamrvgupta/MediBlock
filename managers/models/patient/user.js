const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

    // Define user schema
    const patientsSchema = new mongoose.Schema({
        token: {
            type : String,
            default: null
        }, 
        user_type:{
            type: String,
            default: "Patient",
        },
        first_name: {
            type: String,
            required: true,
            maxLength: 200
        },
        last_name:  { 
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
        dob:  { 
            type: String,
            required: false,
            maxLength: 200
        },
        phone:  { 
            type: String,
            required: true,
            maxLength: 200
        },
        weight:  { 
            type: String,
            required: true,
            maxLength: 200
        },
        height:  { 
            type: String,
            required: true,
            maxLength: 200
        },
        bloodgroup:  { 
            type: String,
            required: true,
            maxLength: 200
        },
        healthInsurance:  { 
            type: String,
            required: true,
            maxLength: 200
        },
        is_active:  { 
            type: Boolean,
            required: true,
        },
        status:  { 
            type: Boolean,
            required: true,
        },
        accept_terms:  { 
            type: Boolean,
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

patientsSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        console.error('Error comparing passwords:', error);
        return false;
    }
};    


const Patients = mongoose.model('Patients', patientsSchema);
module.exports = Patients
