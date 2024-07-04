const mongoose = require("mongoose");

const DB_URL = process.env.MONGODB_URI                        // database url

const FavoriteSchema = mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    userId: String,
    productId: String,
    timestamp: Number
});
const FavoriteItem = mongoose.model("favorite", FavoriteSchema);

exports.addNewItem = data => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                let item = new FavoriteItem(data);
                return item.save();
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

exports.getItemsByUser = userId => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                return FavoriteItem.find(
                    { userId: userId },
                    {},
                    { sort: { timestamp: 1 } }
                );
            })
            .then(items => {
                mongoose.disconnect();
                resolve(items);
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
            });
    });
};

exports.editItem = (id, newData) => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => FavoriteItem.updateOne({ _id: id }, newData))
            .then(items => {
                mongoose.disconnect();
                resolve(items);
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
            });
    });
};





// from cart container
exports.deleteItem3 = (userId) => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {

                return FavoriteItem.findOneAndDelete({ userId: userId });
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

exports.deleteItem = (productId, userId) => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                // Use both productId and userId to delete the item
                return FavoriteItem.findOneAndDelete({ productId: productId, userId: userId });
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


exports.deleteItem33 = id => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => FavoriteItem.findByIdAndDelete(id))
            .then(() => {
                mongoose.disconnect();
                resolve();
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
                console.log("err is here22222222222");
            });
    });
};



