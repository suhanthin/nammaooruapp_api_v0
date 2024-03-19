const mongoose = require('mongoose');
const pageName = 'committeeMeeting';
const { createcommitteeMeeting,createcommitteeMeetingHistory,editcommitteeMeeting,deletecommitteeMeetingHistory,deletecommitteeMeeting,committeeMeetingList,loghistory,committeeMeetingpaystatusList } = require('../utils/committeeMeetingActions');

exports.create = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const reqBody = req.body;
      const action = 'create';
      const createcontrollerResult = await Promise.all([
        createcommitteeMeeting(
          {
            reqBody, session
          }
        ),
        createcommitteeMeetingHistory(
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
        message: 'committee Meeting was created successfully!'
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
        editcommitteeMeeting(
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
        message: 'committeeMeeting is Updated successfully!'
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
      deletecommitteeMeeting(
        {
          _id,reqBody,session
        }
      ),
      deletecommitteeMeetingHistory(
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
      message: 'committeeMeeting is deleted successfully!'
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

exports.committeeMeetingList = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let userDetails = "";
  try {
    const {status} = req.body;
    const userResult = await Promise.all([
      committeeMeetingList(
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
      message: 'committeeMeeting details list!',
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

exports.committeeMeetingpaystatusList = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let committeeMeetingDetails = "";
  try {
    const {mettingListquery} = req.body;
    const userResult = await Promise.all([
      committeeMeetingpaystatusList(
        {
          mettingListquery , session
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
        committeeMeetingDetails = userResult[0].data
      }
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      status: true,
      message: 'committeeMeeting details list!',
      committeeMeetingDetails
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
