const authen = (req, res, next) => {
    //verify
    const verify = true;
    if (!verify) {
        res.status(401).send('Failed to authenticate token.');
    } else {
        next();
    }
};
module.exports = {
    authen,
};
