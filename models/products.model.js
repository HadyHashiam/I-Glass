const mongoose = require("mongoose")                                         // import mongoose
const DB_URL = process.env.MONGODB_URI                      // database url

const productSchema = new mongoose.Schema({              // mode   
    _id: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: String,
    category: {
        type: String,
        required: true
    },
    Quantity: {
        type: Number,
        required: true,
        default: 1
    },
    face_shape: {
        type: String,
        default: "all"
    },
    face_shape_2: String,
    face_shape_3: String
})
const Product = mongoose.model('product', productSchema)


exports.getAllProducts = () => {                                      // to get all products
    // connect    
    //  get products   
    // disconnect 
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).then(() => {                                        // connect
            return Product.find({})                                                     // get products
        }).then(products => {                                                           // pass products
            mongoose.disconnect()                                                        // disconnect
            resolve(products)                                                               // resolve
        }).catch(err => reject(err))                                                     // reject
    })
}


exports.addNewProduct = data => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                let newProduct = new Product(data);
                return newProduct.save();
            })
            .then(products => {
                mongoose.disconnect();
                resolve(products);
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
            });
    });
};
exports.checkDuplicateId = (id) => {
    return Product.exists({ _id: id });

};


// function to minus product item's quantity in product schema  by the value of amount  that user input in cart page when user post order

exports.minusQuantity = (id, amount) => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                return Product.updateOne({ _id: id }, { $inc: { Quantity: -amount } });
            })
            .then(() => {
                mongoose.disconnect();
                resolve();
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
            });
    });
};

// function to check if product quantity is enough to buy the value of amount that user input in cart schema when user in cart.ejs page and save and  console.log("checked");

exports.checkQuantity = (id, amount) => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                return Product.findOne({ _id: id });
            })
            .then(product => {
                if (product.Quantity >= amount) {
                    resolve();
                    console.log("checked");
                } else {
                    reject();
                    console.log("err in check quantity1");
                }
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
                console.log("err in check quantity2");
            });
    });
};

