const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

mongoose.set("strictQuery", true);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = mongoose.Schema({
	title: String,
	content: String
})

const Article = mongoose.model("Article", articleSchema);

////////////////////request targetting all articles/////////////////

app.route("/article")

	.get(function (req, res) {
		Article.find({}, function (err, foundArticles) {
			if (!err) {
				res.send(foundArticles)
			} else {
				res.send(err)
			}
		});
	})

	.post(function (req, res) {
		const title = req.body.title;
		const content = req.body.content;

		const newArticle = new Article({
			title: title,
			content: content
		})
		newArticle.save(function (err) {
			if (!err) {
				res.send("New article added")
			} else {
				res.send(err)
			}
		})
	})

	.delete(function (req, res) {
		Article.deleteMany({}, function (err) {
			if (!err) {
				res.send("all data deleted succesfully")
			} else {
				res.send(err);
			}
		})
	});

////////////////request targetting a specific article////////////////

app.route("/article/:anyArticle")

	.get(function (req, res) {
		const requestArticle = req.params.anyArticle;
		Article.findOne({ title: requestArticle }, function (err, foundArticle) {
			if (foundArticle) {
				res.send(foundArticle)
			} else {
				res.send("cannot find article in search")
			}
		})
	})

	.put(function (req, res) {
		Article.updateOne({ title: req.params.anyArticle },
			{ title: req.body.title, content: req.body.content },
			{ overwrite: true },
			function (err) {
				if (!err) {
					res.send("successfully update article")
				} else {
					res.send(err)
				}
			})
	})

	.patch(function (req, res) {
		Article.updateOne({ title: req.params.anyArticle },
			{ $set: req.body },
			function (err) {
				if (!err) {
					res.send("updated article")
				} else {
					res.send(err)
				}
			})
	})

	.delete(function (req, res) {
		Article.deleteOne({ title: req.params.anyArticle },
			function (err) {
				if (!err) {
					res.send("successfully deleted article")
				} else {
					res.send(err);
				}
			})
	});

app.listen(3000, function () {
	console.log("serving on port 3000")
});