exports.googleOAuth = async (req, res, next) => {
  // Generate token
  //const token = signToken(req.user);
  res.status(200).json({ token: "" });
};
