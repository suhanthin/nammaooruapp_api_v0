const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsername = (req, res, next) => {
  // Username
  User.findOne({
    username: req.body.username,
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
        res.status(400).send({ message: "Failed! Username is already in use!" });
        return;
      }
    }
    next();
  });
};

checkDuplicatePosition = (req, res, next) => {
  // Username
  if(req.body.isAdministrator && req.body.isChitCommitteeMember ){
    res.status(400).send({ message: "Failed! Not allow to add multiple position in one member!" });
    return;
  } else if(req.body.isAdministrator){
    User.findOne({
      position: req.body.position,
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (user) {
        res.status(400).send({ message: "Failed! position is already used in another one member!" });
        return;
      } else {
        next();
      }
    });
  }
  next();
};

checkDuplicatechitCommitteePosition = (req, res, next) => {
  // Username
  if(req.body.isChitCommitteeMember){
    if(req.body.chitCommitteePosition == "") {
      res.status(400).send({ message: "Failed! chit Committee Position must be added!" });
      return;
    } else {
      User.findOne({
        chitCommitteePosition: "chitadmin",
      }).exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (user) {
          res.status(400).send({ message: "Failed! chit Committee Position `Admin` role is already used in another one member!" });
          return;
        }
        next();
      });
    }
  } else {
    next();
  }
};

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }

    // Email
    User.findOne({
      email: req.body.email,
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }

      next();
    });
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    //for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles)) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles} does not exist!`,
        });
        return;
      }
    //}
  }
  next();
};

const verifySignUp = {
  checkDuplicateUsername,
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
  checkDuplicatePosition,
  checkDuplicatechitCommitteePosition
};

module.exports = verifySignUp;
