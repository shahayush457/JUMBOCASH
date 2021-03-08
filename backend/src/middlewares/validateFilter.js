module.exports.validate = (req, res, next) => {
  if (
    req.query.orderBy &&
    (req.query.orderBy !== "1" || req.query.orderBy !== "-1")
  )
    return true;
};
