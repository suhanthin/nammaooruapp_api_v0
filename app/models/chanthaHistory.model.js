const mongoose = require("mongoose");

const chanthaHistory = mongoose.model(
  "chanthaHistory",
  new mongoose.Schema({
    chantha_id:{
      type: String,
      required: true,
    },
    user_id:{
      type: String,
      required: true,
    },
    payee_id:{
      type: String,
    },
    addedDate:{
      type: String,
      required: true,
    },
    paidDate:String,
    amount: {
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
    effectiveDate: { type: String, default: Date } ,
    status: {
        type: String,
        required: true,
        default:"unpaid"
    },
    remark: {
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

module.exports = chanthaHistory;
