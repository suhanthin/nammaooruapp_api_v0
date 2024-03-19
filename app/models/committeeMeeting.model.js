const mongoose = require("mongoose");

const committeeMeeting = mongoose.model(
  "committeeMeeting",
  new mongoose.Schema({
    isAddAttendance:{
      type: Boolean,
      default: false
    },
    meetingDate: { type: String, default: Date ,required: true} ,
    fineAmount: {
        type: Number,
        required: true,
        default:0,
        integer: true,
        get: v => Math.round(v),
        set: v => Math.round(v),
        validate : {
          validator : Number.isInteger,
          message   : '{VALUE} is not an integer value'
        }
    },
    status: {
        type: String,
        required: true,
        default:"active"
    },
    description: {
        type: String,
        maxlength: 250,
        trim: true,
        default:""
    },
    created_at: { type: Date },
    updated_at: { type: Date },
    created_by: String,
    updated_by: String,
  }, { timestamps: true })
);

module.exports = committeeMeeting;
