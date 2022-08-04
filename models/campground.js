// const { object } = require("joi");
const mongoose = require("mongoose");
const Review = require("./review");

const Schema = mongoose.Schema;

// use Mongoose Virtuals method to create virtual thumail image property

const imageSchema = new Schema({
    url: String,
    filename: String
});

imageSchema.virtual("thumbnail").get(function(){
    return this.url.replace("/upload", "/upload/w_100,h_100,c_thumb");
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema ({
    title: String,
    images: [imageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, opts);

CampgroundSchema.virtual("properties.popUpMarkUp").get(function(){
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>
    `
})

CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});
// const Campground = mongoose.model('Campground', CampgroundSchema);
// module.exports = Campground;
module.exports = mongoose.model('Campground', CampgroundSchema);