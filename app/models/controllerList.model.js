const mongoose = require("mongoose");

const controllerList = mongoose.model(
  "controllerList",
  new mongoose.Schema({
    controllerName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'active'
    },
    remark: {type: String},
    created_at: { type: Date },
    updated_at: { type: Date },
    created_by: String,
    updated_by: String,
  }, { timestamps: true })
);

module.exports = controllerList;
