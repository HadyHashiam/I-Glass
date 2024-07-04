const mongoose = require("mongoose");
const cartModel = require("./cart.model");
const productsModel = require("./products.model");
const DB_URL = process.env.MONGODB_URI                         // database url

const orderSchema = mongoose.Schema({
    username: String,
    userId: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    phone: String,
    email: String,
    name: String,
    image: String,
    productId: String,
    amount: Number,
    price: Number,
    timestamp: Number,
    status: {
        type: String,
        default: "pending"
    },
    timestamp: Number
});

const Order = mongoose.model("order", orderSchema);

// function to add new order with steps
// Step 1: chech  if quantity is more than amount
// Step 2: Minus quantity from productsModel
// Step 3: Delete item from cartModel
// Step 4: Connect to the database
// Step 5: Disconnect from the database and resolve
// Step 6: Handle errors, disconnect from the database, and reject


exports.addNewOrder = data => {
    return new Promise((resolve, reject) => {
        let order;
        productsModel
            .checkQuantity(data.productId, data.amount)
            .then(() => {
                return productsModel.minusQuantity(data.productId, data.amount);
            })
            .then(() => {
                return cartModel.deleteItem(data.cartId);
            })
            .then(() => {
                return mongoose.connect(DB_URL);
            })
            .then(() => {
                data.timestamp = Date.now();
                order = new Order(data);
                return order.save();
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



exports.getOrdersByUser = userId => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                return Order.find(
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

exports.cancelOrder = id => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => Order.findByIdAndDelete(id))
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

exports.getAllOrders = () => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                return Order.find({}, {}, { sort: { timestamp: 1 } });
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

exports.editOrder = (id, newStatus) => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                return Order.updateOne({ _id: id }, { status: newStatus });
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
