const { verifySignUp, checkEmptyValue, authJwt } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      // authJwt.verifyToken, 
      // verifySignUp.checkDuplicateUsername,
      // verifySignUp.checkRolesExisted,
      // authJwt.ischeckLoggedin,
      // authJwt.isSuperadminorAdmin
      verifySignUp.checkDuplicatePosition,
      verifySignUp.checkDuplicatechitCommitteePosition
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/refreshAccessToken", controller.refreshAccessToken);

  app.post("/api/auth/signout", controller.signout);

  app.get("/api/auth/loghistorylist",
    [
      authJwt.verifyToken, 
      authJwt.isSuperadminorAdmin
    ],
    controller.loghistorylist
  );

  app.get("/api/auth/tokenIsValid", controller.tokenIsValid)

};
