const express = require("express");
const Handlebars = require("handlebars");
const expressHandlebars = require("express-handlebars");
const {
	allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const { Restaurant } = require("./Restaurant");
const { Menu } = require("./Menu");
const { MenuItem } = require("./MenuItem");
const { Review } = require("./Review");
const { loop } = require("./Loop");

const app = express();

const port = 3000;

const handlebars = expressHandlebars({
	handlebars: allowInsecurePrototypeAccess(Handlebars),
});
app.engine("handlebars", handlebars);
app.set("view engine", "handlebars");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Get methods

app.get("/", async (req, res) => {
	const restaurants = await Restaurant.findAll({
		include: [{ model: Menu, as: "menus" }],
		nest: true,
	});
	res.render("home", { restaurants });
});

app.get("/restaurants/:id", async (req, res) => {
	const restaurant = await Restaurant.findByPk(req.params.id);
	console.log(`REQ PARAMS IS HERE: ${req.params.id}`);
	const menus = await restaurant.getMenus({
		include: [{ model: MenuItem, as: "items" }],
		nest: true,
	});
	res.render("restaurant", { restaurant, menus });
});

app.get("/about", (req, res) => {
	res.render("about");
});

app.get("/add", (req, res) => {
	res.render("add");
});

app.get("/restaurants/reviews/:id", async (req, res) => {
	// const reviews = await Review.findAll({
	// 	where: {
	// 		restaurant_id: req.params.id,
	// 	},
	// });
	const restaurant = await Restaurant.findByPk(req.params.id);
	// const review = await Review.findByPk(req.params.id);
	const reviews = await restaurant.getReviews();
	console.log(restaurant);
	// console.log(reviews[0].printStars());
	res.render("reviews", { reviews, restaurant });
});

// Post methods

app.post("/restaurants", async (req, res) => {
	const restaurant = await Restaurant.create(req.body);
	console.log(`Created new restaurant ${restaurant}`);
	res.redirect("/add");
});

// Delete methods

app.get("/restaurants/:id/delete", (req, res) => {
	Restaurant.findByPk(req.params.id).then((restaurant) => {
		restaurant.destroy();
		res.redirect("/");
	});
});

// Put methods
app.get("/restaurants/:id/edit", async (req, res) => {
	const restaurant = await Restaurant.findByPk(req.params.id);
	const menus = await restaurant.getMenus({
		include: [{ model: MenuItem, as: "items" }],
		nest: true,
	});
	res.render("edit", { restaurant, menus });
});

app.post("/restaurants/edit/:id", async (req, res) => {
	const restaurant = await Restaurant.findByPk(req.params.id);
	await restaurant.update(req.body);
	const menus = await restaurant.getMenus({
		include: [{ model: MenuItem, as: "items" }],
		nest: true,
	});
	res.redirect(`/restaurants/${restaurant.id}/edit`);
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

// Star rating function

getAverage = (reviews) => {
	let sum = 0;
	for (let i = 0; i < reviews.length; i++) {
		const review = reviews[i];
		sum += review.stars;
	}
	return Math.ceil(sum / reviews.length);
};
