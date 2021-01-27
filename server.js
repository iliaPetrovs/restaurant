const express = require("express");
const Handlebars = require("handlebars");
const expressHandlebars = require("express-handlebars");
const {
	allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const { Restaurant } = require("./Restaurant");
const { Menu } = require("./Menu");
const { MenuItem } = require("./MenuItem");
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
		nest: true,
	});
	res.render("home", { restaurants });
});

// app.get("/restaurants/:id", async (req, res) => {
// 	const restaurant = await Restaurant.findAll({
// 		where: { id: req.params.id },
// 		include: {
// 			model: Menu,
// 			as: "menus",
// 			include: [{ model: MenuItem, as: "items" }],
// 		},
// 		nest: true,
// 	});
// 	console.log(`i am here ${restaurant.menu.length} and also ${req.params.id}`);
// 	res.render("restaurant", restaurant);
// });

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

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
