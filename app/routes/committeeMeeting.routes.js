const { authJwt, checkValueExisted, verifySignUp } = require("../middlewares");
const controller = require("../controllers/committeeMeeting.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/committeeMeeting/create",
    [
      authJwt.verifyToken, 
      authJwt.isSuperadminorAdmin,  
      checkValueExisted.checkCommitteeDateExisted
    ],
    controller.create
  );

  app.get(
    "/api/committeeMeeting/list",
    [
      authJwt.verifyToken, 
      authJwt.isSuperadminorAdmin
    ],
    controller.committeeMeetingList
  );

  app.get(
    "/api/committeeMeeting/update/:key",
    [
      authJwt.verifyToken, 
      authJwt.isSuperadminorAdmin,
      checkValueExisted.checkCommitteeDateExisted
    ],
    controller.update
  );

  app.get(
    "/api/committeeMeeting/delete/:key",
    [
      authJwt.verifyToken, 
      authJwt.isSuperadminorAdmin
    ],
    controller.delete
  );

  app.get(
    "/api/committeeMeeting/paystatuslist",
    [
      authJwt.verifyToken, 
      authJwt.isSuperadminorAdmin
    ],
    controller.committeeMeetingpaystatusList
  );
};
