const { authJwt, checkValueExisted, verifySignUp } = require("../middlewares");
const controller = require("../controllers/familyDetails.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/familyDetails/create",
    [
    //   authJwt.verifyToken, 
    //   authJwt.isSuperadminorAdmin  
    ],
    controller.create
  );

  app.get(
    "/api/familyDetails/list",
    [
    //   authJwt.verifyToken, 
    //   authJwt.isSuperadminorAdmin
    ],
    controller.familyDetailsList
  );

  app.get(
    "/api/familyDetails/update/:key",
    [
      authJwt.verifyToken, 
      authJwt.isSuperadminorAdmin
    ],
    controller.update
  );

  app.get(
    "/api/familyDetails/delete/:key",
    [
      authJwt.verifyToken, 
      authJwt.isSuperadminorAdmin
    ],
    controller.delete
  );
};
