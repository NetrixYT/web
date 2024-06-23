const Favorite = require("./favorite.model");

//import model
const User = require("../user/user.model");
const Product = require("../product/product.model");
const Category = require("../category/category.model");

//create Favorite [Only User can do favorite]  [Add product to favorite list]
exports.store = async (req, res) => {
  try {
    if (!req.body.userId || !req.body.productId || !req.body.categoryId) {
      return res.status(200).json({ status: false, message: "Oops ! Invalid details!!" });
    }

    const [user, category, product, favorite] = await Promise.all([
      User.findById(req.body.userId),
      Category.findById(req.body.categoryId),
      Product.findOne({ _id: req.body.productId, category: req.body.categoryId }),
      Favorite.findOne({
        userId: req.body.userId,
        productId: req.body.productId,
        categoryId: req.body.categoryId,
      })
    ]);

    if (!user) {
      return res.status(200).json({ status: false, message: "User does not found!!" });
    }

    if (!category) {
      return res.status(200).json({ status: false, message: "No category Was found!!" });
    }

    if (!product) {
      return res.status(200).json({ status: false, message: "No product Was found!!" });
    }

    if (favorite) {
      await Favorite.deleteOne({
        userId: user._id,
        productId: product._id,
        categoryId: category._id,
      });

      return res.status(200).json({
        status: true,
        message: "Unfavorite successfully!",
        isFavorite: false,
      });
    } else {
      const favorite_ = new Favorite();

      favorite_.userId = user._id;
      favorite_.productId = product._id;
      favorite_.categoryId = category._id;
      await favorite_.save();

      return res.status(200).json({
        status: true,
        message: "Favorite successfully!",
        isFavorite: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error",
    });
  }
};

//get product's favorite list for user
exports.getFavoriteList = async (req, res) => {
  try {
    if (!req.query.userId) {
      return res.status(200).json({ status: false, message: "Oops ! Invalid details!!" });
    }

    const user = await User.findById(req.query.userId);
    if (!user) {
      return res.status(200).json({ status: false, message: "User does not found!!" });
    }

    const favorite = await Favorite.aggregate([
      {
        $match: {
          userId: { $eq: user._id },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "products",
          let: {
            productId: "$productId", // $productId is field of favorite table
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$$productId", "$_id"], // $_id is field of product table
                },
              },
            },
            {
              $lookup: {
                from: "categories",
                as: "category",
                localField: "category", // localField - category is field of product table
                foreignField: "_id",
              },
            },
            {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              $lookup: {
                from: "subcategories",
                as: "subCategory",
                localField: "subCategory", // localField - category is field of product table
                foreignField: "_id",
              },
            },
            {
              $unwind: {
                path: "$subCategory",
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              $project: {
                productName: 1,
                price: 1,
                size: 1,
                mainImage: 1,
                category: "$category.name",
                subCategory: "$subCategory.name",
              },
            },
          ],
          as: "product",
        },
      },
      {
        $project: {
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
    ]);

    return res.status(200).json({ status: true, message: favorite.length > 0 ? "Success" : "No data found!", favorite: favorite.length > 0 ? favorite : [] });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error",
    });
  }
};
