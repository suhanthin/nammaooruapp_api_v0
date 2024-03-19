const { authJwt, checkValueExisted, verifySignUp } = require("../middlewares");
const controller = require("../controllers/chantha.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/chantha/create",
    [
      authJwt.verifyToken, 
      authJwt.isSuperadminorAdmin  
    ],
    controller.create
  );

  app.get(
    "/api/chantha/list",
    [
      authJwt.verifyToken, 
      authJwt.isSuperadminorAdmin
    ],
    controller.chanthaList
  );

  app.get(
    "/api/chantha/update/:key",
    [
      authJwt.verifyToken, 
      authJwt.isSuperadminorAdmin
    ],
    controller.update
  );

  app.get(
    "/api/chantha/delete/:key",
    [
      authJwt.verifyToken, 
      authJwt.isSuperadminorAdmin
    ],
    controller.delete
  );
};
