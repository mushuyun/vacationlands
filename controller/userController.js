const User = require("../models/user");

module.exports.renderRegisterForm = (req, res)=>{
    res.render("users/register");
};

module.exports.registerUser = async(req, res)=>{
    try{
        const {username, email, password} = req.body;
        const user = new User({ username, email});
        // passport-local-mongoose is handling hashing password and save all the info for the user
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        // let passport login the user right after register
        req.login(registeredUser, err=>{
            if(err) return next(err);
            req.flash("success", "Welcome to the camp");
            res.redirect("/campgrounds");
        })
    
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/register");
    }
};

module.exports.renderLoginForm = (req, res)=>{
    res.render("users/login");
};

module.exports.userLogin = (req, res)=>{   
    req.flash("success", "Welcome back!");
    console.log("*********req.session.returnTo...**********", req.session.returnTo);
    const redirectUrl  = req.session.returnTo || "/campgrounds"
    res.redirect (redirectUrl);
};

module.exports.userLogout = (req, res) =>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success", "Goodbye!");
        res.redirect('/campgrounds');
    });
}