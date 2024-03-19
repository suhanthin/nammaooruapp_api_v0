// utils/transactions.js
const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const Users = db.user;
const Loghistory = db.loghistory;
const controllerList = db.controllerList;
var lastInsertId = "";
let changedvalueJson = {};
let existingvalueJson = {};
let loggedinuserId = "";

const createcontroller = async ({ controllerName, session }) => {
  const createdcontroller = await controllerList.create([{
    controllerName,
  }], { session });
  const createdcontrollerId = JSON.parse(JSON.stringify(createdcontroller));
  lastInsertId = createdcontrollerId[0]._id;
  return {
    status: true,
    statusCode: 201,
    message: 'controller list created successful',
    data: { createdcontroller }
  }
}

const controllersList = async ({ status , session }) => {
  const controllerListData = await controllerList.find(
    {
      status: status,
    }
  );
  return {
    status: true,
    statusCode: 201,
    data: controllerListData
  }
}

const editcontroller = async ({_id,reqBody,session}) => {
  const existingvalueData = await controllerList.findOne({ _id });
  existingvalueJson.status = existingvalueData.status;
  existingvalueJson.controllerName = existingvalueData.controllerName;
  existingvalueJson.remark = existingvalueData.remark;
  const updatedcontroller = await controllerList.findOneAndUpdate({_id}, {$set: reqBody},{session})
  const updatedcontrollerId = JSON.parse(JSON.stringify(updatedcontroller));
  lastInsertId = updatedcontrollerId._id;

  return {
    status: true,
    statusCode: 201,
    data: { updatedcontroller }
  }
}

const deletecontroller = async ({_id,reqBody,session}) => {
  const existingvalueData = await controllerList.findOne({ _id });
  existingvalueJson.status = existingvalueData.status;
  existingvalueJson.controllerName = existingvalueData.controllerName;
  existingvalueJson.remark = existingvalueData.remark;
  const updatedcontroller = await controllerList.findOneAndUpdate({_id}, {$set: reqBody}, { session })
  const updatedcontrollerId = JSON.parse(JSON.stringify(updatedcontroller));
  lastInsertId = updatedcontrollerId._id;

  return {
    status: true,
    statusCode: 201,
    data: { updatedcontroller }
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
    createcontroller, controllersList, editcontroller,deletecontroller, loghistory
};
