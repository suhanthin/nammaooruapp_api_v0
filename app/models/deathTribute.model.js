const mongoose = require("mongoose");

const deathTribute = mongoose.model(
  "deathTribute",
  new mongoose.Schema({
    ismember:{
      type: Boolean,
      default: false
    },
    user_id: {
      type: String,
      required: [function() { return this.ismember == true; }, "User Id required"]
    },
    familyId: {
      type: String,
      required: [function() { return this.ismember == false; }, "Family Id required"]
    },
    name:String,
    isAddAttendance:{
      type: Boolean,
      default: false
    },
    addedDate: { type: String, default: Date ,required: true} ,
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

module.exports = deathTribute;
