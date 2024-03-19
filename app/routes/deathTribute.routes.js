const { authJwt, checkValueExisted, verifySignUp } = require("../middlewares");
const controller = require("../controllers/deathTribute.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/deathTribute/create",
    [
      authJwt.verifyToken, 
      authJwt.isSuperadminorAdmin,  
    ],
    controller.create
  );

  app.get(
    "/api/deathTribute/list",
    [
      // authJwt.verifyToken, 
      // authJwt.isSuperadminorAdmin
    ],
    controller.deathTributeList
  );

  app.get(
    "/api/deathTribute/update/:key",
    [
      // authJwt.verifyToken, 
      // authJwt.isSuperadminorAdmin,
    ],
    controller.update
  );

  app.get(
    "/api/deathTribute/delete/:key",
    [
      // authJwt.verifyToken, 
      // authJwt.isSuperadminorAdmin
    ],
    controller.delete
  );

  app.get(
    "/api/deathTribute/paystatuslist",
    [
      // authJwt.verifyToken, 
      // authJwt.isSuperadminorAdmin
    ],
    controller.deathTributepaystatusList
  );
};
