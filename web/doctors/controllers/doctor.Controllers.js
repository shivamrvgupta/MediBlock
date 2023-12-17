const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const {
  MessageConstants,
  StatusCodesConstants,
  ParamsConstants,
  
} = require('../../../managers/helpers');
const secretKey = process.env.SECRET_KEY
const { generateAccessToken} = require('../middlewares/auth.middleware');
const models = require('../../../managers/models');

// This would be your token blacklist storage
const tokenBlacklist = new Set();

const options = { day: '2-digit', month: 'short', year: 'numeric' };


module.exports = {
    list : async (req, res) => {
        try {
            const user = req.user;
        
            if (!user) {
              return res.redirect('/admin/auth/login');
            }
        
            // Filter customers with user_type = "customer"
            const doctors = await models.DoctorModel.Doctor.find();
            const doctorCount = doctors.length;

            console.log(doctorCount)
            const error = "Patient's Lists";

            res.render('admin/doctors/lists', {
              user,
              doctors,
              doctorCount,
              error,
            });
          } catch (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
          }
    },

    getAdd : async (req, res) => {
      try {
        const user = req.user;
    
        if (!user) {
          return res.redirect('/admin/auth/login');
        }
        console.log(user)
        res.render('admin/doctors/add', {user, error:"Add New Doctor" });
      } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
    },

    postAdd: async (req, res) => {
      try{
        const { first_name,last_name, email, phone ,experience, charges, city, state, gender, specialist, service} = req.body;
        const imageFilename = req.files['doctor_image'] ? req.files['doctor_image'][0].filename : null;

    
        const doctor = new models.DoctorModel.Doctor({
          token: uuidv4(),
          usertype: "Doctor",
          first_name,
          last_name,
          email,
          password :  await bcrypt.hash(req.body.password, 10),
          phone,
          experience,
          charges,
          city,
          state,
          gender,
          specialist,
          service,
          profile: imageFilename,
          is_active : true,
          accept_term : true,
        })
    
    
        await doctor.save();

        console.log("Doctor added successfully");
        res.redirect('/admin/doctor/lists?error="Doctor added Successfully');
    
      }catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
    },

    getUpdate : async (req, res) => {
      try {
        const user = req.user;
        const doctor_id = req.params.doctor_id;

        if (!user) {
          return res.redirect('/admin/auth/login');
        }

        const doctor = await models.DoctorModel.Doctor.findById(doctor_id);
        console.log(doctor)
        if (!doctor) {
          // customer not found in the database
          throw new Error('Doctor not found.');
        }
        console.log(user)
        res.render('admin/doctors/update', {user, doctor, error:"Add New Doctor" });
      } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
    },

    updateAdd : async (req, res) => {
      try {
        const { token, first_name, last_name, email, phone, experience, charges, city, state, gender, specialist, service } = req.body;
        const imageFilename = req.files['doctor_image'] ? req.files['doctor_image'][0].filename : null;
    
        // Find the doctor by token
        const doctor = await models.DoctorModel.Doctor.findOne({ token });
    
        if (!doctor) {
          return res.status(404).send('Doctor not found');
        }
    
        // Update the doctor's information
        doctor.first_name = first_name;
        doctor.last_name = last_name;
        doctor.email = email;
        doctor.phone = phone;
        doctor.experience = experience;
        doctor.charges = charges;
        doctor.city = city;
        doctor.state = state;
        doctor.gender = gender;
        doctor.specialist = specialist;
        doctor.service = service;
    
        // Update the profile image only if a new image is provided
        if (imageFilename) {
          doctor.profile = imageFilename;
        }
    
        // Save the updated doctor
        await doctor.save();
    
        console.log("Doctor updated successfully");
        res.redirect('/admin/doctor/lists?message="Doctor updated successfully"');
    
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
    }
}

