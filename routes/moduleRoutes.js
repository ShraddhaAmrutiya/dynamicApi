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

//create module
router.post("/", authorize("module_add"), createModule);

//list module
router.get("/", authorize("module_get"), listModules);
//get module by id
router.get("/:id", authorize("module_get"), getModule);

//update module by id
router.put("/:id", authorize("module_edit"), updateModule);

//delete module
router.delete("/:id", authorize("module_delete"), deleteModule);

module.exports = router;
