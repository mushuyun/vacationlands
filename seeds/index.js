const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/camp' || process.env.MONGO_URI, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// //!!!!!!! if only one line funtion, DO NOT use {}, OR IT WILL NOT WORK!!!!!!s
const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //YOUR USER ID
            author: "62ec48eb126fcb4d1d240e72",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                    {
                        url: 'https://res.cloudinary.com/doypmcxtx/image/upload/v1658964674/campground/lsweovrp6dh83s0xcnvp.jpg',
                        filename: 'campground/lsweovrp6dh83s0xcnvp'
                    },
                    {
                        url: 'https://res.cloudinary.com/doypmcxtx/image/upload/v1658977491/campground/iebkmfzrqzcvb3mql7rt.jpg',
                        filename: 'campground/iebkmfzrqzcvb3mql7rt'
                    }
                        
                    ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
