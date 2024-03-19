// utils/transactions.js
const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const Users = db.user;

const userslist = async ({ usersListquery, session }) => {
    console.log('test2')
    const query = {$and: usersListquery};
    const UsersData = await Users.find().sort( { memberId: 1 } );
    return {
      status: true,
      statusCode: 201,
      message: 'User List Details',
      data: UsersData
    }
  }

module.exports = {
    userslist
};
