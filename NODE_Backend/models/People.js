const mongoose = require("mongoose");

const peopleSchema = mongoose.Schema(
  {
    serial: {
      type: String,
      required: true,
      trim: true,
    },
    engname: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: false,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    fathersname: {
      type: String,
      required: true,
      trim: true,
    },
    mothersname: {
      type: String,
      required: true,
      trim: true,
    },
    dateofbirth: {
      type: String,
      required: true,
      trim: true,
    },
    occupation: {
      type: String,
      required: true,
      trim: true,
    },
    education: {
      type: String,
      required: true,
      trim: true,
    },
    nid: {
      type: String,
      required: true,
      trim: true,
    },
    currentaddress: {
      type: String,
      required: true,
      trim: true,
    },
    permaaddress: {
      type: String,
      required: true,
      trim: true,
    },
    nominee: {
      type: String,
    },
    position: {
      type: String,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    status: {
      type: String,
      required: true,
      enum: ["Active", "Closed", "Transferred", "Late"],
      trim: true,
    },
    comments: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const People = mongoose.model("People", peopleSchema);

module.exports = People;
