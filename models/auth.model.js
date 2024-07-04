const mongoose = require("mongoose")

const bcrypt = require("bcrypt")
const DB_URL = process.env.MONGODB_URI

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  confirmPassword: {
    type: String,
    minlength: 6,
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

const User = mongoose.model("User", userSchema)

exports.createNewUser = (username, email, password) => {                              // signup function
  // check if user exists
  // yes ===> throw error
  // no ===> create new user
  return new Promise((resolve, reject) => {
    mongoose.connect(DB_URL)
      .then(() => {
        return User.findOne({ email: email })
      })
      .then(user => {
        if (user) {
          mongoose.disconnect()
          reject("User Email already exists")
        }
        else {
          return bcrypt.hash(password, 10)
        }
      }).then(hashedPassword => {
        let user = new User({
          username: username,
          email: email,
          password: hashedPassword,
          isAdmin: false,
          cart: {},
          orders: [],
          _id: new mongoose.Types.ObjectId(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
        return user.save()
      }).then(() => {
        mongoose.disconnect()
        resolve()
      }).catch(err => {
        mongoose.disconnect()
        reject(err)
      }
      )
  })
}

exports.login = (email, password) => {                              // login 
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => User.findOne({ email: email }))
      .then(user => {
        if (!user) {
          mongoose.disconnect();
          reject("there is no user matches this email");
        } else {
          bcrypt.compare(password, user.password)
            .then(same => {
              if (!same) {
                mongoose.disconnect();
                reject("password is incorrect");
              } else {
                mongoose.disconnect();
                resolve({
                  id: user.id,
                  isAdmin: user.isAdmin
                });
              }
            });
        }
      })
      .catch(err => {
        mongoose.disconnect();
        reject(err);
      });
  });
};