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

  // Verify OTP API
    getLogin : async (req, res) => {
      console.log("I am ready")
        res.render('admin/a-login',{
          error: "Welcome to Login"
        })
    },

  // User Login API
    verifyLogin : async (req, res) => {
      const loginData = {
        email: req.body.email,
        password: req.body.password,
        remember: req.body.remember,
      };

      console.log(loginData)
      try {
          // Check if the mobile number exists in the database
          const userExists = await models.DoctorModel.Admin.findOne({ email: loginData.email });

          console.log(userExists)

          if (!userExists) {
              return res.redirect(`/admin/auth/login?error=User Not Found${encodeURIComponent(loginData.email)}`);
          }

          // Generate and send OTP
          const isPasswordValid = await bcrypt.compare(loginData.password, userExists.password);

          if (!isPasswordValid) {
              return res.redirect(`/admin/auth/login?error=Invalid email or password&email=${encodeURIComponent(loginData.email)}`);
          }
          
          if (userExists.user_type !== 'Admin') {
            return res.redirect('/admin/auth/login?error=You do not have permission to access the admin panel.');
          }

          const token = generateAccessToken(userExists);
          
          //  Set the token as a cookie or in the response body, depending on your preference
          if (loginData.remember) {
            res.cookie('jwt',  token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true }); 
          } else {
            res.cookie('jwt', token, { httpOnly: true });
          }
          res.return = token;
          
          return res.redirect('/admin/auth/dashboard');
    
      } catch (error) {
        console.error('Error during login:', error);
        return res.status(StatusCodesConstants.INTERNAL_SERVER_ERROR).json({ status: false, status_code: StatusCodesConstants.INTERNAL_SERVER_ERROR, message: MessageConstants.INTERNAL_SERVER_ERROR, data: {} });
      }
    },
  
  // User Dashboard API
    getdashboard : async (req, res) => {
      const user = req.user;
      const patients = await models.UserModel.Patient.find();
      const allPatients = patients.length;

      const appointments = await models.UserModel.Appointment.find().populate('patient_id').populate('doctor_id');
      const allAppointments = appointments.length;

      const doctors = await models.DoctorModel.Doctor.find();
      const alldoctors = doctors.length;


      error = "You are successfully logged in"
      res.render('admin/dashboard', { options, patients, allPatients,appointments,allAppointments, alldoctors, doctors ,user: user, error})
    },

  // User Logout API
    logout:(req, res) => {
      try {
        // Clear the user session
        const user = req.user;

        res.clearCookie('jwt'); // Clear the JWT cookie
        
        res.redirect('admin/auth/login')
        

      } catch (error) {
        console.error('Logout error:', error);
        res.status(500).send('An error occurred during logout.');
      }
    },

    pageNotFound : async (req, res) => {
        const user = req.user;
          
        console.log(user)
        if (!user) {
          return res.redirect('/admin/auth/login');
        }
        
        res.status(404).render('partials/404', {user}); // Render the pagenotfound.ejs view
    },
    
    redirecter : async (req, res) => {
        const user = req.user;
          
        console.log(user)
        if (!user) {
          return res.redirect('/admin/auth/login');
        }

        if(user.usertype == 'Admin'){
          res.redirect('/admin/auth/dashboard');
        }
        
        res.redirect('/branch/auth/dashboard');
    },

    getMonthlyData : async(req,res) => {
      try {
        const totalRevenuePerMonth = await models.BranchModel.Order.aggregate([
          {
            $match: {
              status: "Delivered",
              payment_status: true
            }
          },
          {
            $group: {
              _id: {
                month: { $month: '$created_date' },
              },
              totalRevenue: { $sum: '$total_price' }
            }
          },
          {
            $sort: { '_id.year': 1, '_id.month': 1 }
          }
        ]);
    
        // Create an object to store revenue data per month
        const monthlyRevenue = {};
        
        // Iterate through the results and populate the object with data
        totalRevenuePerMonth.forEach(item => {
          const monthKey = `${item._id.year}-${item._id.month}`;
          monthlyRevenue[monthKey] = item.totalRevenue;
        });
    
        // Generate data for all months of the year
        const allMonthsData = [];
        for (let month = 1; month <= 12; month++) {
          const monthKey = `${new Date().getFullYear()}-${month}`;
          allMonthsData.push({
            x: monthKey,
            y: monthlyRevenue[monthKey] || 0
          });
        }
    
        res.json(allMonthsData);
      } catch (error) {
        console.error('Error fetching total revenue data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    },
}

