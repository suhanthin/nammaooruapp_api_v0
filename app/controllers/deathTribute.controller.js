const mongoose = require('mongoose');
const pageName = 'deathTribute';
const { createdeathTribute,createdeathTributeHistory,editdeathTribute,deletedeathTributeHistory,deletedeathTribute,deathTributeList,loghistory,deathTributepaystatusList } = require('../utils/deathTributeActions');

exports.create = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const reqBody = req.body;
      const action = 'create';
      const createcontrollerResult = await Promise.all([
        createdeathTribute(
          {
            reqBody, session
          }
        ),
        createdeathTributeHistory(
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
        message: 'death Tribute was created successfully!'
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
        editdeathTribute(
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
        message: 'death Tribute is Updated successfully!'
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
      deletedeathTribute(
        {
          _id,reqBody,session
        }
      ),
      deletedeathTributeHistory(
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
      message: 'death Tribute is deleted successfully!'
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

exports.deathTributeList = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let userDetails = "";
  try {
    const {status} = req.body;
    const userResult = await Promise.all([
      deathTributeList(
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
      message: 'death Tribute details list!',
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

exports.deathTributepaystatusList = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let deathTributeDetails = "";
  try {
    const {mettingListquery} = req.body;
    const userResult = await Promise.all([
      deathTributepaystatusList(
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
        deathTributeDetails = userResult[0].data
      }
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      status: true,
      message: 'deathTribute details list!',
      deathTributeDetails
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
