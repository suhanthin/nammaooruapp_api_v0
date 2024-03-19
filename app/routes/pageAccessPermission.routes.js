const { authJwt, checkValueExisted, verifySignUp } = require("../middlewares");
const controller = require("../controllers/pageAccessPermission.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/pageAccessPermission/create",
    [
      authJwt.verifyToken, 
      authJwt.isSuperadmin,
      checkValueExisted.checkRoleIdExisted,
      checkValueExisted.checkContollerIdExisted,
      checkValueExisted.checkpageAccessPermissionExisted      
    ],
    controller.create
  );

  app.get(
    "/api/pageAccessPermission/list",
    [
      authJwt.verifyToken, 
      authJwt.isSuperadmin
    ],
    controller.pageAccessPermissionList
  );

  app.get(
    "/api/pageAccessPermission/update/:key",
    [
      authJwt.verifyToken, 
      authJwt.isSuperadmin,
      checkValueExisted.checkRoleIdExisted,
      checkValueExisted.checkContollerIdExisted,
      checkValueExisted.checkpageAccessPermissionExisted
    ],
    controller.update
  );

  app.get(
    "/api/pageAccessPermission/delete/:key",
    [
      authJwt.verifyToken, 
      authJwt.isSuperadmin
    ],
    controller.delete
  );
};
