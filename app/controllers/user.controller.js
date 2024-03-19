const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Loginlog = db.loginlog;
const { authJwt } = require("../middlewares");
const mongoose = require('mongoose');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const xlsxFile = require('read-excel-file/node');
const xlsx = require('xlsx');
const { userslist,edituser,deleteuser,loghistory,bulkInsert,getuserDetail } = require('../utils/userActions');
const pageName = 'user';

exports.update = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {  roles } = req.body;
    const _id  = req.params.key;
    const action = 'update';
    req.body.token = req.headers["x-access-token"];
    let hashpassword = bcrypt.hashSync(req.body.password, 8);
    let userRoles = [];
    if (roles) {
      try {
        const importantData = await Role.find(
          {
            name: { $in: roles },
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
    req.body.password = hashpassword;
    req.body.roles = userRoles;
    const reqBody = req.body;
    const createcontrollerResult = await Promise.all([
      edituser(
        {
          _id,reqBody,session
        }
      ),
      loghistory(
          {
            req, res,reqBody,action,pageName,session
          }
      )
    ]);
    
    const failedTxns = createcontrollerResult.filter((result) => result.status !== true);
    if (failedTxns.length) {
      const errors = failedTxns.map(a => a.message);
      await session.abortTransaction();
      return res.status(400).json({
        status: false,
        message: errors
      })
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      status: true,
      message: 'User profile details are Updated successfully!'
    })
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      status: false,
      message: `${err}`,
      err
    })
  }
}

exports.delete = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const _id  = req.params.key;
    req.body.status = "deleted";
    const reqBody = req.body;
    const action = req.body.action;
    
    const createcontrollerResult = await Promise.all([
      deleteuser(
        {
          _id,reqBody,session
        }
      ),
      loghistory(
          {
            req, res,reqBody,action,pageName,session
          }
      )
    ]);
    
    const failedTxns = createcontrollerResult.filter((result) => result.status !== true);
    if (failedTxns.length) {
      const errors = failedTxns.map(a => a.message);
      await session.abortTransaction();
      return res.status(400).json({
        status: false,
        message: errors
      })
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      status: true,
      message: 'User is deleted successfully!'
    })
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      status: false,
      message: `${err}`,
      err
    })
  }
}

exports.usersList = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let userDetails = "";
  try {
    const {usersListquery} = req.body;
    const userResult = await Promise.all([
      userslist(
        {
          usersListquery, session
        }
      ),
    ]);
    
    const failedTxns = userResult.filter((result) => result.status !== true);
    if (failedTxns.length) {
      const errors = failedTxns.map(a => a.message);
      await session.abortTransaction();
      return res.status(400).json({
        status: false,
        message: errors
      })
    } else {
      if(userResult[0].status == true) {
        userDetails = userResult[0].data
      }
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      status: true,
      message: 'User details list!',
      size:userDetails.length,
      userDetails
    })
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      status: false,
      message: `Unable to find perform transfer. Please try again. \n Error: ${err}`
    })
  }
}

exports.bulkInsert = async (req,res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let userDetails = "";
  try {
    const workbook = xlsx.readFile('uploads/users.xlsx');
    const sheet_name_list = workbook.SheetNames;
    var bulkInsertData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    const userResult = await Promise.all([
      bulkInsert(
        {
          req,bulkInsertData, session
        }
      ),
    ]);
    const failedTxns = userResult.filter((result) => result.status !== true);
    if (failedTxns.length) {
      const errors = failedTxns.map(a => a.message);
      await session.abortTransaction();
      return res.status(400).json({
        status: false,
        message: errors
      })
    } else {
      if(userResult[0].status == true) {
        userDetails = userResult[0].data
      }
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      status: true,
      message: 'User Bulk insert successfully!',
      size:userDetails.length,
      userDetails
    })
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      status: false,
      message: `Unable to find perform transfer. Please try again. \n ${err}`,
      error:err
    })
  }
}

exports.getuserDetail = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let userDetail = "";
  try {
    const _id  = req.body.userid;
    const getuserDetailResult = await Promise.all([
      getuserDetail(
        {
          _id,session
        }
      ),
    ]);
    
    const failedTxns = getuserDetailResult.filter((result) => result.status !== true);
    if (failedTxns.length) {
      const errors = failedTxns.map(a => a.message);
      await session.abortTransaction();
      return res.status(400).json({
        status: false,
        message: errors
      })
    } else {
      if(getuserDetailResult[0].status == true) {
        userDetail = getuserDetailResult[0].data;
      }
    }

    await session.commitTransaction();
    session.endSession();
    let users = userDetail.data;
    return res.status(200).json({
      users
    })
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      status: false,
      message: `${err}`,
      err
    })
  }
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}