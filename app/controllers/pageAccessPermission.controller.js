const mongoose = require('mongoose');
const pageName = 'pageAccessPermission';
const { createpageAccessPermission, pageAccessPermissionList, editpageAccessPermission,deletepageAccessPermission,loghistory } = require('../utils/pageAccessPermissionActions');
exports.create = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const reqBody = req.body;
      const action = 'create';
      const pageAccessPermissionResult = await Promise.all([
        createpageAccessPermission(
          {
            reqBody, session
          }
        ),
        loghistory(
            {
              req, res,reqBody,action,pageName,session
            }
        )
      ]);
      
      const failedTxns = pageAccessPermissionResult.filter((result) => result.status !== true);
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
        message: 'page Access Permission  was created successfully!'
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

exports.update = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const _id  = req.params.key;
      const reqBody = req.body;
      const action = 'update';
      req.body.token = req.headers["x-access-token"];
      const createcontrollerResult = await Promise.all([
        editpageAccessPermission(
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
        message: 'page Access Permission is Updated successfully!'
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
    const action = 'delete';
    
    const createcontrollerResult = await Promise.all([
      deletepageAccessPermission(
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
      message: 'page Access Permission is deleted successfully!'
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

exports.pageAccessPermissionList = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let userDetails = "";
  try {
    const {status} = req.body;
    const userResult = await Promise.all([
      pageAccessPermissionList(
        {
          status , session
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
      message: 'page Access Permission List!',
      pageAccessPermissionDetails:userDetails
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