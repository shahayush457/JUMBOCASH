const { body, query, param } = require("express-validator");

exports.validate = method => {
  switch (method) {
    case "createEntity": {
      return [
        body("name", "name doesn't exists").exists(),
        body("address", "address doesn't exists").exists(),
        body("contactNo").exists(),
        body("entityType")
          .exists()
          .isIn(["vendor", "customer"])
      ];
    }

    case "getEntityById": {
      return [param("id").isMongoId()];
    }

    case "updateEntity": {
      return [
        param("id").isMongoId(),
        body("entityType", "Type invalid")
          .optional()
          .isIn(["vendor", "customer"])
      ];
    }

    case "getFilteredEntity": {
      return [
        query("orderBy")
          .optional()
          .isIn(["1", "-1"]),
        query("sortBy")
          .optional()
          .isIn(["name", "address", "contactNo", "entityType"]),
        query("eType")
          .optional()
          .isIn(["vendor", "customer"])
      ];
    }
  }
};
