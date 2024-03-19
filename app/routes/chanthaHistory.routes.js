const { authJwt, checkValueExisted, verifySignUp } = require("../middlewares");
const controller = require("../controllers/chanthaHistory.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/chanthaHistory/create",
    [
      authJwt.verifyToken, 
      authJwt.isSuperadminorAdmin,
      checkValueExisted.checkChanthaIdExisted  
    ],
    controller.create
  );

  app.get(
    "/api/chanthaHistory/list",
    [
      authJwt.verifyToken, 
      authJwt.isSuperadminorAdmin
    ],
    controller.chanthaHistoryList
  );

  app.get(
    "/api/chanthaHistory/update/:key",
    [
      authJwt.verifyToken, 
      authJwt.isSuperadminorAdmin
    ],
    controller.update
  );

  app.get(
    "/api/chanthaHistory/delete/:key",
    [
      authJwt.verifyToken, 
      authJwt.isSuperadminorAdmin
    ],
    controller.delete
  );
};
