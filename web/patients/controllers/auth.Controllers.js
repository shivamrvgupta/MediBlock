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
    // Verify OTP API
        getHome : async (req, res) => {
            try{
                const user = req.user;
                console.log("User",user)
                if(!user){
                    res.redirect('/patient-login')    
                }
                res.render('patients/home')
            }catch(error){
                console.log("Internal Server Error", error)
            }
        },  
        
        getAbout : async (req, res) => {
            try{
                const user = req.user;
                console.log("User",user)
                if(!user){
                    res.redirect('/patient-login')    
                }
                res.render('patients/about')
            }catch(error){
                console.log("Internal Server Error", error)
            }
        },
        
        getContact : async (req, res) => {
            try{
                const user = req.user;
                console.log("User",user)
                if(!user){
                    res.redirect('/patient-login')    
                }
                
                res.render('patients/contact-us')
            }catch(error){
                console.log("Internal Server Error", error)
            }
        },
        
        getDoctor : async (req, res) => {
            try{
                const user = req.user;
                console.log("User",user)
                if(!user){
                    res.redirect('/patient-login')    
                }

                const doctors = await models.DoctorModel.Doctor.find();
                const countData = doctors.length();

                res.render('patients/doctors', {doctors, countData})
            }catch(error){
                console.log("Internal Server Error", error)
            }
        },
      
        getRegistration : async (req, res) => {
            try{
                const error = ""
                res.render('patients/register', {error})
            }catch(error){
                console.log("Internal Server Error", error)
            }

        },
      
        getLogin : async (req, res) => {
            try{
                const error = ""
                res.render('patients/login', {error})
            }catch(error){
                console.log("Internal Server Error", error)
            }

        },

        postLogin : async (req, res) => {
            try{
                const loginData = {
                    email: req.body.email,
                    password: req.body.password,
                  };
                
                const userExists = await models.UserModel.Patient.findOne({ email: loginData.email });
      
                  console.log(userExists)
        
                  if (!userExists) {
                      return res.redirect(`/patient-login?error=User Not Found${encodeURIComponent(loginData.email)}`);
                  }
        
                  // Generate and send OTP
                  const isPasswordValid = await bcrypt.compare(loginData.password, userExists.password);
        
                  if (!isPasswordValid) {
                      return res.redirect(`/patient-login?error=Invalid email or password&email=${encodeURIComponent(loginData.email)}`);
                  }
        
                  if (userExists.user_type !== 'Patient') {
                    return res.redirect('/?error=You do not have permission to access the admin panel.');
                  }
                  const token = AuthMiddleware.generateAccessToken(userExists);
                  
                  //  Set the token as a cookie or in the response body, depending on your preference
                  res.header('Authorization', `Bearer ${token}`);


                  console.log(res.header)
                  
                  return res.redirect('/');
            }catch(error){
                console.log("Internal Server Error", error)
            }

        },

        postRegistration : async (req, res) => {
            try {
                
                const patientData = {
                    token : uuidv4(),
                    user_type : "Patient",
                    first_name : req.body.first_name,
                    last_name : req.body.last_name,
                    phone : req.body.phone,
                    email: req.body.email,
                    password : await bcrypt.hash(req.body.password, 10),
                    height : req.body.height,
                    weight : req.body.weight,
                    bloodgroup : req.body.bloodgroup,
                    dob : req.body.dob,
                    gender : req.body.gender,
                    healthInsurance : req.body.healthInsurance,
                    is_active : "true",
                    accept_term : "true"                    
                }
                
                console.log(patientData)
                // Check for existing users with the same email or phone
                const existingUserByEmail = await models.UserModel.Patient.findOne({ email : patientData.email });
                const existingUserByPhone = await models.UserModel.Patient.findOne({ phone : patientData.phone });
        
                if (existingUserByEmail) {
                    const error = "Email already in use";
                    return res.render('patients/register', { error });
                } else if (existingUserByPhone) {
                    const error = "Phone Number already in use";
                    return res.render('patients/register', { error });
                }
        
                const newPatient = await models.UserModel.Patient(patientData);
                // Save the new patient to the database
                const savedPatient = await newPatient.save();

                // Save patient's address information
                const addressData = {
                    user_id: savedPatient._id,
                    address_1 : req.body.address_1,
                    address_2 : req.body.address_2,
                    area : req.body.area,
                    city : req.body.city,
                    state : req.body.state,
                    pincode : req.body.pincode
                };
        
                const patientAddress = new models.UserModel.Address(addressData);
                await patientAddress.save();
        

                // Redirect to the dashboard with a success message
                const error = "You have been registered successfully";
                return res.render('patients/login', { error });
            } catch (error) {
                console.error("Internal Server Error", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        },        
      
        getTerms : async (req, res) => {
            try{
                const user = req.user;
                console.log("User",user)
                if(!user){
                    res.redirect('/patient-login')    
                }

                res.render('patients/terms')
            }catch(error){
                console.log("Internal Server Error", error)
            }
        },

        codeOfConduct : async (req, res) => {
            try{
                const user = req.user;
                console.log("User",user)
                if(!user){
                    res.redirect('/patient-login')    
                }

                res.render('patients/code_of_conduct')
            }catch(error){
                console.log("Internal Server Error", error)
            }
        },

        getDashboard : async (req, res) => {
            try{
                const user = req.user;
                console.log("User",user)
                if(!user){
                    res.redirect('/patient-login')    
                }
                
                const history = await models.UserModel.Appointment.find();

                res.render('patients/dashboard', {history})
            }catch(error){
                console.log("Internal Server Error", error)
            }
        },

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
    }

  