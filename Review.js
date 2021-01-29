const { sequelize, Sequelize, DataTypes, Model } = require("./sequelize_index");

/**
 * Represents a review
 */
class Review extends Model {
	// add methods here
	printStars() {
		let counter = 5;
		let stars = this.stars;
		let result = "";
		while (counter > 0) {
			stars > 0 ? (result += "★") : (result += "☆");
			stars--;
			counter--;
		}
		return result;
	}
}

Review.init(
	{
		stars: DataTypes.INTEGER,
		title: DataTypes.STRING,
		body: DataTypes.STRING,
		avatar: DataTypes.STRING,
		username: DataTypes.STRING,
	},
	{
		sequelize,
		timestamps: false,
	}
);

module.exports = { Review };

// local testing - remove when using Jest
// (async () => {
// 	await sequelize.sync({ force: true });
// 	const m = await Review.create({
// 		stars: 2,
// 		title: "Hello",
// 		body: "review.body",
// 		restaurant_id: 5,
// 	});
// 	console.log(`Inserted review wth: ${m.stars} and ${m.title}`);
// })();
