const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('Connection error:', err);
  });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const getStaticRandomImage = (seed) => {
    return `https://picsum.photos/seed/${seed}/200`;
};

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        
        // Generate a title and use it as a seed for the image
        const title = `${sample(descriptors)} ${sample(places)}`;
        const imageSeed = title.split(' ').join('-'); // Create a seed based on the title
        
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title,
            image: getStaticRandomImage(imageSeed), // Use the static random image URL with seed
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
