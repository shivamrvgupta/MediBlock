const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patients',
    },
    doctor_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctors',
    },
    reports :{ 
        type : String,
        required: true
    },
    status :{ 
        type : Boolean,
        status : false
    },
    created_date:{
        type: Date,
        default: Date.now
    },
    updated_date:{
        type: Date,
        default: Date.now
    }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
