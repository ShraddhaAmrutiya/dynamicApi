const express = require("express");
const {
  createModule,
  listModules,
  getModule,
  updateModule,
  deleteModule,
} = require("../controllers/moduleController.js");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/permissionMiddleware.js");
const router = express.Router();
router.use(authMiddleware);

router.post("/", authorize("module_add"), createModule);

router.get("/", authorize("module_get"), listModules);
router.get("/:id", authorize("module_get"), getModule);

router.put("/:id", authorize("module_edit"), updateModule);

router.delete("/:id", authorize("module_delete"), deleteModule);

module.exports = router;
