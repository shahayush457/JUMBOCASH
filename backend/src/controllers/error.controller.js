module.exports.error = (err, req, res, next) => {
    return res.status(err.status || 500).json({
      success: false,
      errors: err.message instanceof Array ? err.message : [err.message] || ['Something went wrong.'],
    });
};