const { body, query, param } = require("express-validator");

exports.validate = method => {
  switch (method) {
    case "createTransactions": {
      return [
        body("entityId", "entity doesn't exists")
          .exists()
          .isMongoId(),
        body("amount", "amount doesn't exists")
          .exists()
          .isInt(),
        body("transactionType", "type doesn't exists")
          .exists()
          .isIn(["debit", "credit"]),
        body("transactionStatus", "status doesn't exists")
          .exists()
          .isIn(["paid", "pending"]),
        body("transactionMode", "mode doesn't exists")
          .exists()
          .isIn(["cash", "credit-card", "debit-card", "upi"]),
        body("remark", "remark doesn't exists").exists()
      ];
    }

    case "getTransactionsById": {
      return [param("id").isMongoId()];
    }

    case "updateTransaction": {
      return [
        param("id").isMongoId(),
        body("entityId", "entity doesnt exists")
          .optional()
          .isMongoId(),
        body("amount", "amount not integer")
          .optional()
          .isInt(),
        body("transactionType")
          .optional()
          .isIn(["debit", "credit"]),
        body("transactionStatus")
          .optional()
          .isIn(["paid", "pending"]),
        body("transactionMode")
          .optional()
          .isIn(["cash", "credit-card", "debit-card", "upi"])
      ];
    }

    case "getFilteredTransactions": {
      return [
        query("entityId", "entity doesnt exists")
          .optional()
          .isMongoId(),
        query("orderBy")
          .optional()
          .isIn(["1", "-1"]),
        query("sortBy")
          .optional()
          .isIn([
            "createdAt",
            "amount",
            "transactionType",
            "transactionMode",
            "transactionStatus",
            "remark"
          ]),
        query("tType")
          .optional()
          .isIn(["debit", "credit"]),
        query("tMode")
          .optional()
          .isIn(["debit-card", "credit-card", "cash", "upi"]),
        query("tStatus")
          .optional()
          .isIn(["pending", "paid"]),
        query("eType")
          .optional()
          .isIn(["vendor", "customer"]),
        query("sAmount")
          .optional()
          .isInt(),
        query("eAmount")
          .optional()
          .isInt()
      ];
    }
  }
};
