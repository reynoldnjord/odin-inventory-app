const express = require("express");
const router = express.Router();

const model_controller = require("../controllers/modelController");
const category_controller = require("../controllers/categoryController");

/// MODEL ROUTES ///
router.get("/", model_controller.index);

router.get("/model/create", model_controller.model_create_get);
router.post("/model/create", model_controller.model_create_post);

router.get("/model/:id/update", model_controller.model_update_get);
router.post("/model/:id/update", model_controller.model_update_post);

router.get("/model/:id/delete", model_controller.model_delete_get);
router.post("/model/:id/delete", model_controller.model_delete_post);

router.get("/model/:id", model_controller.model_detail);
router.get("/models", model_controller.model_list);

///  CATEGORY ROUTES ///
router.get("/category/create", category_controller.category_create_get);
router.post("/category/create", category_controller.category_create_post);

router.get("/category/:id/update", category_controller.category_update_get);
router.post("/category/:id/update", category_controller.category_update_post);

router.get("/category/:id/delete", category_controller.category_delete_get);
router.post("/category/:id/delete", category_controller.category_delete_post);

router.get("/category/:id", category_controller.category_detail);
router.get("/categories", category_controller.category_list);

module.exports = router;
