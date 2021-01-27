const express = require("express");
const Handlebars = require("handlebars");
const expressHandlebars = require("express-handlebars");
const {
	allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const { Restaurant } = require("./Restaurant");
const { Menu } = require("./Menu");
const { loop } = require("./Loop");

const app = express();

const port = 3000;

const handlebars = expressHandlebars({
	handlebars: allowInsecurePrototypeAccess(Handlebars),
});
app.engine("handlebars", handlebars);
app.set("view engine", "handlebars");

app.use(express.static("public"));

app.get("/", async (req, res) => {
	const restaurants = await Restaurant.findAll({
		include: [{ model: Menu, as: "menus" }],
		next: true,
	});
	res.render("home", { restaurants });
});

app.get("/restaurants/:id", async (req, res) => {
	const restaurant = await Restaurant.findAll({
		where: {
			id: req.params.id,
		},
		include: {
			model: Menu,
			as: "menus",
			include: [{ model: MenuItem, as: "items" }],
		},
		next: true,
	});
	console.log(`i am here ${restaurant}`);
	res.render("restaurant", restaurant);
});

// app.get("/about", (req, res) => {
// 	res.render("about", { date: new Date(), author: "Ilia Petrovs" });
// });

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
