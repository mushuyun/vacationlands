const Review = require("../models/review");
const Campground = require("../models/campground");

module.exports.createNewReview = async(req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.writer = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Successfully added a review")
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async(req, res)=>{
    const {id, reviewId} = req.params;
    // findByAnd... will be saved automatically, no need run save() again.
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId); 
    req.flash("success", "Successfully deleted the review")
    // can't use campground._id below, because campground is undefined here
    res.redirect(`/campgrounds/${id}`);
}

