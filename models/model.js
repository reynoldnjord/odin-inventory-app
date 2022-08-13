var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const modelSchema = new Schema({
	name: { type: String, required: true, minLength: 3, maxLength: 50 },
	scale: { type: String, required: true, minLength: 3, maxLength: 10 },
	price: { type: Number, required: true },
	status: {
		type: String,
		required: true,
		enum: ["Available", "Sold"],
		default: "Available",
	},
	category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
});

modelSchema.virtual("url").get(function () {
	return "/catalog/model/" + this._id;
});

module.exports = mongoose.model("Model", modelSchema);
