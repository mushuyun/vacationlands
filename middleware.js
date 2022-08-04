const Campground = require("./models/campground");
const Review = require("./models/review");
const User = require('./models/user');
const ExpressEroor = require("./utils/expressError");
const {campgroundSchema, reviewSchema} = require("./schemas.js");

module.exports.validateCampground = async(req, res, next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(err => err.message).join(",")
        throw new ExpressEroor(msg, 400);
    }else{
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) =>{
    // passport has req.user property when logged in
    // console.log("req.user...", req.user)
    if(!req.isAuthenticated()){
        // console.log(req.path, req.originalUrl); passport has these proterties.
        req.flash("error", "You must be signned in first!");
        return res.redirect("/login");
    }
    next();
}

module.exports.isAuthor = async(req, res, next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash("error", "You don't have pession to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body); 
    if (error){
        const msg = error.details.map(el => el.message).join(",");
        // if(!req.body.campground) throw new ExpressError('Invalid data!', 400)
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}

module.exports.isReviewAuthor = async(req, res, next)=>{
    const {id, reviewId} = req.params;
    // findByAnd... will be saved automatically, no need run save() again.
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    const review = await Review.findById(reviewId);
    if(!review.writer.equals(req.user._id)){
        req.flash("error", "You don't have perssion to do that!");
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
    