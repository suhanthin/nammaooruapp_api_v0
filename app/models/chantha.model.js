const mongoose = require("mongoose");

const chantha = mongoose.model(
  "chantha",
  new mongoose.Schema({
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
        default:"active"
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

module.exports = chantha;
