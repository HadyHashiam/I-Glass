const router = require("express").Router()              // router level
const multer = require("multer")
const adminGuard = require("./guards/admin.guard");
const admincontroller = require("../controllers/admin.controller")
const check = require("express-validator").check;

router.get("/addproduct",adminGuard , admincontroller.getAddProduct )

router.post(
    "/addproduct",
    adminGuard,
    multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, "images/");
            },
            filename: (req, file, cb) => {
                cb(null, Date.now() + "-" + file.originalname);
            }
        })
    }).single("image"),
    check("name")
        .not()
        .isEmpty()
        .withMessage("name is required"),
    check("price")
        .not()
        .isEmpty()
        .withMessage("price is required")
        .isFloat({ min: 0.0000000009 })
        .withMessage("price must be greater than 0"),
    check("description")
        .not()
        .isEmpty()
        .withMessage("description is required"),
    check("category")
        .not()
        .isEmpty()
        .withMessage("category is required"),
    check("image").custom((value, { req }) => {
        if (req.file) return true;
        else throw "image is required";
    }),
    admincontroller.postAdd
);


module.exports = router
