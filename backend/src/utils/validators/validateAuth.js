const { body } = require("express-validator");

exports.validate = method => {
  switch (method) {
    case "register": {
      return [
        body("name", "Name field is required").exists(),
        body("email", "A valid email is required")
          .exists()
          .isEmail(),
        body("password", "Password of length atleast 5 is required")
          .exists()
          .isLength({ min: 5 })
      ];
    }

    case "login": {
      return [
        body("email", "A valid email is required")
          .exists()
          .isEmail(),
        body("password", "Password is required")
          .exists()
      ];
    }
  }
};
