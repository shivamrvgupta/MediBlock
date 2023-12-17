const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs'); // Import the 'fs' module for file operations
const { promisify } = require('util');  
const {AuthMiddleware} = require('../../../managers/middlewares')
// const axios = require('axios'); // Import the axios library
const path = require("path"); 
const models = require('../../../managers/models');
const {
    MessageConstants,
    StatusCodesConstants,
    ParamsConstants,
    
  } = require('../../../managers/helpers');

module.exports = {
        getAppointment : async (req, res) => {
            try{
                const user = req.user;
                console.log("User", user)
                if(!user){
                    res.redirect('/patient-login')    
                }
                
                const doctorsData = await models.DoctorModel.Doctor.find();
                res.render('patients/appointment', {doctorsData})
            }catch(error){
                console.log("Internal Server Error", error)
            }
        },

        getScan : async (req, res) => {
            try{
                const user = req.user;

                const DocID = req.params.DocID;

                console.log("User", user)
                if(!user){
                    res.redirect('/patient-login')    
                }
                
                const doctorsData = await models.DoctorModel.Doctor.findById(DocID);
                res.render('patients/sendscan', {doctorsData})
            }catch(error){
                console.log("Internal Server Error", error)
            }
        },

        postScan : async (req, res) => {
            try{
                const user = req.user;

                if(!user){
                    res.redirect('/patient-login')    
                }
                console.log(req.body)
                const imageFilename = req.files['mri_report'] ? req.files['mri_report'][0].filename : null;

                const patientData = {
                    patient_id : user.userId,
                    doc_id  : req.body.doctor_id,
                    reports : imageFilename
                }
                
                const appointment = await models.UserModel.Appointment(patientData)

                await appointment.save();

                console.log("Appointment Sent Successfully");
                
                res.redirect('/dashboard?success="Appointment Created Successfully');
            }catch(error){
                console.log("Internal Server Error", error)
            }
        },
    }

  