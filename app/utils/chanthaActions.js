// utils/transactions.js
const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const Users = db.user;
const Loghistory = db.loghistory;
const controllerList = db.controllerList;
const chantha = db.chantha;
var lastInsertId = "";
let changedvalueJson = {};
let existingvalueJson = {};
let loggedinuserId = "";

const createchantha = async ({ reqBody, session }) => {
  const createdchantha = await chantha.create([{
    amount:reqBody.amount,
    effectiveDate:reqBody.effectiveDate,
    status:reqBody.status,
    remark:reqBody.remark
  }], { session });
  const createdchanthaId = JSON.parse(JSON.stringify(createdchantha));
  lastInsertId = createdchanthaId[0]._id;
  return {
    status: true,
    statusCode: 201,
    message: 'chantha is created successful',
    data: { createdchantha }
  }
}

const chanthaList = async ({ status , session }) => {
  const chanthaData = await chantha.find(
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

const editchantha = async ({_id,reqBody,session}) => {
  const existingvalueData = await chantha.findOne({ _id });
  existingvalueJson.amount = existingvalueData.amount;
  existingvalueJson.effectiveDate = existingvalueData.effectiveDate;
  existingvalueJson.status = existingvalueData.status;
  existingvalueJson.remark = existingvalueData.remark;
  const updatedchantha = await chantha.findOneAndUpdate({_id}, {$set: reqBody},{session})
  const updatedchanthaId = JSON.parse(JSON.stringify(updatedchantha));
  lastInsertId = updatedchanthaId._id;

  return {
    status: true,
    statusCode: 201,
    data: { updatedchantha }
  }
}

const deletechantha = async ({_id,reqBody,session}) => {
  const existingvalueData = await chantha.findOne({ _id });
  existingvalueJson.amount = existingvalueData.amount;
  existingvalueJson.effectiveDate = existingvalueData.effectiveDate;
  existingvalueJson.status = existingvalueData.status;
  existingvalueJson.remark = existingvalueData.remark;
  const updatedchantha = await chantha.findOneAndUpdate({_id}, {$set: reqBody}, { session })
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
  createchantha, chanthaList, editchantha, deletechantha, loghistory
};
