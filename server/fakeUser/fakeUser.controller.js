const User = require("../fakeUser/fakeUser.model");

exports.fakeUser = async (req, res) => {
  try {
    if (!req.body.username || !req.body.uniqueId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid details!" });

    const existingUser = await User.findOne({ uniqueId: req.body.uniqueId });
    if (existingUser) {
      return res.status(200).json({
        status: true,
        message: "User already exists and login Successfully!",
        user: existingUser,
      });
    } else {
      const user = new User();

      user.username = req.body.username;
      user.uniqueId = req.body.uniqueId;

      await user.save();

      return res.status(200).json({
        status: true,
        message: "New User created Successfully!",
        user: user,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Sever Error!!",
    });
  }
};

exports.get = async (req, res) => {
  try {
    const user = await User.find();

    return res.status(200).json({
      status: true,
      message: "finally, get the all users Successfully!",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server error!!",
    });
  }
};

