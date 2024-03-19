const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkEmptyValidation = (req, res, next) => {
    if(req.body.required.length > 0) {
        const requiredFields = req.body.required;
        const reqValue = req.body;
        let sample = false;
        let requiredfield = ""
        requiredFields.map((field, index) => {
            if (reqValue[field] == "") {
                sample = true;
                requiredfield = field;
                return;
            } 
            return;
        });
        if(sample == true) {
            res.status(500).send({ message: requiredfield + ' is required.' });
            return;
        }
        next();
    }
    
};

const checkEmptyValue = {
    checkEmptyValidation,
};

module.exports = checkEmptyValue;
