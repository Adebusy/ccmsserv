const express = require("express");
const router = express.Router();
const {
  createComplainCategory,
  createSubComplainCategory,
  logNewComplaint,
  listComplainCategory,
  listComplainSubCategory,
  getComplainsByEmail,
  getAllComplains,
} = require("../model/complaintsmodel");

router.post("/createComplainCategory/", createComplainCategory);
router.post("/createSubComplainCategory/", createSubComplainCategory);
router.post("/logComplaint/", logNewComplaint);
router.get("/getComplainsByEmail/:email", getComplainsByEmail);
router.get("/getAllComplains/", getAllComplains);
router.get("/listComplainCategory/", listComplainCategory);
router.get("/listComplainSubCategory/", listComplainSubCategory);

module.exports = router;
