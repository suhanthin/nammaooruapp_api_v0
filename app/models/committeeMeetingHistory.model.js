const mongoose = require("mongoose");

const committeeMeetingHistory = mongoose.model(
  "committeeMeetingHistory",
  new mongoose.Schema({
    committeeMeeting_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "committeeMeeting",
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    attendance: { type: String} ,
    paystatus: {
        type: String,
        required: true,
        default:"active"
    },
    payee_id: { type: String},
    paidDate: {
        type: String,
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

module.exports = committeeMeetingHistory;
