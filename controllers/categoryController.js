const Category = require("../models/category");
const Model = require("../models/model");

const async = require("async");

const { body, validationResult } = require("express-validator");
const { sanitize } = require("express-validator/filter");

const debug = require("debug")("category");

exports.category_list = function (req, res, next) {
	Category.find().exec(function (err, list_categories) {
		if (err) {
			return next(err);
		}
		res.render("category_list", {
			title: "All Categories",
			category_list: list_categories,
		});
	});
};

exports.category_detail = function (req, res, next) {
	async.parallel(
		{
			category: function (callback) {
				Category.findById(req.params.id).exec(callback);
			},
			category_models: function (callback) {
				Model.find({ category: req.params.id }).exec(callback);
			},
		},
		function (err, results) {
			if (err) {
				return next(err);
			}
			if (results.category == null) {
				const err = new Error("Category not found");
				err.status = 404;
				return next(err);
			}
			res.render("category_detail", {
				title: "Category detail",
				category: results.category,
				category_models: results.category_models,
			});
		}
	);
};

exports.category_create_get = function (req, res, next) {
	res.render("category_form", { title: "Create Category" });
};

exports.category_create_post = [
	//Validate and sanitize fields.
	body("name")
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage("Category name must have minimum lenght of 3")
		.isAlpha()
		.withMessage("Must contain only letters"),
	body("description")
		.trim()
		.isLength({ min: 10 })
		.escape()
		.withMessage("Please provide a brief description of the category created"),

	//Process the request after sanitization and validation.
	(req, res, next) => {
		const errors = validationResult(req);

		const category = new Category({
			name: req.body.name,
			description: req.body.description,
		});
		if (!errors.isEmpty()) {
			//there are errors, render the form again with remarks considered.

			res.render("category_form", {
				title: "Create Category",
				category: category,
				errors: errors.array(),
			});
			return;
		} else {
			//check if category with same name exists
			Category.findOne({ name: req.body.name }).exec(function (
				err,
				found_category
			) {
				if (err) {
					return next(err);
				}
				if (found_category) {
					res.redirect(found_category.url);
				} else {
					category.save(function (err) {
						if (err) {
							return next(err);
						}
						res.redirect(category.url);
					});
				}
			});
		}
	},
];

exports.category_delete_get = function (req, res, next) {
	async.parallel(
		{
			category: function (callback) {
				Category.findById(req.params.id).exec(callback);
			},
			category_models: function (callback) {
				Model.find({ category: req.params.id }).exec(callback);
			},
		},
		function (err, results) {
			if (err) {
				return next(err);
			}
			if (results.category == null) {
				res.redirect("/catalog/categories");
			}
			res.render("category_delete", {
				title: "Category Delete",
				category: results.category,
				category_models: results.category_models,
			});
		}
	);
};

exports.category_delete_post = [
	body("Category").trim(),
	body("_id").trim(),

	(req, res, next) => {
		async.parallel(
			{
				category: function (callback) {
					Category.findById(req.body.id).exec(callback);
				},
				category_models: function (callback) {
					Model.find({ category: req.body.id }).exec(callback);
				},
			},
			function (err, results) {
				if (err) {
					return next(err);
				}
				if (results.category_models.length > 0) {
					res.render("category_delete", {
						title: "Delete Category",
						category: results.category,
						category_models: results.category_models,
					});
					return;
				} else {
					const trimedCategoryId = req.body.categoryid.trim();
					Category.findByIdAndRemove(
						trimedCategoryId,
						function deleteCategory(err) {
							if (err) {
								return next(err);
							}
							res.redirect("/catalog/categories");
						}
					);
				}
			}
		);
	},
];

exports.category_update_get = function (req, res, next) {
	Category.findById(req.params.id).exec(function (err, category) {
		if (err) {
			debug("update error:" + err);
			return next(err);
		}
		if (category == null) {
			const err = new Error("Category not found");
			err.status = 404;
			return next(err);
		}
		res.render("category_form", {
			title: "Update Category",
			category: category,
		});
	});
};

exports.category_update_post = [
	//Validate and sanitize fields.
	body("name")
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage("Category name must have minimum lenght of 3")
		.isAlpha()
		.withMessage("Must contain only letters"),
	body("description")
		.trim()
		.isLength({ min: 10 })
		.escape()
		.withMessage("Please provide a brief description of the category created"),

	//Process the request after sanitization and validation.
	(req, res, next) => {
		console.log("req.body", req.body);
		console.log("req.params", req.params);

		const errors = validationResult(req);

		const category = new Category({
			name: req.body.name,
			description: req.body.description,
			_id: req.params.id,
		});

		if (!errors.isEmpty()) {
			//there are errors, render the form again with remarks considered.

			res.render("category_form", {
				title: "Update Category",
				category: category,
				errors: errors.array(),
			});
			return;
		} else {
			//check if category with same name exists
			Category.findByIdAndUpdate(
				req.params.id,
				category,
				{},
				function (err, thecategory) {
					if (err) {
						return next(err);
					}
					res.redirect(thecategory.url);
				}
			);
		}
	},
];
