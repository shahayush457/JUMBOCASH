const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/config");
const db = require("../database/dbQueries");

exports.OAuth = async (req, res, next) => {
  try {
    const { id, name, email } = req.user;
    console.log(req.user);
    // Generate token and send
    const token = jwt.sign({ id, name, email }, jwt_secret);
    res.status(200).json({ id, name, token });
  } catch (error) {
    return next({
      status: 400,
      message: [{ msg: error.message }]
    });
  }
};

exports.deleteOAuthFb = async (req, res, next) => {
  try {
    const { id } = req.decoded;
    let user = await db.findById("user", id, false);
    if (user.method.includes("facebook", 0)) {
      const index = user.method.indexOf("facebook");
      user.method.splice(index, 1);

      // if user registered only via fb, then delete all user data along with its transactions and entities
      if (!user.method.length) {
        await db.deleteAll("transaction", { userId: id });
        await db.deleteAll("entity", { userId: id });
        await db.deleteAll("user", { _id: id });
        console.log(
          "Deleted user data and all transactions and entities successfully"
        );
      } else {
        await db.updateData(user);
        console.log("Deleted user's facebook data successfully");
      }
    }
    res.status(204).json({ msg: "Deleted facebook data successfully" });
  } catch (error) {
    return next({
      status: 400,
      message: [{ msg: error.message }]
    });
  }
};
