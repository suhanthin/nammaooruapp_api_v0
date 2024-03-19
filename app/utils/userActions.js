// utils/transactions.js
const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const User = require("../models/user.model.js");
const Users = db.user;
const Loghistory = db.loghistory;
const MemberTypeCount = db.memberTypeCount;
const Role =db.role;
var lastInsertId = "";
let changedvalueJson = {};
let existingvalueJson = {};
let loggedinuserId = "";
let lastInsertprofileId = "";
var ObjectId = require('mongodb').ObjectId;
var bcrypt = require("bcryptjs");

let memberId = "";

const createusercount = async ({ reqBody, session }) => {
  await timeout(3000);
  const usercount = await MemberTypeCount.find();
  if(usercount.length > 0) {
    usercount.map(item => {
      if(reqBody.memberType == 'a-class'){
        item.a_class = item.a_class + 1;
      } else if(reqBody.memberType == 'b-class'){
        item.b_class = item.b_class + 1;
      } else if(reqBody.memberType == 'c-class'){
        item.c_class = item.c_class + 1;
      }
      item.save();
    })
    return {
      status: true,
      statusCode: 201,
      message: 'User count added successful',
      data: { usercount }
    }
  }
  if(usercount.length == 0) {
    let a_classValue = 0;
    let b_classValue = 0;
    let c_classValue = 0;
    if(reqBody.memberType == 'a-class'){
      a_classValue = 1;
      b_classValue = 0;
      c_classValue = 0;
    } else if(reqBody.memberType == 'b-class'){
      a_classValue = 0;
      b_classValue = 1;
      c_classValue = 0;
    } else if(reqBody.memberType == 'c-class'){
      a_classValue = 0;
      b_classValue = 0;
      c_classValue = 1;
    }
    const createduser = await MemberTypeCount.create([{
      a_class:a_classValue,
      b_class:b_classValue,
      c_class:c_classValue
    }], { session });
    return {
      status: true,
      statusCode: 201,
      message: 'User count created successful',
      data: { createduser }
    }
  }
}

const createuser = async ({ reqBody, session }) => {
  await timeout(3000);
  const usercount = await MemberTypeCount.find();
  let a_classMembercount = 0;
  let b_classMembercount = 0;
  let c_classMembercount = 0;
  if(usercount.length == 0) {
    let a_classValue = 0;
    let b_classValue = 0;
    let c_classValue = 0;
    if(reqBody.memberType == 'a-class'){
      a_classValue = 1;
      b_classValue = 0;
      c_classValue = 0;
    } else if(reqBody.memberType == 'b-class'){
      a_classValue = 0;
      b_classValue = 1;
      c_classValue = 0;
    } else if(reqBody.memberType == 'c-class'){
      a_classValue = 0;
      b_classValue = 0;
      c_classValue = 1;
    }
    a_classMembercount = padDigits(a_classValue, 4);
    b_classMembercount = padDigits(b_classValue, 4);
    c_classMembercount = padDigits(c_classValue, 4);
  } else {
    a_classMembercount = padDigits(usercount[0].a_class + 1, 4);
    b_classMembercount = padDigits(usercount[0].b_class + 1, 4);
    c_classMembercount = padDigits(usercount[0].c_class + 1, 4);
  }

  let usertypeSavedhalf = "";
  let maritalStatusSavedsingle = "";
  let memberTypeSavedbclass = "";
  let memberTypeSavedcclass = "";
  if(reqBody.userType == 'half'){
    usertypeSavedhalf = 'yes';
  }
  if(reqBody.maritalStatus == 'single'){
    maritalStatusSavedsingle = 'yes';
  }
  if(reqBody.memberType == 'b-class'){
    memberTypeSavedbclass = 'yes';
    memberId = "B"+b_classMembercount;
  } else if(reqBody.memberType == 'c-class'){
    memberTypeSavedcclass = 'yes';
    memberId = "C"+c_classMembercount;
  } else if(reqBody.memberType == 'a-class'){
    memberId = "A"+a_classMembercount;
  }
  let tempUserName = removeStringSpace(reqBody.firstname)+removeStringSpace(reqBody.lastname)+'_'+memberId
  const createduser = await Users.create([{
    username:tempUserName,
    password:reqBody.password,
    roles:reqBody.roles,
    rolesName:reqBody.rolesName,
    memberId:memberId,
    firstname:reqBody.firstname,
    lastname:reqBody.lastname,
    phoneno:reqBody.phoneno, 
    fathername:reqBody.fathername,
    mothername:reqBody.mothername,
    gender:reqBody.gender,
    avatar:reqBody.avatar,
    address:reqBody.address,
    dob:reqBody.dob,
    userType:reqBody.userType,
    userTypechangedDate:reqBody.userTypechangedDate,
    usertypeSavedhalf:usertypeSavedhalf,
    memberType:reqBody.memberType,
    memberTypeSavedbclass:memberTypeSavedbclass,
    memberTypeSavedcclass:memberTypeSavedcclass,
    memberTypechangedDate:reqBody.memberTypechangedDate,
    maritalStatus:reqBody.maritalStatus,
    maritalStatusSavedsingle:maritalStatusSavedsingle,
    maritalchangedDate:reqBody.maritalchangedDate,
    IdentityProof: reqBody.IdentityProof,
    IdentityProofNo: reqBody.IdentityProofNo,
    remark: reqBody.remark,
    nationlaity:reqBody.nationlaity,
    qualification:reqBody.qualification,
    jobType:reqBody.jobType,
    jobportal: reqBody.jobportal,
    jobdetails: reqBody.jobdetails,
    familyId: reqBody.familyId,
    isAdministrator: reqBody.isAdministrator,
    position:reqBody.position,
    isChitCommitteeMember:reqBody.isChitCommitteeMember,
    chitCommitteePosition:reqBody.chitCommitteePosition
  }], { session });
  const createduserId = JSON.parse(JSON.stringify(createduser));
  lastInsertId = createduserId[0]._id;
  return {
    status: true,
    statusCode: 201,
    message: 'User created successful',
    data: { createduser }
  }
}

const userslist = async ({ usersListquery, session }) => {
  const query = {$and: usersListquery};
  const UsersData = await User.find(query).sort( { memberId: 1 } );
  return {
    status: true,
    statusCode: 201,
    message: 'User List Details',
    data: UsersData
  }
}

const edituser = async({_id,reqBody,session}) => {
  const existingvalueData = await Users.findOne({ _id });
  existingvalueJson.username = existingvalueData.username;
  existingvalueJson.password = existingvalueData.password;
  existingvalueJson.roles = existingvalueData.roles;
  existingvalueJson.isAdministrator = existingvalueData.isAdministrator;
  existingvalueJson.position = existingvalueData.position;
  const usercount = await MemberTypeCount.find();
  let a_classMembercount = "";
  let b_classMembercount = "";

  existingvalueJson.memberId = existingvalueData.memberId;
  existingvalueJson.firstname = existingvalueData.firstname;
  existingvalueJson.lastname = existingvalueData.lastname;
  existingvalueJson.phoneno = existingvalueData.phoneno;
  existingvalueJson.fathername = existingvalueData.fathername;
  existingvalueJson.mothername = existingvalueData.mothername;
  existingvalueJson.gender = existingvalueData.gender;
  existingvalueJson.avatar = existingvalueData.avatar;
  existingvalueJson.address = existingvalueData.address;
  existingvalueJson.dob = existingvalueData.dob;
  existingvalueJson.balanceTribute = existingvalueData.balanceTribute;
  existingvalueJson.userType = existingvalueData.userType;
  existingvalueJson.userTypechangedDate = existingvalueData.userTypechangedDate;
  existingvalueJson.usertypeSavedhalf = existingvalueData.usertypeSavedhalf;
  existingvalueJson.memberType = existingvalueData.memberType;
  existingvalueJson.memberTypeSavedbclass=existingvalueData.memberTypeSavedbclass;
  existingvalueJson.memberTypechangedDate = existingvalueData.memberTypechangedDate;
  existingvalueJson.maritalStatus = existingvalueData.maritalStatus;
  existingvalueJson.maritalStatusSavedsingle = existingvalueData.maritalStatusSavedsingle;
  existingvalueJson.maritalchangedDate = existingvalueData.maritalchangedDate;
  existingvalueJson.remark = existingvalueData.remark;
  existingvalueJson.IdentityProof = existingvalueData.IdentityProof;
  existingvalueJson.IdentityProofNo = existingvalueData.IdentityProofNo;
  existingvalueJson.status = existingvalueData.status;
  existingvalueJson.nationlaity = existingvalueData.nationlaity;
  existingvalueJson.qualification = existingvalueData.qualification;
  existingvalueJson.jobType = existingvalueData.jobType;
  existingvalueJson.jobportal = existingvalueData.jobportal;
  existingvalueJson.jobdetails = existingvalueData.jobdetails;
  existingvalueJson.familyId = existingvalueData.familyId;

  if(reqBody.memberTypeSavedbclass == 'yes'){
    if(usercount.length > 0) {
      if(reqBody.memberType == 'a-class'){
        a_classMembercount = padDigits(usercount[0].a_class + 1, 4);
      } else if(reqBody.memberType == 'b-class'){
        b_classMembercount = padDigits(usercount[0].b_class + 1, 4);
      }
    }
    
    if(reqBody.memberType == 'b-class'){
      reqBody.memberId = "B"+b_classMembercount;
    } else if(reqBody.memberType == 'a-class'){
      reqBody.memberId = "A"+a_classMembercount;
      if(usercount.length > 0) {
        usercount.map(item => {
          if(reqBody.memberType == 'a-class'){
            item.a_class = item.a_class + 1;
          }
          item.save();
        })
      }
    }
  }

  if(reqBody.type == 'full'){
    reqBody.usertypeSavedhalf = 'no';
  }
  if(reqBody.maritalStatus == 'married' || reqBody.maritalStatus == 'widowed'){
    reqBody.maritalStatusSavedsingle = 'no';
  }
  if(reqBody.memberType == 'a-class'){
    reqBody.memberTypeSavedbclass = 'no';
  }

  const updatedcontroller = await Users.findOneAndUpdate({_id}, {$set: reqBody},{session})
  const updatedcontrollerId = JSON.parse(JSON.stringify(updatedcontroller));
  lastInsertId = updatedcontrollerId._id;

  return {
    status: true,
    statusCode: 201,
    data: { updatedcontroller }
  }
}

const deleteuser = async ({_id,reqBody,session}) => {
  const existingvalueData = await User.findOne({ _id });
  existingvalueJson.status = existingvalueData.status;
  existingvalueJson.remark = existingvalueData.remark;
  const updatedUser = await User.findOneAndUpdate({_id:_id}, {$set: reqBody}, { session })
  const updatedcontrollerId = JSON.parse(JSON.stringify(updatedUser));
  lastInsertId = updatedcontrollerId._id;

  return {
    status: true,
    statusCode: 201,
    data: { updatedUser }
  }
}

const bulkInsert = async({req,bulkInsertData,session}) => {
  const pageName = 'user';
  let a_classMembercount = "";
  let b_classMembercount = "";
  let c_classMembercount = "";
  let a_classValue = 0;
  let b_classValue = 0;
  let c_classValue = 0;
  let a_incrementCount = 0;
  let b_incrementCount = 0;
  let c_incrementCount = 0;
  if(bulkInsertData.length > 0) {
    await Promise.all(bulkInsertData.map( async (rev, index) => {
      let itemObject = rev;
      const {  roles } = itemObject;
      let hashpassword = bcrypt.hashSync(itemObject.password.toString(), 8);
      const action = 'create';
      let userRoles = "";
      if (roles) {
        try {
          const importantData = await Role.find(
            {
              name: roles,
            }
          );
          userRoles = importantData.map((role) => role._id);
        } catch (exception) {
          console.log(exception)
        }
      } else {
        try {
          const importantData = await Role.findOne(
            { name: "member" }
          );
          userRoles = importantData._id;
        } catch (exception) {
          console.log(exception)
        }
      }
      itemObject.password = hashpassword;
      itemObject.roles = userRoles;
      const usercount = await MemberTypeCount.find();
      let bulkLastInsertID = "";
      
      // create user
      if(usercount.length == 0) {
        if(itemObject.memberType == 'a-class'){
          a_classValue = a_incrementCount + 1;
          a_incrementCount++;
        } else if(itemObject.memberType == 'b-class'){
          b_classValue = b_incrementCount + 1;
          b_incrementCount++;
        }
        else if(itemObject.memberType == 'c-class'){
          c_classValue = c_incrementCount + 1;
          c_incrementCount++;
        }
        a_classMembercount = padDigits(a_classValue, 4);
        b_classMembercount = padDigits(b_classValue, 4);
        c_classMembercount = padDigits(c_classValue, 4);
      } else if(usercount.length > 0) {
        if(itemObject.memberType == 'a-class'){
          a_classValue = usercount[0].a_class + a_incrementCount + 1;
          a_incrementCount++;
        } else if(itemObject.memberType == 'b-class'){
          b_classValue =  usercount[0].b_class + b_incrementCount + 1;
          b_incrementCount++;
        }
        else if(itemObject.memberType == 'c-class'){
          c_classValue =  usercount[0].c_class + c_incrementCount + 1;
          c_incrementCount++;
        }
        a_classMembercount = padDigits(a_classValue, 4);
        b_classMembercount = padDigits(b_classValue, 4);
        c_classMembercount = padDigits(c_classValue, 4);
      }

      let usertypeSavedhalf = "";
      let maritalStatusSavedsingle = "";
      let memberTypeSavedbclass = "";
      let memberTypeSavedcclass = "";
      if(itemObject.userType == 'half'){
        usertypeSavedhalf = 'yes';
      }
      if(itemObject.maritalStatus == 'single'){
        maritalStatusSavedsingle = 'yes';
      }
      if(itemObject.memberType == 'b-class'){
        memberTypeSavedbclass = 'yes';
        memberId = "B"+b_classMembercount;
      } else if(itemObject.memberType == 'c-class'){
        memberTypeSavedcclass = 'yes';
        memberId = "C"+c_classMembercount;
      } else if(itemObject.memberType == 'a-class'){
        memberId = "A"+a_classMembercount;
      }
      const createduser = await Users.create([{
        username:itemObject.username+'_'+memberId,
        password:itemObject.password,
        roles:itemObject.roles,
        rolesName:roles,
        memberId:memberId,
        firstname:itemObject.firstname,
        lastname:itemObject.lastname,
        phoneno:itemObject.phoneno, 
        fathername:itemObject.fathername,
        mothername:itemObject.mothername,
        gender:itemObject.gender,
        avatar:itemObject.avatar,
        address:itemObject.address,
        dob:itemObject.dob,
        userType:itemObject.userType,
        userTypechangedDate:itemObject.userTypechangedDate,
        usertypeSavedhalf:usertypeSavedhalf,
        memberType:itemObject.memberType,
        memberTypeSavedbclass:memberTypeSavedbclass,
        memberTypeSavedcclass:memberTypeSavedcclass,
        memberTypechangedDate:itemObject.memberTypechangedDate,
        maritalStatus:itemObject.maritalStatus,
        maritalStatusSavedsingle:maritalStatusSavedsingle,
        maritalchangedDate:itemObject.maritalchangedDate,
        IdentityProof: itemObject.IdentityProof,
        IdentityProofNo: itemObject.IdentityProofNo,
        remark: itemObject.remark,
        nationlaity:itemObject.nationlaity,
        qualification:itemObject.qualification,
        jobType:itemObject.jobType,
        jobportal: itemObject.jobportal,
        jobdetails: itemObject.jobdetails,
        familyId: itemObject.familyId,
        status: itemObject.status,
      }], { session });
      const createduserId = JSON.parse(JSON.stringify(createduser));
      bulkLastInsertID = createduserId[0]._id;
      
      //create user log history
      const differ = filter(existingvalueJson, itemObject);
      loggedinuserId = checkLogedinuserId(req);
      const loghistory = await Loghistory.create([{
        userId:loggedinuserId ? loggedinuserId : "",
        recordId: bulkLastInsertID,
        existingvalue: action == "create" ? "" : JSON.stringify(differ.old[0]),
        changedvalue: action == "create" ? JSON.stringify(itemObject) : JSON.stringify(differ.new[0]),
        action:action,
        pagename: pageName
      }], { session });
    }));
  }
  const usercount = await MemberTypeCount.find();
  if(usercount.length > 0) {
    usercount.map(item => {
      item.a_class = a_classValue;
      item.b_class = b_classValue;
      item.c_class = c_classValue;
      item.save();
    })
  } else if(usercount.length == 0){
    const createduser = await MemberTypeCount.create([{
      a_class:a_classValue,
      b_class:b_classValue,
      c_class:c_classValue
    }], { session });
  }
  return {
    status: true,
    statusCode: 201,
    data: { bulkInsertData }
  }
}

const loghistory = async ({ req, res,reqBody,action,pageName,session }) => {
  await timeout(3000);
  const differ = filter(existingvalueJson, reqBody);
  loggedinuserId = checkLogedinuserId(req);
  const loghistory = await Loghistory.create([{
    userId:loggedinuserId ? loggedinuserId : "",
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

const loghistorylist = async ({ pagename, session }) => {
  const UsersData = await Loghistory.find(
    {
      pagename: pagename,
    }
  );
  return {
    status: true,
    statusCode: 201,
    message: 'Log history list!',
    data: UsersData
  }
}

const getuserDetail = async ({_id,session}) => {
  const data = await User.findOne({ _id });
  return {
    status: true,
    statusCode: 201,
    data: { data }
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
    return false;
  }

  try {
    const decoded = jwt.verify(token, config.secret);
    if(decoded) {
      return decoded.id;
    }
  }
  catch (ex) { console.log(ex.message); return false;}
}

function padDigits(number, digits) {
  return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

function removeStringSpace(str) {
  return str.replace(/\s/g, '');
}

module.exports = {
  createuser, createusercount, userslist, edituser, deleteuser, loghistory, loghistorylist, bulkInsert, getuserDetail
};
