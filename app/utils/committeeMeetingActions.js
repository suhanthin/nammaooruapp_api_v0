// utils/transactions.js
const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const Users = db.user;
const Loghistory = db.loghistory;
const committeeMeeting = db.committeeMeeting;
const committeeMeetingHistory = db.committeeMeetingHistory;
var lastInsertId = "";
let changedvalueJson = {};
let existingvalueJson = {};
let loggedinuserId = "";
var ObjectId = require('mongodb').ObjectId;

const createcommitteeMeeting = async ({ reqBody, session }) => {
  const createdcommitteeMeeting = await committeeMeeting.create([{
    isAddAttendance:reqBody.isAddAttendance,
    fineAmount:reqBody.fineAmount,
    meetingDate:reqBody.meetingDate,
    description:reqBody.description
  }], { session });
  const createdcommitteeMeetingId = JSON.parse(JSON.stringify(createdcommitteeMeeting));
  lastInsertId = createdcommitteeMeetingId[0]._id;
  return {
    status: true,
    statusCode: 201,
    message: 'committeeMeeting is created successful',
    data: { createdcommitteeMeeting }
  }
}

const createcommitteeMeetingHistory = async ({ reqBody, session }) => {
  await timeout(3000);
  const userDetails = reqBody.userDetails;
  let committeeMeetingHistoryData = [];
  
  userDetails.forEach(object => {
    let paystatus = "";
    if(object.attendance == true){
      paystatus = "no fine";
    } else {
      paystatus = "unpaid"
    }
    let sample = {
      committeeMeeting_id:new ObjectId(lastInsertId),
      user_id:new ObjectId(object._id),
      attendance:reqBody.isAddAttendance == true ? object.attendance : true,
      paystatus:paystatus,
      payee_id:"",
      paidDate:"",
      description:"",
    }
    committeeMeetingHistoryData.push(sample);
  });
  const result = await committeeMeetingHistory.insertMany(committeeMeetingHistoryData, {session});
  return {
    status: true,
    statusCode: 201,
    message: 'committeeMeeting is created successful',
    data: { result }
  }
}

const committeeMeetingList = async ({ status , session }) => {
  const committeeMeetingData = await committeeMeeting.find(
    {
      status: status,
    }
  );
  return {
    status: true,
    statusCode: 201,
    data: committeeMeetingData
  }
}

const committeeMeetingpaystatusList = async ({ mettingListquery , session }) => {
  const query = {$and: mettingListquery};
  const UsersData = await committeeMeetingHistory.find(query);
  return {
    status: true,
    statusCode: 201,
    message: 'committee Meeting History List Details',
    data: UsersData
  }
  
}

const editcommitteeMeeting = async ({_id,reqBody,session}) => {
  const existingvalueData = await committeeMeeting.findOne({ _id });
  existingvalueJson.isAddAttendance = existingvalueData.isAddAttendance;
  existingvalueJson.fineAmount = existingvalueData.fineAmount;
  existingvalueJson.meetingDate = existingvalueData.meetingDate;
  existingvalueJson.status = existingvalueData.status;
  existingvalueJson.description = existingvalueData.description;
  const updatedcommitteeMeeting = await committeeMeeting.findOneAndUpdate({_id}, {$set: reqBody},{session})
  const updatedcommitteeMeetingId = JSON.parse(JSON.stringify(updatedcommitteeMeeting));
  lastInsertId = updatedcommitteeMeetingId._id;

  return {
    status: true,
    statusCode: 201,
    data: { updatedcommitteeMeeting }
  }
}

const deletecommitteeMeeting = async ({_id,reqBody,session}) => {
  const existingvalueData = await committeeMeeting.findOne({ _id });
  existingvalueJson.isAddAttendance = existingvalueData.isAddAttendance;
  existingvalueJson.fineAmount = existingvalueData.fineAmount;
  existingvalueJson.meetingDate = existingvalueData.meetingDate;
  existingvalueJson.status = existingvalueData.status;
  existingvalueJson.description = existingvalueData.description;
  const updatedcommitteeMeeting = await committeeMeeting.findOneAndUpdate({_id}, {$set: reqBody}, { session })
  const updatedcommitteeMeetingId = JSON.parse(JSON.stringify(updatedcommitteeMeeting));
  lastInsertId = updatedcommitteeMeetingId._id;

  return {
    status: true,
    statusCode: 201,
    data: { updatedcommitteeMeeting }
  }
}

const deletecommitteeMeetingHistory = async ({_id,reqBody,session}) => {
  const query = {"committeeMeeting_id":_id};
  const committeeMeetingHistoryData = await committeeMeetingHistory.find(query);
  if(committeeMeetingHistoryData.length > 0) {
    committeeMeetingHistoryData.map(item => {
      item.status = "deleted";
      item.description = reqBody.description;
      item.save();
    })
  }
  return {
    status: true,
    statusCode: 201,
    message: 'committee Meeting History Details deleted successfuly!.',
  }
}

const loghistory = async ({ req, res,reqBody,action,pageName,session }) => {
  await timeout(3000);
  const differ = filter(existingvalueJson, reqBody);
  checkLogedinuserId(req,res);
  const loghistory = await Loghistory.create([{
    userId:loggedinuserId,
    recordId: lastInsertId,
    existingvalue: JSON.stringify(differ.old[0]),
    changedvalue: action == "create" ? JSON.stringify(reqBody) : JSON.stringify(differ.new[0]),
    action:action,
    pagename: pageName
  }], { session });
  
  return {
    status: true,
    statusCode: 201,
    data: { loghistory }
  }
}

function filter(obj1, obj2) {
  var result1 = {};
  var result2 = {};
  
  let result = [];
  result.old = []; 
  result.new = []; 
  
  for(key in obj1) {
    if(obj2[key] != obj1[key]){
      result1[key] = obj1[key];
      result2[key] = obj2[key];
    } 
  }
  result.old.push(result1); 
  result.new.push(result2); 
  return result;
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function checkLogedinuserId(req){
  let token = req.headers["x-access-token"];
  
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(400).send({
        error: err,
        message: "Unauthorized!",
      });
    } else {
      loggedinuserId = decoded.id;
      return;
    }
  });
}

module.exports = {
  createcommitteeMeeting, committeeMeetingList, editcommitteeMeeting, deletecommitteeMeeting,deletecommitteeMeetingHistory, loghistory, createcommitteeMeetingHistory,committeeMeetingpaystatusList
};
