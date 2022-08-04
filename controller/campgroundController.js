const Campground = require("../models/campground"); 
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

module.exports.home = (req, res) =>{
    res.render('campgrounds/home');
}

module.exports.index = async(req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index' , {campgrounds});
}

module.exports.renderNewForm = (req, res)=>{
    res.render("campgrounds/new");
}

module.exports.addNewCamp = async(req, res)=>{
   const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
      })
      .send()
      .then(res => {
        return res.body;
      });
        
    // console.log(geoData);
    
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.features[0].geometry;
    
    // console.log(req.files);
    campground.images = req.files.map(f =>({url: f.path, filename: f.filename}));
    // define author
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully made a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
 }

module.exports.shwoCampground = async(req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('reviews').populate({
        path: "reviews",
        populate: {
            path: "writer"
        }
    }).populate("author");

    console.log(campground);
    if(!campground){
        req.flash("error", "The campground does not exist");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", {campground});
}

module.exports.renderEditForm = async(req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash("error", "Sorry, can not find that campground");
        res.redirect("/campgrounds")
    }
    res.render('campgrounds/edit', {campground});
}

module.exports.editCampground = async(req, res)=>{
    const {id} = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate({_id: id}, {...req.body.campground}, {new: true});
    images = req.files.map(f => ({url: f.path, filename: f.filename}));
    // Adding more images
    // can't push one array into another array. Use spreader to push array objects into another array.
    campground.images.push(...images);
    await campground.save();
    // Delete images using samll case campground(the chosen one campground)
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async(req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "successfully deleted the campground")
    res.redirect('/campgrounds');
}