const { spawn } = require('child_process');
const fs = require('fs');
const productsModel = require('../models/products.model')
const cartModel = require('../models/cart.model')
const favModel = require('../models/fav.model')


// Function to map class IDs to face shape labels
function mapClassIdToFaceShape(classId) {
  switch (classId) {
    case "0":
      return "Heart";
    case "1":
      return "Oblong";
    case "2":
      return "Oval";
    case "3":
      return "Round";
    case "4":
      return "Square";
    default:
      return "Unknown";
  }
}

exports.getvirtualTryOn = (req, res, next) => {
  res.render('virtualTryOn.ejs', {
    isUser: req.session.userId,
    isAdmin: req.session.isAdmin
  })
};

exports.getrundetection = (req, res, next) => {
  productsModel.getAllProducts()
    .then(products => {
      cartModel.getItemsByUser(req.session.userId)
        .then(cartItems => {
          favModel.getItemsByUser(req.session.userId)
            .then(favItems => {
              const cartProductIds = cartItems.map(item => item.productId);
              const favProductIds = favItems.map(item => item.productId);
              products.forEach(product => {
                product.isFavorite = favProductIds.includes(product._id);
              });
              res.render('bestStyle.ejs', {
                products: products,
                isUser: req.session.userId,
                isAdmin: req.session.isAdmin,
                classId: null,                                          // No classId initially
                itemsInCart: cartProductIds,
                itemsInFav: favProductIds
              });
            })
            .catch(err => {
              console.log(err);
              res.redirect("/error");
            });
        })
        .catch(err => {
          console.log(err);
          res.redirect("/error");
        });
    })
    .catch(err => {
      console.error('Error fetching products:', err);
      res.render('bestStyle.ejs', {
        products: products,                                                                          // Pass empty array in case of error
        isUser: req.session.userId,
        isAdmin: req.session.isAdmin,
        classId: "Unknown",                                                        // No classId in case of error
        itemsInCart: cartProductIds,                                                                          // Pass empty array for cart items in case of error
        itemsInFav: favProductIds                                                      // Pass empty array for favorite items in case of error
      });
    });
};



exports.postrundetection = (req, res, next) => {
  const pythonProcess = spawn('python', ['testmodel.py']);
  // Handle success or failure
  pythonProcess.on('close', (code) => {
    if (code === 0) {
      console.log('Python script executed successfully');
      // Read prediction value from file
      fs.readFile('E:\\IGlassLast\\runs\\detect\\predict\\labels\\photo.txt', 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading prediction file:', err);
          console.log("error here in postrundetection in virtualTryOn controller - the model can not predict the image "); // the model can not predict the image
          return res.redirect('/errormodel'); // the site will redirect to error page of model        <<<<<<<<<<<<<< ************   >>>>>>>>>>>>
        }

        const lines = data.split('\n');
        const classId = lines[0].split(' ')[0]; // Extracting the first value from the first line
        const faceShape = mapClassIdToFaceShape(classId); // Map classId to face shape label
        // Storing the prediction value in the user session
        req.session.classId = faceShape;
        // Rendering the index page after storing the prediction value
        console.log('Prediction value:', faceShape);
        // Load products here if needed
        productsModel.getAllProducts()
          .then(products => {
            cartModel.getItemsByUser(req.session.userId)
              .then(cartItems => {
                favModel.getItemsByUser(req.session.userId)
                  .then(favItems => {
                    const cartProductIds = cartItems.map(item => item.productId);
                    const favProductIds = favItems.map(item => item.productId);
                  
                    res.render('bestStyle.ejs', {
                      products: products,
                      isUser: req.session.userId,
                      isAdmin: req.session.isAdmin,
                      classId: faceShape,
                      itemsInCart: cartProductIds,
                      itemsInFav: favProductIds
                    });
                  })
                  .catch(err => {
                    console.log(err);
                    res.redirect("/error");
                  });
              })
              .catch(err => {
                console.log(err);
                res.redirect("/error");
              });
          })
          .catch(err => {
            console.error('Error fetching products:', err);
            res.render('errormodel.ejs', {
              products: [],
              isUser: req.session.userId,
              isAdmin: req.session.isAdmin,
              classId: faceShape, // Pass classId to the view even in case of error
              itemsInCart: [],
              itemsInFav: []
            });
          });
      });
    } else {
      console.error('Error executing Python script - tap close here');
      res.render('errormodel.ejs', {
        isUser: req.session.userId,
        isAdmin: req.session.isAdmin
      });
    }
  });
};