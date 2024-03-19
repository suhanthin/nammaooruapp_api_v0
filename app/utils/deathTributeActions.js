// utils/transactions.js
const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const Users = db.user;
const Loghistory = db.loghistory;
const deathTribute = db.deathTribute;
const deathTributeHistory = db.deathTributeHistory;
var lastInsertId = "";
let changedvalueJson = {};
let existingvalueJson = {};
let loggedinuserId = "";
var ObjectId = require('mongodb').ObjectId;

const createdeathTribute = async ({ reqBody, session }) => {
  const createddeathTribute = await deathTribute.create([{
    ismember:reqBody.ismember,
    user_id:reqBody.user_id,
    familyId:reqBody.familyId,
    name:reqBody.name,
    isAddAttendance:reqBody.isAddAttendance,
    fineAmount:reqBody.fineAmount,
    addedDate:reqBody.addedDate,
    description:reqBody.description
  }], { session });
  if(reqBody.ismember){
    let userStatus = {
      status:"death"
    }
    let _id = reqBody.user_id;
    await Users.findOneAndUpdate({_id}, {$set: userStatus},{session})
  }
  
  const createddeathTributeId = JSON.parse(JSON.stringify(createddeathTribute));
  lastInsertId = createddeathTributeId[0]._id;
  return {
    status: true,
    statusCode: 201,
    message: 'deathTribute is created successful',
    data: { createddeathTribute }
  }
}

const createdeathTributeHistory = async ({ reqBody, session }) => {
  await timeout(3000);
  const userDetails = reqBody.userDetails;
  let deathTributeHistoryData = [];
  if(reqBody.isAddAttendance == true){
    userDetails.forEach(object => {
      let paystatus = "";
      if(object.attendance == true){
        paystatus = "no fine";
      } else {
        paystatus = "unpaid"
      }
      let sample = {
        deathTribute_id:new ObjectId(lastInsertId),
        user_id:new ObjectId(object._id),
        attendance:reqBody.isAddAttendance == true ? object.attendance : true,
        paystatus:paystatus,
        payee_id:"",
        paidDate:"",
        description:"",
      }
      deathTributeHistoryData.push(sample);
    });
    const result = await deathTributeHistory.insertMany(deathTributeHistoryData, {session});
    return {
      status: true,
      statusCode: 201,
      message: 'deathTribute is created successful',
      data: { result }
    }
  } else {
    return {
      status: true,
      statusCode: 201,
      message: 'deathTribute is created successful',
    }
  }
  
}

const deathTributeList = async ({ status , session }) => {
  const deathTributeData = await deathTribute.find(
    {
      status: status,
    }
  );
  return {
    status: true,
    statusCode: 201,
    data: deathTributeData
  }
}

const deathTributepaystatusList = async ({ mettingListquery , session }) => {
  const query = {$and: mettingListquery};
  const UsersData = await deathTributeHistory.find(query);
  return {
    status: true,
    statusCode: 201,
    message: 'committee Meeting History List Details',
    data: UsersData
  }
  
}

const editdeathTribute = async ({_id,reqBody,session}) => {
  const existingvalueData = await deathTribute.findOne({ _id });
  existingvalueJson.ismember = existingvalueData.ismember;
  existingvalueJson.user_id = existingvalueData.user_id;
  existingvalueJson.familyId = existingvalueData.familyId;
  existingvalueJson.name = existingvalueData.name;
  existingvalueJson.isAddAttendance = existingvalueData.isAddAttendance;
  existingvalueJson.fineAmount = existingvalueData.fineAmount;
  existingvalueJson.addedDate = existingvalueData.addedDate;
  existingvalueJson.status = existingvalueData.status;
  existingvalueJson.description = existingvalueData.description;
  const updateddeathTribute = await deathTribute.findOneAndUpdate({_id}, {$set: reqBody},{session})
  const updateddeathTributeId = JSON.parse(JSON.stringify(updateddeathTribute));
  lastInsertId = updateddeathTributeId._id;

  return {
    status: true,
    statusCode: 201,
    data: { updateddeathTribute }
  }
}

const deletedeathTribute = async ({_id,reqBody,session}) => {
  const existingvalueData = await deathTribute.findOne({ _id });
  existingvalueJson.ismember = existingvalueData.ismember;
  existingvalueJson.user_id = existingvalueData.user_id;
  existingvalueJson.name = existingvalueData.name;
  existingvalueJson.isAddAttendance = existingvalueData.isAddAttendance;
  existingvalueJson.fineAmount = existingvalueData.fineAmount;
  existingvalueJson.addedDate = existingvalueData.addedDate;
  existingvalueJson.status = existingvalueData.status;
  existingvalueJson.description = existingvalueData.description;
  const updateddeathTribute = await deathTribute.findOneAndUpdate({_id}, {$set: reqBody}, { session })
  const updateddeathTributeId = JSON.parse(JSON.stringify(updateddeathTribute));
  lastInsertId = updateddeathTributeId._id;

  return {
    status: true,
    statusCode: 201,
    data: { updateddeathTribute }
  }
}

const deletedeathTributeHistory = async ({_id,reqBody,session}) => {
  const query = {"deathTribute_id":_id};
  const deathTributeHistoryData = await deathTributeHistory.find(query);
  if(deathTributeHistoryData.length > 0) {
    deathTributeHistoryData.map(item => {
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
    return res.status(400).send({ message: "No token provided!" });
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
  createdeathTribute, deathTributeList, editdeathTribute, deletedeathTribute,deletedeathTributeHistory, loghistory, createdeathTributeHistory,deathTributepaystatusList
};
