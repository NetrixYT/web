const Follower = require("./follower.model");

//import model
const User = require("../user/user.model");
const Seller = require("../seller/seller.model");

//config
const config = require("../../config");

//FCM
var FCM = require("fcm-node");
var fcm = new FCM(config.SERVER_KEY);

//follow unfollow the seller
exports.followUnfollow = async (req, res) => {
  try {
    if (!req.body.userId || !req.body.sellerId)
      return res.status(200).json({
        status: false,
        message: "Oops ! Invalid details!",
      });

    const [userId, sellerId, follow] = await Promise.all([
      User.findById(req.body.userId),
      Seller.findById(req.body.sellerId),
      Follower.findOne({
        userId: req.body.userId,
        sellerId: req.body.sellerId,
      }),
    ]);

    if (!userId) {
      return res.status(200).json({ status: false, message: "user does not found!" });
    }

    if (userId.isBlock) {
      return res.status(200).json({ status: false, message: "you are blocked by admin!" });
    }

    if (!sellerId) {
      return res.status(200).json({ status: false, message: "seller does not found!" });
    }

    if (follow) {
      await Follower.deleteOne({
        userId: userId._id,
        sellerId: sellerId._id,
      });

      if (userId.following > 0) {
        userId.following -= 1;
        await userId.save();
      }

      if (sellerId.followers > 0) {
        sellerId.followers -= 1;
        await sellerId.save();
      }

      return res.status(200).send({
        status: true,
        message: "unfollow successfully!",
        isFollow: false,
      });
    } else {
      const followData = {
        userId: userId._id,
        sellerId: sellerId._id,
      };

      const follower = new Follower(followData);

      userId.following += 1;
      await userId.save();

      sellerId.followers += 1;
      await sellerId.save();

      await follower.save();

      //notification related
      if (!sellerId.isBlock) {
        const payload = {
          to: sellerId.fcmToken,
          notification: {
            title: `${userId.firstName} started following you!`,
          },
          data: {
            data: userId._id,
            type: "USER",
          },
        };

        await fcm.send(payload, async (error, response) => {
          if (error) {
            console.log("Something has gone wrong: ", error);
          } else {
            console.log("Successfully sent with response: ", response);
          }
        });
      }

      return res.status(200).send({
        status: true,
        message: "follow Successfully!",
        isFollow: true,
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
