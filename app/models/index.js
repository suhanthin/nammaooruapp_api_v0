const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.loginlog = require("./loginlog.model");
db.loghistory = require("./loghistory.model");
db.pageAccessPermission = require("./pageAccessPermission.model");
db.controllerList =  require("./controllerList.model");
db.memberTypeCount = require("./memberTypeCount.model");
db.chantha = require("./chantha.model");
db.chanthaHistory = require("./chanthaHistory.model");
db.committeeMeeting = require("./committeeMeeting.model");
db.committeeMeetingHistory = require("./committeeMeetingHistory.model");
db.deathTribute = require("./deathTribute.model");
db.deathTributeHistory = require("./deathTributeHistory.model");
db.cronCheck = require("./cronCheck.model");
db.familyDetails = require("./familyDetails.model");
db.familyDetailCount = require("./familyDetailsCount.model");

db.ROLES = ["chitcollectors","chitadmin", "admin", "member", "superadmin"];

module.exports = db;
