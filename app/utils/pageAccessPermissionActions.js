// utils/transactions.js
const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const Loghistory = db.loghistory;
const controllerList = db.controllerList;
const pageAccessPermission = db.pageAccessPermission;
var lastInsertId = "";
let changedvalueJson = {};
let existingvalueJson = {};
let loggedinuserId = "";

const createpageAccessPermission = async ({ reqBody, session }) => {
  const createdcontroller = await pageAccessPermission.create([{
    role_id:reqBody.role_id,
    controller_id:reqBody.controller_id,
    iscanview:reqBody.iscanview,
    iscanedit:reqBody.iscanedit,
    iscandelete:reqBody.iscandelete,
    iscancreate:reqBody.iscancreate
  }], { session });
  const createdcontrollerId = JSON.parse(JSON.stringify(createdcontroller));
  lastInsertId = createdcontrollerId[0]._id;
  return {
    status: true,
    statusCode: 201,
    message: 'page Access Permission created successful',
    data: { createdcontroller }
  }
}

const pageAccessPermissionList = async ({ status , session }) => {
  const controllerListData = await pageAccessPermission.find(
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

const editpageAccessPermission = async ({_id,reqBody,session}) => {
  const existingvalueData = await pageAccessPermission.findOne({ _id });
  existingvalueJson.role_id = existingvalueData.role_id;
  existingvalueJson.controller_id = existingvalueData.controller_id;
  existingvalueJson.iscanview = existingvalueData.iscanview;
  existingvalueJson.iscanedit = existingvalueData.iscanedit;
  existingvalueJson.iscandelete = existingvalueData.iscandelete;
  existingvalueJson.iscancreate = existingvalueData.iscancreate;
  existingvalueJson.status = existingvalueData.status;
  existingvalueJson.remark = existingvalueData.remark;
  const updatedcontroller = await pageAccessPermission.findOneAndUpdate({_id}, {$set: reqBody},{session})
  const updatedcontrollerId = JSON.parse(JSON.stringify(updatedcontroller));
  lastInsertId = updatedcontrollerId._id;

  return {
    status: true,
    statusCode: 201,
    data: { updatedcontroller }
  }
}

const deletepageAccessPermission = async ({_id,reqBody,session}) => {
  const existingvalueData = await pageAccessPermission.findOne({ _id });
  existingvalueJson.role_id = existingvalueData.role_id;
  existingvalueJson.controller_id = existingvalueData.controller_id;
  existingvalueJson.iscanview = existingvalueData.iscanview;
  existingvalueJson.iscanedit = existingvalueData.iscanedit;
  existingvalueJson.iscandelete = existingvalueData.iscandelete;
  existingvalueJson.iscancreate = existingvalueData.iscancreate;
  existingvalueJson.status = existingvalueData.status;
  existingvalueJson.remark = existingvalueData.remark;
  const updatedcontroller = await pageAccessPermission.findOneAndUpdate({_id}, {$set: reqBody}, { session })
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
  createpageAccessPermission, pageAccessPermissionList, editpageAccessPermission,deletepageAccessPermission, loghistory
};
