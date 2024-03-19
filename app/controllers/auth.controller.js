const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Loginlog = db.loginlog;
const Loghistory = db.loghistory;
const { authJwt } = require("../middlewares");
const mongoose = require('mongoose');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const IP = require('ip');
const xlsx = require('xlsx');
const { createuser, createusercount, loghistory,loghistorylist } = require('../utils/userActions');
const pageName = 'user';

exports.signup = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {  roles,isAdministrator,position,isChitCommitteeMember,chitCommitteePosition } = req.body;
    let commonPassword = "12345678";
    let hashpassword = bcrypt.hashSync(commonPassword, 8);
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
    req.body.password = hashpassword;
    req.body.roles = userRoles;
    req.body.rolesName = roles;
    const reqBody = req.body;
    const userResult = await Promise.all([
      createusercount(
        {
          reqBody, session
        }
      ),
      createuser(
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
    const failedTxns = userResult.filter((result) => result.status !== true);
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
      message: 'User was registered successfully!'
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

exports.signin = async (req, res) => {
  console.log(req.body)
  const username = req.body.username;
  const password = req.body.password;
  if (!username) {
    return res.status(400).send({ message: 'User Name required.'});
  }
  if (!password) {
    return res.status(400).send({ message: 'Password required.'});
  }
  User.findOne({
    username: req.body.username,
  })
  .populate("roles", "-__v")
  .exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(400).send({ message: "User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(400).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    let userData = {
      time: Date(),
      id: user.id,
    };

    const token = jwt.sign(userData, config.secret, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: 86400, // 24 hours
      //expiresIn: 120,
    });

    const refreshtoken = jwt.sign(userData, config.refresh_secret, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: 2592000, // 1 month
    });

    var authorities = "";
    //for (let i = 0; i < user.roles.length; i++) {
      authorities="ROLE_" + user.roles.name.toUpperCase();
    //}
    user.token = token;
    user.refresh_token = refreshtoken;
    req.session.token = token;
    const ipAddress = IP.address();
    Loginlog.create([{
      userId: user.id,
      ip_address: ipAddress,
      login_status: "Loggedin",
      login_time: new Date(),
      logoff_time: ""
    }]);
    return res.status(200).json(
      {
        "status": "success",
        "message": "Login successful",
        "data": {
          id: user._id,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          roles: authorities,
          rolesName: user.rolesName,
          memberId: user.memberId,
          isAdministrator: user.isAdministrator,
          position: user.position,
          phoneno: user.phoneno,
          fathername: user.fathername,
          mothername: user.mothername,
          gender: user.gender,
          avatar: user.avatar,
          address: user.address,
          dob: user.dob,
          balanceTribute: user.balanceTribute,
          userType: user.userType,
          userTypechangedDate: user.userTypechangedDate,
          usertypeSavedhalf: user.usertypeSavedhalf,
          maritalStatus: user.maritalStatus,
          maritalStatusSavedsingle: user.maritalStatusSavedsingle,
          maritalchangedDate: user.maritalchangedDate,
          memberType: user.memberType,
          memberTypeSavedbclass: user.memberTypeSavedbclass,
          memberTypechangedDate: user.memberTypechangedDate,
          identityProof: user.identityProof,
          identityProofNo: user.identityProofNo,
          nationlaity: user.nationlaity,
          qualification: user.qualification,
          jobType: user.jobType,
          jobdetails: user.jobdetails,
          jobportal: user.jobportal,
          familyId: user.familyId,
          status: user.status,
          remark: user.remark,
          accessToken: token,
          refreshToken: refreshtoken,
        }
      }
    );
  });
};

exports.signout = async (req, res) => {
  try {
    Loginlog.findOne({ userId: req.body.userId, logoff_time: "" }, (err, loginlog) => {

      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (loginlog == null) {
        return res.status(202).send({ message: "You are already signed out!" });
      } else {
        loginlog.login_status= "Loggedoff",
        loginlog.logoff_time = new Date();
        loginlog.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          req.session = null;
          return res.status(200).send({ message: "You've been signed out!" });
        });
      }

    });

  } catch (err) {
    this.next(err);
  }
};

exports.refreshAccessToken = async (req, res) => {
  const refreshToken = req.body.refresh_token;
  if (!refreshToken) {
    return res.status(400).send('Access Denied. No refresh token provided.');
  }

  try {
    const decoded = jwt.verify(refreshToken, config.refresh_secret);
    User.findOne({
      _id: decoded.id,
    })
      .populate("roles", "-__v")
      .exec((err, user) => {

        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }

        let userData = {
          time: Date(),
          id: decoded.id,
        };
        const accessToken = jwt.sign(userData, config.secret, {
          algorithm: "HS256",
          allowInsecureKeySizes: true,
          expiresIn: 180,
        });
        const refreshtoken = jwt.sign(userData, config.refresh_secret, {
          algorithm: "HS256",
          allowInsecureKeySizes: true,
          expiresIn: 2592000, // 1 month
        });

        var authorities = [];
        for (let i = 0; i < user.roles.length; i++) {
          authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }
        user.token = accessToken;
        user.refresh_token = refreshtoken;
        req.session.token = accessToken;

        user.save((err) => {
          res.status(200).send({
            message: "Token regenerated.",
            id: user._id,
            username: user.username,
            email: user.email,
            // roles: authorities,
            accessToken: accessToken,
            refreshToken: refreshtoken,
          });
        });
      });
  } catch (error) {
    return res.status(400).send('Invalid refresh token.');
  }
}

exports.loghistorylist = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let userDetails = "";
  try {
    const {pagename} = req.body;
    const userResult = await Promise.all([
      loghistorylist(
        {
          pagename, session
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

exports.tokenIsValid = async (req, res) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(400).json({
        error: err,
        message: "Unauthorized!",
      })
    } else {
      let userid = decoded.id;
      return res.status(200).json({
        userid
      })
    }
  });
}