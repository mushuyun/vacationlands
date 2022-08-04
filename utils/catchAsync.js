module.exports = func =>{
    return (req, res, next) =>{
        func(req, res, next).catch(next);
    }
}

// This is used to catch mongoose error.