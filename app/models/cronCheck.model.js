const mongoose = require("mongoose");

const cronCheck = mongoose.model(
  "cronCheck",
  new mongoose.Schema({
    status: {
        type: String,
        required: true,
        default:"active"
    },
    cronRunTime:String,
    remark: {
        type: String,
        maxlength: 250,
        trim: true,
        default:""
    },
    created_at: { type: Date },
    updated_at: { type: Date }
  }, { timestamps: true })
);

module.exports = cronCheck;
