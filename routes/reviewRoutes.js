const express = require("express");
// for reviews to get the "/campgrounds/:id/"
const router = express.Router({mergeParams: true}); 
const Review = require("../models/review")
const Campground = require("../models/campground");
const reviewController = require("../controller/reviewController");
const User = require("../models/user")
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");


router.post("/", isLoggedIn, validateReview, catchAsync(reviewController.createNewReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview));

module.exports =router;