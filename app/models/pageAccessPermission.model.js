const mongoose = require("mongoose");

const pageAccessPermission = mongoose.model(
  "pageAccessPermission",
  new mongoose.Schema({
    role_id: {
      type: String,
      required: true,
    },
    controller_id: {
      type: String,
      required: true,
    },
    iscanview:{
      type: Boolean,
      default: false
    },
    iscanedit:{
      type: Boolean,
      default: false
    },
    iscandelete:{
      type: Boolean,
      default: false
    },
    iscancreate:{
      type: Boolean,
      default: false
    },
    iscanApprove:{
      type: Boolean,
      default: false
    },
    iscanCollection:{
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      required: true,
      default: 'active'
    },
    remark:String,
    created_at: { type: Date },
    updated_at: { type: Date },
    created_by: String,
    updated_by: String,
  }, { timestamps: true })
);

module.exports = pageAccessPermission;
