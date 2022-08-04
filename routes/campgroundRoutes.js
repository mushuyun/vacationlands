const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync"); 
const {isLoggedIn, isAuthor, validateCampground} = require("../middleware");
const Campground = require("../models/campground");
// const Review = require("../models/review");
// const User = require("../models/user");
const campgroundController = require("../controller/campgroundController");
const multer = require("multer");
const { storage }= require("../cloudinary");
const upload = multer({storage});


router.get("/", catchAsync(campgroundController.index));
router.get("/home", campgroundController.home)

router.get("/new", isLoggedIn, campgroundController.renderNewForm);

// router.post("/", upload.array("campground[image]"), (req, res)=>{
//     console.log(req.body, req.files);
//     res.send("It worked!")
// })

// catchAsync is used to catch Mongoose Error!!!
// upload.array("placeholder = name in the new.ejs", here both are campground[images])!!!!!!!!!
router.post("/", isLoggedIn, upload.array("campground[images]"), validateCampground, catchAsync(campgroundController.addNewCamp));

// Show individual campground details
router.get("/:id", catchAsync(campgroundController.shwoCampground));

//Prepopulate the editing form
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgroundController.renderEditForm))

//Post updated campground back 
router.put("/:id", isLoggedIn, isAuthor, upload.array("campground[images]"), validateCampground, catchAsync(campgroundController.editCampground));


// Delete a campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCampground));

module.exports = router;