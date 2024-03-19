const mongoose = require("mongoose");

const Loginlog = mongoose.model(
  "Loginlog",
  new mongoose.Schema({
    userId: String,
    ip_address: String,
    login_status: String,
    login_time: String,
    logoff_time: String,
  }, { timestamps: true })
);

module.exports = Loginlog;
