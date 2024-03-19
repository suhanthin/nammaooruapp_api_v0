// utils/transactions.js
const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const Users = db.user;
const Loghistory = db.loghistory;
const familyDetails = db.familyDetails;
const familyDetailCount = db.familyDetailCount;

var lastInsertId = "";
let changedvalueJson = {};
let existingvalueJson = {};
let loggedinuserId = "";

const createfamilyDetails = async ({ reqBody, session }) => {
  let familyIdcount = "";
  let familySubId = "";
  let family_Id = "";
  let family_name = "";
  if(reqBody.isnewFamily) {
    const familyDetail_Count = await familyDetailCount.find();
    if(familyDetail_Count.length > 0) {
      familyDetail_Count.map(item => {
        familyIdcount = item.familyCount + 1;
        item.familyCount = item.familyCount + 1;
        item.save();
      })
    }
    if(familyDetail_Count.length == 0) {
      familyIdcount =  1;
      const createduser = await familyDetailCount.create([{
        familyCount:1,
      }], { session });
    }
    family_Id = "F"+padDigits(familyIdcount, 4);
    family_name = reqBody.firstname+reqBody.lastname+"_"+family_Id;
    familySubId = "A1";

    if(reqBody.user_id) {
      const FindUser = await Users.find({_id:reqBody.user_id});
      if(FindUser.length > 0) {
        FindUser.map(item => {
          item.familyId = family_Id;
          item.save();
        })
      }
    }

  } else {
    const familyDetail_subId = await familyDetails.find({
      familyId: reqBody.familyId,
    });
    if(reqBody.ismarriedSamplePace == true){
      familySubId = reqBody.subId;
    } else {
      if(familyDetail_subId.length > 0) {
        let subidcount = familyDetail_subId.length + 1;
        familySubId = "A"+ subidcount;
      }
    }
    family_Id = reqBody.familyId;
    family_name = reqBody.familyname;
  }
  family_name = family_name.replace(/\s/g, '');
  const createdfamilyDetails = await familyDetails.create([{
    isnewFamily:reqBody.isnewFamily,
    familyId: family_Id,
    familyname: family_name,
    subId: familySubId,
    LevelNo: reqBody.LevelNo,
    ismember:reqBody.ismember,
    user_id: reqBody.user_id,
    firstname: reqBody.firstname,
    lastname: reqBody.lastname,
    gender: reqBody.gender,
    dob: reqBody.dob,
    phoneno: reqBody.phoneno,
    relation: reqBody.relation,
    maritalStatus: reqBody.maritalStatus,
    husorwife_name: reqBody.husorwife_name,
    IdentityProof: reqBody.IdentityProof,
    IdentityProofNo: reqBody.IdentityProofNo,
    address: reqBody.address,
    nationlaity: reqBody.nationlaity,
    qualification: reqBody.qualification,
    jobType: reqBody.jobType,
    jobportal: reqBody.jobportal,
    jobdetails: reqBody.jobdetails,
    status: reqBody.status,
    remark: reqBody.remark
  }], { session });
  
  const createdfamilyDetailsId = JSON.parse(JSON.stringify(createdfamilyDetails));
  lastInsertId = createdfamilyDetailsId[0]._id;
  return {
    status: true,
    statusCode: 201,
    message: 'familyDetails is created successful',
    data: { createdfamilyDetails }
  }
}

const familyDetailsList = async ({ familyListquery, session }) => {
  const query = {$and: familyListquery};
  const familyDetailsData = await familyDetails.find(query).sort( { memberId: 1 } );
  return {
    status: true,
    statusCode: 201,
    data: familyDetailsData
  }
}

const editfamilyDetails = async ({_id,reqBody,session}) => {
  const existingvalueData = await familyDetails.findOne({ _id });
  existingvalueJson.amount = existingvalueData.amount;
  existingvalueJson.effectiveDate = existingvalueData.effectiveDate;
  existingvalueJson.status = existingvalueData.status;
  existingvalueJson.remark = existingvalueData.remark;
  const updatedfamilyDetails = await familyDetails.findOneAndUpdate({_id}, {$set: reqBody},{session})
  const updatedfamilyDetailsId = JSON.parse(JSON.stringify(updatedfamilyDetails));
  lastInsertId = updatedfamilyDetailsId._id;

  return {
    status: true,
    statusCode: 201,
    data: { updatedfamilyDetails }
  }
}

const deletefamilyDetails = async ({_id,reqBody,session}) => {
  const existingvalueData = await familyDetails.findOne({ _id });
  existingvalueJson.amount = existingvalueData.amount;
  existingvalueJson.effectiveDate = existingvalueData.effectiveDate;
  existingvalueJson.status = existingvalueData.status;
  existingvalueJson.remark = existingvalueData.remark;
  const updatedfamilyDetails = await familyDetails.findOneAndUpdate({_id}, {$set: reqBody}, { session })
  const updatedfamilyDetailsId = JSON.parse(JSON.stringify(updatedfamilyDetails));
  lastInsertId = updatedfamilyDetailsId._id;

  return {
    status: true,
    statusCode: 201,
    data: { updatedfamilyDetails }
  }
}

const loghistory = async ({ req, res,reqBody,action,pageName,session }) => {
  await timeout(3000);
  const differ = filter(existingvalueJson, reqBody);
  //checkLogedinuserId(req,res);
  const loghistory = await Loghistory.create([{
    userId:loggedinuserId,
    recordId: lastInsertId,
    existingvalue: action == "create" ? "" : JSON.stringify(differ.old[0]),
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

function padDigits(number, digits) {
  return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

module.exports = {
  createfamilyDetails, familyDetailsList, editfamilyDetails, deletefamilyDetails, loghistory
};
