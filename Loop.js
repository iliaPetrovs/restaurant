const { Restaurant } = require("./Restaurant");
const { Menu } = require("./Menu");
const { MenuItem } = require("./MenuItem");
const { sequelize, DataTypes, Model } = require("./sequelize_index");

const fs = require("fs");

async function loop() {
	fs.readFile("./restaurants.json", async (err, data) => {
		if (err) return console.error(err);
		const restaurants = JSON.parse(data);
		await sequelize.sync({ force: true }); // recreate db
		let menuCounter = 1;
		for (let i = 0; i < restaurants.length; i++) {
			const restaurant = restaurants[i];
			await Restaurant.create({
				name: restaurant.name,
				image: restaurant.image,
			});
			for (let j = 0; j < restaurant.menus.length; j++) {
				const menu = restaurant.menus[j];
				await Menu.create({
					title: menu.title,
					restaurant_id: i + 1,
				});
				for (let k = 0; k < menu.items.length; k++) {
					const menuItem = menu.items[k];
					await MenuItem.create({
						name: menuItem.name,
						price: menuItem.price,
						menu_id: menuCounter,
					});
				}
				menuCounter++;
			}
		}
	});
}

loop();

module.exports = loop;
