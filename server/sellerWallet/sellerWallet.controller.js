const SellerWallet = require("./sellerWallet.model");

//import model
const Seller = require("../seller/seller.model");
const Order = require("../order/order.model");

//get sellerPendingAmount list for seller
exports.sellerPendingAmount = async (req, res) => {
  try {
    if (!req.query.sellerId) {
      return res.status(200).json({ status: false, message: "sellerId must be requried." });
    }

    const seller = await Seller.findById(req.query.sellerId);
    if (!seller) {
      return res.status(200).json({ status: false, message: "Seller does not found!" });
    }

    const sellerWallet = await SellerWallet.aggregate([
      {
        $match: {
          sellerId: seller._id,
          type: 1,
          status: "Pending",
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "_id",
          as: "order",
        },
      },
      {
        $unwind: {
          path: "$order",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          uniqueOrderId: "$order.orderId",
          orderId: 1,
          productId: 1,
          sellerId: 1,
          amount: 1,
          type: 1,
          status: 1,
          date: 1,
          paymentGateway: 1,
        },
      },
    ]);

    const walletWithProducts = await SellerWallet.populate(sellerWallet, {
      path: "productId",
      select: "productName mainImage _id",
    });

    return res.status(200).json({
      status: true,
      message: "get pending payment list for the seller.",
      sellerPendingAmount: walletWithProducts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error",
    });
  }
};

//get sellerPendingWithdrawableAmount list for seller
exports.sellerPendingWithdrawableAmount = async (req, res, next) => {
  try {
    if (!req.query.sellerId) {
      return res.status(200).json({ status: false, message: "sellerId must be requried." });
    }

    const seller = await Seller.findById(req.query.sellerId);
    if (!seller) {
      return res.status(200).json({ status: false, message: "Seller does not found!!" });
    }

    const sellerWallet = await SellerWallet.aggregate([
      {
        $match: {
          sellerId: seller._id,
          type: 2,
          status: "Pending",
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "_id",
          as: "order",
        },
      },
      {
        $unwind: {
          path: "$order",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          uniqueOrderId: "$order.orderId",
          orderId: 1,
          productId: 1,
          sellerId: 1,
          amount: 1,
          type: 1,
          status: 1,
          date: 1,
          paymentGateway: 1,
        },
      },
    ]);

    const walletWithProducts = await SellerWallet.populate(sellerWallet, {
      path: "productId",
      select: "productName mainImage _id",
    });

    return res.status(200).json({
      status: true,
      message: "get sellerPendingWithdrawableAmount list for the seller.",
      sellerPendingWithdrawableAmount: walletWithProducts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};

//get sellerPendingWithdrawalRequestedAmount list for seller
exports.sellerPendingWithdrawalRequestedAmount = async (req, res, next) => {
  try {
    if (!req.query.sellerId) {
      return res.status(200).json({ status: false, message: "sellerId must be requried." });
    }

    const seller = await Seller.findById(req.query.sellerId);
    if (!seller) {
      return res.status(200).json({ status: false, message: "Seller does not found!!" });
    }

    const sellerWallet = await SellerWallet.aggregate([
      {
        $match: {
          sellerId: seller._id,
          type: 3,
          status: "Pending",
        },
      },
      {
        $project: {
          orderId: 1,
          productId: 1,
          sellerId: 1,
          amount: 1,
          type: 1,
          status: 1,
          date: 1,
          paymentGateway: 1,
        },
      },
    ]);

    return res.status(200).json({
      status: true,
      message: "finally, get sellerPendingWithdrawalRequestedAmount list for the seller.",
      sellerPendingWithdrawalRequestedAmount: sellerWallet,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};

//get sellerEarningAmount list for seller
exports.sellerEarningAmount = async (req, res, next) => {
  try {
    if (!req.query.sellerId) {
      return res.status(200).json({ status: false, message: "sellerId must be requried." });
    }

    const seller = await Seller.findById(req.query.sellerId);
    if (!seller) {
      return res.status(200).json({ status: false, message: "Seller does not found!" });
    }

    const sellerWallet = await SellerWallet.aggregate([
      {
        $match: {
          sellerId: seller._id,
          type: 3,
          status: "Done",
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "_id",
          as: "order",
        },
      },
      {
        $unwind: {
          path: "$order",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          uniqueOrderId: "$order.orderId",
          orderId: 1,
          productId: 1,
          sellerId: 1,
          amount: 1,
          type: 1,
          status: 1,
          date: 1,
          paymentGateway: 1,
        },
      },
    ]);

    const walletWithProducts = await SellerWallet.populate(sellerWallet, {
      path: "productId",
      select: "productName mainImage _id",
    });

    return res.status(200).json({
      status: true,
      message: "get sellerEarningAmount list for the seller.",
      sellerEarningAmount: walletWithProducts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Internal Server Error" });
  }
};

//get seller's pending, pendingWithdrawableAmount, pendingWithdrawbleRequestedAmount, totalCommissionGiven for seller and admin (seller wallet)
exports.getAllAmount = async (req, res) => {
  try {
    if (!req.query.sellerId) {
      return res.status(200).json({ status: false, message: "sellerId must be requried." });
    }

    const seller = await Seller.findById(req.query.sellerId);
    if (!seller) {
      return res.status(200).json({ status: false, message: "Seller does not found!" });
    }

    const pendingAmount = await SellerWallet.aggregate([
      {
        $match: {
          sellerId: seller._id,
          type: 1,
          status: "Pending",
        },
      },
      {
        $group: {
          _id: null,
          pendingAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          pendingAmount: 1,
        },
      },
    ]);

    const pendingWithdrawbleAmount = await SellerWallet.aggregate([
      {
        $match: {
          sellerId: seller._id,
          type: 2,
          status: "Pending",
        },
      },
      {
        $group: {
          _id: null,
          pendingWithdrawbleAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          pendingWithdrawbleAmount: 1,
        },
      },
    ]);

    const pendingWithdrawbleRequestedAmount = await SellerWallet.aggregate([
      {
        $match: {
          sellerId: seller._id,
          type: 3,
          status: "Pending",
        },
      },
      {
        $group: {
          _id: null,
          pendingWithdrawbleRequestedAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          pendingWithdrawbleRequestedAmount: 1,
        },
      },
    ]);

    const earningAmount = await SellerWallet.aggregate([
      {
        $match: {
          sellerId: seller._id,
          type: 3,
          status: "Done",
        },
      },
      {
        $group: {
          _id: null,
          earningAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          earningAmount: 1,
        },
      },
    ]);

    const totalCommissionGiven = await SellerWallet.aggregate([
      {
        $match: {
          sellerId: seller._id,
          type: { $in: [1, 2, 3] },
        },
      },
      {
        $group: {
          _id: null,
          totalCommissionGiven: { $sum: "$commissionPerProductQuantity" },
        },
      },
      {
        $project: {
          _id: 0,
          totalCommissionGiven: 1,
        },
      },
    ]);

    return res.status(200).json({
      status: true,
      message:
        "finally, get seller's pendingAmount, pendingWithdrawableAmount, pendingWithdrawbleRequestedAmount, earningAmount and totalCommissionGiven.",
      pendingAmount: pendingAmount.length > 0 ? pendingAmount[0].pendingAmount : 0,
      pendingWithdrawbleAmount: pendingWithdrawbleAmount.length > 0 ? pendingWithdrawbleAmount[0].pendingWithdrawbleAmount : 0,
      pendingWithdrawbleRequestedAmount:
        pendingWithdrawbleRequestedAmount.length > 0 ? pendingWithdrawbleRequestedAmount[0].pendingWithdrawbleRequestedAmount : 0,
      earningAmount: earningAmount.length > 0 ? earningAmount[0].earningAmount : 0,
      totalCommissionGiven: totalCommissionGiven.length > 0 ? totalCommissionGiven[0].totalCommissionGiven : 0,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message || "Internal Server Error" });
  }
};

//get the seller's transaction for admin
exports.sellerTransaction = async (req, res) => {
  try {
    if (!req.query.sellerId || !req.query.startDate || !req.query.endDate)
      return res.status(200).json({
        status: false,
        message: "Oops! Invalid details!",
      });

    const seller = await Seller.findById(req.query.sellerId);
    if (!seller) {
      return res.status(200).json({ status: false, message: "Seller does not found" });
    }

    let dateQuery = {};
    const start_date = new Date(req.query.startDate);
    const end_date = new Date(req.query.endDate);

    if (req.query.startDate !== "ALL" && req.query.endDate !== "ALL") {
      dateQuery = {
        analyticDate: {
          $gte: start_date,
          $lte: end_date,
        },
      };
    }

    const transactions = await SellerWallet.aggregate([
      {
        $addFields: {
          analyticDate: {
            $toDate: {
              $arrayElemAt: [{ $split: ["$date", ","] }, 0],
            },
          },
        },
      },
      {
        $match: {
          ...dateQuery,
          sellerId: seller._id,
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "_id",
          as: "order",
        },
      },
      {
        $unwind: {
          path: "$order",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "order.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $group: {
          _id: "$_id",
          sellerFirstName: { $first: seller.firstName },
          sellerLastName: { $first: seller.lastName },
          userFirstName: { $first: "$user.firstName" },
          userLastName: { $first: "$user.lastName" },
          orderId: { $first: "$order.orderId" },
          date: { $first: "$date" },
          sellerPendingAmount: { $sum: "$amount" },
          adminCommission: { $sum: "$commissionPerProductQuantity" },
        },
      },
      {
        $project: {
          items: 1,
          userFirstName: 1,
          userLastName: 1,
          orderId: 1,
          sellerFirstName: 1,
          sellerLastName: 1,
          sellerPendingAmount: 1,
          adminCommission: 1,
          date: 1,
        },
      },
    ]);

    const data = await SellerWallet.populate(transactions, {
      path: "productId",
      select: "productName mainImage _id",
    });

    if (transactions.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No transactions found for that seller.",
        transactions: [],
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "get all transactions for the seller",
        transactions: data,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};

//get sellerPendingWithdrawalRequestedAmount list for admin
exports.sellerPendingWithdrawalRequestedAmountForAdmin = async (req, res, next) => {
  try {
    const sellerWallet = await SellerWallet.aggregate([
      {
        $match: {
          type: 3,
          status: "Pending",
        },
      },
      {
        $project: {
          orderId: 1,
          productId: 1,
          sellerId: 1,
          amount: 1,
          type: 1,
          status: 1,
          date: 1,
          paymentGateway: 1,
        },
      },
      {
        $group: {
          _id: null,
          totalsellerPendingWithdrawalRequestedAmount: { $sum: "$amount" },
          data: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          totalsellerPendingWithdrawalRequestedAmount: 1,
          sellerPendingWithdrawalRequestedAmount: "$data",
        },
      },
    ]);

    //console.log(sellerWallet);

    await SellerWallet.populate(sellerWallet[0]?.sellerPendingWithdrawalRequestedAmount, {
      path: "sellerId",
      select: "firstName lastName image businessName bankDetails",
    });

    if (sellerWallet.length === 0) {
      return res.status(200).json({
        status: true,
        message: "No sellerPendingWithdrawalRequestedAmount found for admin.",
        sellerPendingWithdrawalRequestedAmount: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "finally, get sellerPendingWithdrawalRequestedAmount list for admin!",
      totalsellerPendingWithdrawalRequestedAmount: sellerWallet[0]?.totalsellerPendingWithdrawalRequestedAmount,
      sellerPendingWithdrawalRequestedAmount: sellerWallet[0]?.sellerPendingWithdrawalRequestedAmount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Internal Server Error" });
  }
};

//seller pending WithdrawalRequestedAmount given by admin to seller for admin
exports.byAdminToSeller = async (req, res, next) => {
  try {
    if (!req.query.sellerWalletId) {
      return res.status(200).json({
        status: false,
        message: "Oops! Invalid details.",
      });
    }

    const sellerWallet = await SellerWallet.findById(req.query.sellerWalletId);
    if (!sellerWallet) {
      return res.status(200).json({
        status: false,
        message: "sellerWallet does not found.",
      });
    }

    if (sellerWallet.type === 3 && sellerWallet.status === "Done") {
      return res.status(200).json({
        status: false,
        message: "Payment already has been paid by admin to seller.",
        sellerWallet: sellerWallet,
      });
    }

    const sellerId = await Seller.findById(sellerWallet.sellerId);
    if (!sellerId)
      return res.status(200).json({
        status: false,
        message: "Seller does not found!",
      });

    const findOrder = await Order.findById(sellerWallet.orderId);
    if (!findOrder)
      return res.status(200).json({
        status: false,
        message: "Order does not found!",
      });

    //sellerWallet updated with type 3 and status "Done"
    const updatedWallet = await SellerWallet.findOneAndUpdate(
      { _id: sellerWallet._id },
      {
        $set: {
          type: 3,
          status: "Done",
        },
      },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "finally, seller's pendingWithdrawalRequestedAmount given by admin to the seller.",
      sellerWallet: updatedWallet,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Internal Server error" });
  }
};

//get admin commission wallet for admin
exports.adminCommissionWallet = async (req, res) => {
  try {
    //Calculate the total commission
    const totalCommission = await SellerWallet.aggregate([
      {
        $group: {
          _id: null,
          totalCommission: { $sum: "$commissionPerProductQuantity" },
        },
      },
    ]);

    //Calculate the total earning with commission
    const totalEarningWithCommission = await SellerWallet.aggregate([
      {
        $project: {
          totalEarningWithCommission: {
            $sum: ["$amount", "$commissionPerProductQuantity"],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalEarningWithCommission: { $sum: "$totalEarningWithCommission" },
        },
      },
    ]);

    //Calculate the total earning without commission
    const totalEarningWithoutCommission = await SellerWallet.aggregate([
      {
        $group: {
          _id: null,
          totalEarningWithoutCommission: { $sum: "$amount" },
        },
      },
    ]);

    //Calculate today's earning with commission
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log("today: ", today);

    const todayCommission = await SellerWallet.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
        },
      },
      {
        $group: {
          _id: null,
          todayCommission: { $sum: "$commissionPerProductQuantity" },
        },
      },
    ]);

    //Calculate monthly earning with commission
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    console.log("startOfMonth: ", startOfMonth);

    const monthlyCommission = await SellerWallet.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          monthlyCommission: { $sum: "$commissionPerProductQuantity" },
        },
      },
    ]);

    //Calculate yearly earning with commission
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    console.log("startOfYear: ", startOfYear);

    const yearlyCommission = await SellerWallet.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear },
        },
      },
      {
        $group: {
          _id: null,
          yearlyCommission: { $sum: "$commissionPerProductQuantity" },
        },
      },
    ]);

    return res.status(200).json({
      status: true,
      message: "finally, get admin wallet for admin!",
      data: {
        totalCommission: totalCommission[0]?.totalCommission || 0,
        totalEarningWithCommission: totalEarningWithCommission[0]?.totalEarningWithCommission || 0,
        totalEarningWithoutCommission: totalEarningWithoutCommission[0]?.totalEarningWithoutCommission || 0,
        todayCommission: todayCommission[0]?.todayCommission || 0,
        monthlyCommission: monthlyCommission[0]?.monthlyCommission || 0,
        yearlyCommission: yearlyCommission[0]?.yearlyCommission || 0,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message || "Internal Server error" });
  }
};

//get date wise chartAnalytic for admin revenue
exports.chartAnalyticOfRevenue = async (req, res) => {
  try {
    if (!req.query.startDate || !req.query.endDate) {
      return res.status(200).json({ status: false, message: "Oops!! Invalid Details!!" });
    }

    let dateFilterQuery = {};

    if (req?.query?.startDate !== "All" && req?.query?.endDate !== "All") {
      const startDate = new Date(req?.query?.startDate);
      const endDate = new Date(req?.query?.endDate);
      endDate.setHours(23, 59, 59, 999);

      dateFilterQuery = {
        analyticDate: {
          $gte: startDate,
          $lte: endDate,
        },
      };
    }
    //console.log("dateFilterQuery:   ", dateFilterQuery);

    const totalCommission = await SellerWallet.aggregate([
      {
        $addFields: {
          analyticDate: { $toDate: "$createdAt" },
        },
      },
      {
        $match: dateFilterQuery,
      },
      {
        $group: {
          _id: "$analyticDate",
          totalCommission: { $sum: "$commissionPerProductQuantity" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const totalEarningWithCommission = await SellerWallet.aggregate([
      {
        $addFields: {
          analyticDate: { $toDate: "$createdAt" },
        },
      },
      {
        $match: dateFilterQuery,
      },
      {
        $group: {
          _id: "$analyticDate",
          totalEarningWithCommission: { $sum: { $sum: ["$amount", "$commissionPerProductQuantity"] } },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const totalEarningWithoutCommission = await SellerWallet.aggregate([
      {
        $addFields: {
          analyticDate: { $toDate: "$createdAt" },
        },
      },
      {
        $match: dateFilterQuery,
      },
      {
        $group: {
          _id: "$analyticDate",
          totalEarningWithoutCommission: { $sum: "$amount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return res
      .status(200)
      .json({ status: true, message: "Success!!", totalCommission, totalEarningWithCommission, totalEarningWithoutCommission });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error!!",
    });
  }
};
