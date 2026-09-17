const express=require("express");
const { protect }=require("../middleware/authMiddleware");

const {
  getDashboardData,
  downloadFullFinancialReport,
} = require("../controllers/dashboardController");

const router=express.Router();
router.get("/",protect, getDashboardData);
router.get("/downloadexcel", protect, downloadFullFinancialReport);

module.exports=router;
