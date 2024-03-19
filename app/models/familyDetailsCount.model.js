const mongoose = require("mongoose");

const familyDetailsCount = mongoose.model(
  "familyDetailsCount",
  new mongoose.Schema({
    familyCount: {
        type: Number,
        default:0
    },
  }, { timestamps: true })
);

module.exports = familyDetailsCount;
