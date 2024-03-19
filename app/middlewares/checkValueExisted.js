const db = require("../models");
const User = require("../models/user.model");
const ControllerList = db.controllerList;
const pageAccessPermission = db.pageAccessPermission;
const Role = db.role;
const Chantha = db.chantha;
const committeeMeeting = db.committeeMeeting;
var ObjectId = require('mongodb').ObjectId;

checkControllerNameExisted = (req, res, next) => {
  // Username
  ControllerList.findOne({
    controllerName: req.body.controllerName,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      if(req.params.key == user._id.toString()){
        next();
        return;
      } else {
        res.status(400).send({ message: "Failed! controller name is already in use!" });
        return;
      }
    }
    next();
  });
};

checkpageAccessPermissionExisted = (req, res, next) => {
  // Username
  pageAccessPermission.findOne({
    controller_id: req.body.controller_id,
    role_id:req.body.role_id
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      if(req.params.key == user._id.toString()){
        next();
        return;
      } else {
        res.status(400).send({ message: "Failed! controller and role compination is already in use!" });
        return;
      }
    }
    next();
  });
};

checkRoleIdExisted = (req,res,next) => {
  var role_id = new ObjectId(req.body.role_id);
  Role.findOne({
    _id: role_id
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      res.status(400).send({ message: "Failed! Role is does not exist!" });
      return;
    }
    next();
  });
};

checkContollerIdExisted = (req,res,next) => {
  var controller_id= new ObjectId(req.body.controller_id);
  ControllerList.findOne({
    _id: controller_id
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      res.status(400).send({ message: "Failed! Controller name is does not exist!" });
      return;
    }
    next();
  });
};

checkChanthaIdExisted = (req,res,next) => {
  var chantha_id= new ObjectId(req.body.chantha_id);
  Chantha.findOne({
    _id: chantha_id,
    status: 'active'
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      res.status(400).send({ message: "Failed! chantha is does not exist or not in active!" });
      return;
    }
    next();
  });
};

checkPositionNameExisted = (req, res, next) => {
  // Username
  User.findOne({
    position: req.body.position,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      if(req.params.key == user._id.toString()){
        next();
        return;
      } else {
        res.status(400).send({ message: "Failed! position is already in used another one user!" });
        return;
      }
    }
    next();
  });
};

checkCommitteeDateExisted = (req, res, next) => {
  // Username
  const query = {
    $and: [
      {
        "meetingDate": req.body.meetingDate
      },
      {
        "status": "active"
      }
    ]
  };

  committeeMeeting.findOne(query).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      if(req.params.key == user._id.toString()){
        next();
        return;
      } else {
        res.status(400).send({ message: "Failed! Committee Meeting is already created in same date!" });
        return;
      }
    }
    next();
  });
};

const checkValueExisted = {
  checkControllerNameExisted,
  checkpageAccessPermissionExisted,
  checkRoleIdExisted,
  checkContollerIdExisted,
  checkChanthaIdExisted,
  checkPositionNameExisted,
  checkCommitteeDateExisted
};

module.exports = checkValueExisted;
