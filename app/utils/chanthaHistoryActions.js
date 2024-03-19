// utils/transactions.js
const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const Loghistory = db.loghistory;
const ChanthaHistory = db.chanthaHistory;
const Chantha =db.chantha;
const User = db.user;
var lastInsertId = "";
let changedvalueJson = {};
let existingvalueJson = {};
let loggedinuserId = "";

const createchanthaHistory = async ({ reqBody, session }) => {
  const chanthaData = await Chantha.findOne({ _id:reqBody.chantha_id });
  const query = {
  $and: [
    {
      "status": "active"
    },
    {
      "gender": { '$nin': "female" }
    },
    {
      "userType": { '$nin': "half" }
    },
    {
      "memberType": { '$nin': "b-class" }
    }
  ]};
  var userData = await User.find(query);
  let chanthaHistoryData = []
  userData.forEach(object => {
    let sample = {
      amount:chanthaData.amount,
      chantha_id:chanthaData._id,
      user_id:object._id,
      payee_id:"",
      addedDate:dateformat(new Date()),
      paidDate:"",
      effectiveDate: chanthaData.effectiveDate,
      remark: "",
    }
    chanthaHistoryData.push(sample);
  });
  const options = { ordered: true };
  const result = await ChanthaHistory.insertMany(chanthaHistoryData, options);
  return {
    status: true,
    statusCode: 201,
    message: 'Chantha History is created successful',
    data: { result }
  }
}

const chanthaHistoryList = async ({ status , session }) => {
  const chanthaData = await ChanthaHistory.find(
    {
      status: status,
    }
  );
  return {
    status: true,
    statusCode: 201,
    data: chanthaData
  }
}

const editchanthaHistory = async ({_id,reqBody,session}) => {
  const existingvalueData = await ChanthaHistory.findOne({ _id });
  existingvalueJson.amount = existingvalueData.amount;
  existingvalueJson.effectiveDate = existingvalueData.effectiveDate;
  existingvalueJson.status = existingvalueData.status;
  existingvalueJson.remark = existingvalueData.remark;
  const updatedchantha = await ChanthaHistory.findOneAndUpdate({_id}, {$set: reqBody},{session})
  const updatedchanthaId = JSON.parse(JSON.stringify(updatedchantha));
  lastInsertId = updatedchanthaId._id;

  return {
    status: true,
    statusCode: 201,
    data: { updatedchantha }
  }
}

const deletechanthaHistory = async ({_id,reqBody,session}) => {
  const existingvalueData = await ChanthaHistory.findOne({ _id });
  existingvalueJson.amount = existingvalueData.amount;
  existingvalueJson.effectiveDate = existingvalueData.effectiveDate;
  existingvalueJson.status = existingvalueData.status;
  existingvalueJson.remark = existingvalueData.remark;
  const updatedchantha = await ChanthaHistory.findOneAndUpdate({_id}, {$set: reqBody}, { session })
  const updatedchanthaId = JSON.parse(JSON.stringify(updatedchantha));
  lastInsertId = updatedchanthaId._id;

  return {
    status: true,
    statusCode: 201,
    data: { updatedchantha }
  }
}

const loghistory = async ({ req, res,reqBody,action,pageName,session }) => {
  await timeout(3000);
  const differ = filter(existingvalueJson, reqBody);
  checkLogedinuserId(req);
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

function dateformat (date) {  
  if (!(date instanceof Date)) {
    throw new Error('Invalid "date" argument. You must pass a date instance')
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${day}-${month}-${year}`
}

module.exports = {
  createchanthaHistory, chanthaHistoryList, editchanthaHistory, deletechanthaHistory, loghistory
};
