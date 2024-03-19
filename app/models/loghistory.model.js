const mongoose = require("mongoose");

const loghistory = mongoose.model(
  "loghistory",
  new mongoose.Schema({
    userId: String,
    recordId: String,
    existingvalue: String,
    changedvalue: String,
    action: String,
    pagename:String,
    created_at: { type: Date },
  }, { timestamps: true })
);

module.exports = loghistory;