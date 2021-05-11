const express = require("express");
const router = express.Router();
const {
  logIn,
  updatePassword,
  createNewUser,
  uploadUserPicture,
  getAllUsers,
  getUserByEmail,getTitle,createTitle
} = require("../model/usermodel");
router.post("/login/", logIn);
router.post("/create", createNewUser);
router.get("/passwordRecovery/:email", updatePassword);
router.post("/uploadUserPicture", uploadUserPicture);
router.get("/getAllUsers", getAllUsers);
router.get("/getUserByEmail/:email", getUserByEmail);

router.get("/getTitle/", getTitle);
router.post("/createTitle/", createTitle);

module.exports = router;
