const { sequelize, DataTypes, Model } = require("./sequelize_index");
const { Menu } = require("./Menu");
const { Review } = require("./Review");

/**
 * Represents a Restaurant
 */
class Restaurant extends Model {
	// add methods here
	async getAverage() {
		const reviews = await this.getReviews();
		let sum = 0;
		for (let i = 0; i < reviews.length; i++) {
			const review = reviews[i];
			sum += review.stars;
		}
		return Math.ceil(sum / reviews.length);
	}

	async printStars() {
		let counter = 5;
		let stars = await this.getAverage();
		let result = "";
		while (counter > 0) {
			stars > 0 ? (result += "★") : (result += "☆");
			stars--;
			counter--;
		}
		return result;
	}
}
Restaurant.init(
	{
		name: DataTypes.STRING,
		image: DataTypes.STRING,
	},
	{
		sequelize,
		timestamps: false,
	}
);

Restaurant.hasMany(Menu, { as: "menus", foreignKey: "restaurant_id" });
Menu.belongsTo(Restaurant, { foreignKey: "restaurant_id" });

Restaurant.hasMany(Review, { as: "reviews", foreignKey: "restaurant_id" });
Review.belongsTo(Restaurant, { foreignKey: "restaurant_id" });

module.exports = {
	Restaurant,
};

// local testing - remove when using Jest
// (async () => {
// 	await sequelize.sync({ force: true }); // recreate db
// 	const r = await Restaurant.create({
// 		name: "Ronalds",
// 		image: "http://some.image.url",
// 	});

// 	console.log("Inserted restaurant name is:" + r.name);
// })();
