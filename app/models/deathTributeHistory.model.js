const mongoose = require("mongoose");

const deathTributeHistory = mongoose.model(
  "deathTributeHistory",
  new mongoose.Schema({
    deathTribute_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "deathTribute",
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

module.exports = deathTributeHistory;
