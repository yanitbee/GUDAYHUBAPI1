const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const joi = require("joi");

const DataSchema = new mongoose.Schema({
  _id: {
    type: ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  Usertype: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  Fullname: {
    type: String,
    required: true,
  },
  Phonenumber: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Gender: {
    type: String,
    required: true,
  },
  freelancerprofile: {
    profilepic: { type: String, default: null },
    title: { type: String, default: null },
    skills: { type: [String], default: [] },
    cv: { type: String, default: null },
    additionaldoc: {
      educations: { type: [String], default: [] },
      certifications: { type: [String], default: [] },
    },
    gudayhistory: { type: [String], default: [] },
    workhistory: { type: [String], default: [] },
    rating: { type: String, default: null },
    description: { type: String, default: null },
    portfolio: {
      link: { type: String, default: null },
      title: { type: String, default: null },
    },
    employerprofile: {
      profilepic: { type: String, default: null },
    },
  },
});


const User = mongoose.model("users", DataSchema);

module.exports.User = User;



