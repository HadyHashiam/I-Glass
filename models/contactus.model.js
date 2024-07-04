const mongoose = require("mongoose")                                         // import mongoose
const DB_URL = process.env.MONGODB_URI                      // database url

const contactusschema = new mongoose.Schema({
  fullname: String,
  email: String,
  phone: Number,
  subject: String,
  userId: String,
  message: String
})

const Contactus = mongoose.model("Contactus", contactusschema)


exports.addNewContactus = (data) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        let newContactus = new Contactus(data);
        return newContactus.save();
      })
      .then(contactus => {
        mongoose.disconnect();
        resolve(contactus);
      })
      .catch(err => {
        mongoose.disconnect();
        reject(err);
      });
  });
};
