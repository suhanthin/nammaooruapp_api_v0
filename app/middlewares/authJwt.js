const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Loginlogs = db.loginlog;

verifyToken = async (req, res, next) => {
  await timeout(3000);
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(400).send({
        error: err,
        message: "Unauthorized!",
      });
    } else {
      req.userId = decoded.id;
      next();
    }
  });
};

isAdmin = async (req, res, next) => {
  await timeout(3000);
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};

isMember = async (req, res, next) => {
  await timeout(3000);
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "member") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require member Role!" });
        return;
      }
    );
  });
};

isSuperadmin = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    loggedinuserId = "";
    return false;
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return err;
    } else {
      User.findById(decoded.id).exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
    
        Role.find(
          {
            _id: { $in: user.roles },
          },
          (err, roles) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
    
            for (let i = 0; i < roles.length; i++) {
              if (roles[i].name == "superadmin") {
                next();
                return;
              }
            }
    
            res.status(403).send({ message: "Require superadmin Role!" });
            return;
          }
        );
      });
    }
  });
};

isSuperadminorAdmin = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    loggedinuserId = "";
    return false;
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return err;
    } else {
      User.findById(decoded.id).exec((err, user) => {
        
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
    
        Role.find(
          {
            _id: user.roles,
          },
          (err, roles) => {
            
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            //for (let i = 0; i < roles.length; i++) {
              if (roles[0].name === "superadmin" || roles[0].name === "admin") {
                next();
                return;
              }
            //}
    
            res.status(403).send({ message: "Require superadmin or admin Role!" });
            return;
          }
        );
      });
    }
  });
};

isCheckRolePermission = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: user.roles,
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        //for (let i = 0; i < roles.length; i++) {
          if (roles.name === "superadmin") {
            next();
            return;
          }
        //}

        res.status(403).send({ message: "Require superadmin Role!" });
        return;
      }
    );
  });
};

ischeckLoggedin = (req,res,next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    loggedinuserId = "";
    res.status(403).send({ message: "Access token required." });
    return;
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return err;
    } else {
      var condition = {
        "login_status":"Loggedin",
        "userId":decoded.id,
      }
      Loginlogs.find(condition, (err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if(user[0] && user[0]._doc.logoff_time == "") {
          next();
          return;
        } else {
          res.status(403).send({ message: "Login Required." });
          return;
        }
      })
      return;
    }
  });
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const authJwt = {
  verifyToken,
  ischeckLoggedin,
  isAdmin,
  isMember,
  isSuperadmin,
  isSuperadminorAdmin
};
module.exports = authJwt;
