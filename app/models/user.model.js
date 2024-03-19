const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    memberId: {
      type: String,
      trim: true
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    rolesName:String,
    isAdministrator:{
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: ''
    },
    isChitCommitteeMember:{
      type: Boolean,
      default: false
    },
    chitCommitteePosition: {
      type: String,
      default: ''
    },
    token: String,
    refresh_token: String,
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    phoneno: {
      type: String,
      required: true,
    },
    fathername: {
      type: String,
      required: true,
    },
    mothername: String,
    gender: String,
    avatar: String,
    address: String,
    dob: String,
    balanceTribute: {
      type: Number,
      required: true,
      default:0,
      integer: true,
      get: v => Math.round(v),
      set: v => Math.round(v),
      validate : {
        validator : Number.isInteger,
        message   : '{VALUE} is not an integer value'
      }
    },
    userType: {
      type: String,
      required: true,
    },
    usertypeSavedhalf:String,
    userTypechangedDate: String,
    maritalStatus: String,
    maritalchangedDate: String,
    maritalStatusSavedsingle:String,
    memberType: {
      type: String,
      required: true,
    },
    memberTypechangedDate: String,
    memberTypeSavedbclass: {
      type: String,
      trim: true,
      maxlength: 20
    },
    memberTypeAddedDate: String,
    memberTypeSavedcclass: {
      type: String,
      trim: true,
      maxlength: 20
    },
    IdentityProof: String,
    IdentityProofNo: String,
    nationlaity: {
      type: String,
      default: 'indian'
    },
    qualification: String,
    jobType: String,
    jobportal: String,
    jobdetails: String,
    familyId: String,
    status: {
      type: String,
      required: true,
      default: 'active'
    },
    remark: String,
    created_at: { type: Date },
    updated_at: { type: Date },
    created_by: String,
    updated_by: String,
  }, { timestamps: true })
);

module.exports = User;
