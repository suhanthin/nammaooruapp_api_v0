const { authJwt, checkValueExisted } = require("../middlewares");
const controller = require("../controllers/controllerList.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/controllerList/create",
    [
      authJwt.verifyToken, 
      authJwt.isSuperadmin,
      checkValueExisted.checkControllerNameExisted
    ],
    controller.create
  );

  app.get(
    "/api/controllerList/list",
    [
      authJwt.verifyToken, 
      authJwt.isSuperadmin
    ],
    controller.controllerList
  );

  app.get(
    "/api/controllerList/update/:key",
    [
      authJwt.verifyToken, 
      authJwt.isSuperadmin,
      checkValueExisted.checkControllerNameExisted
    ],
    controller.update
  );

  app.get(
    "/api/controllerList/delete/:key",
    [
      authJwt.verifyToken, 
      authJwt.isSuperadmin
    ],
    controller.delete
  );
};
