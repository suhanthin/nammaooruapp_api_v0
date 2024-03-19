const mongoose = require("mongoose");

const MemberTypeCount = mongoose.model(
  "MemberTypeCount",
  new mongoose.Schema({
    a_class: {
        type: Number,
        default:0
    },
    b_class: {
        type: Number,
        default:0
    },
    c_class: {
      type: Number,
      default:0
    },
  }, { timestamps: true })
);

module.exports = MemberTypeCount;
