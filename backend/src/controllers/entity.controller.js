const { validationResult } = require("express-validator");
const log = require("../common/logger");
const db = require("../database/dbQueries");

// to get all entites added by current user
exports.userEntities = async (req, res, next) => {
  try {
    const { id: userId } = req.decoded;
    const pipelines = [
      {
        $match: {
          userId: db.getObjectId(userId)
        }
      }
    ];

    const entities = await db.aggregateData("entity", pipelines);

    return res.status(200).json(entities);
  } catch (err) {
    return next({
      status: 400,
      message: [{ msg: err.message }]
    });
  }
};

exports.createEntity = async (req, res, next) => {
  const { id: userId } = req.decoded;

  try {
    // Finds the validation errors in this request and wraps them in an object
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next({
        status: 422,
        message: errors.array()
      });
      return;
    }

    const entity = await db.createData("entity", {
      userId,
      ...req.body
    });

    return res.status(201).json(entity);
  } catch (err) {
    return next({
      status: 400,
      message: [{ msg: err.message }]
    });
  }
};

exports.getEntityById = async (req, res, next) => {
  try {
    // Finds the validation errors in this request and wraps them in an object
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next({
        status: 422,
        message: errors.array()
      });
      return;
    }

    const { id } = req.params;

    const entity = await db.findById("entity", id, true);

    if (!entity) {
      next({
        status: 404,
        message: [{ msg: "Entity not found" }]
      });
      return;
    }

    return res.status(200).json(entity);
  } catch (err) {
    return next({
      status: 400,
      message: [{ msg: err.message }]
    });
  }
};

exports.updateEntity = async (req, res, next) => {
  try {
    // Finds the validation errors in this request and wraps them in an object
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next({
        status: 422,
        message: errors.array()
      });
      return;
    }

    // user id is not allowed to update
    if (req.body.userId) {
      return next({
        status: 405,
        message: [{ msg: "User id is not allowed to update" }]
      });
    }

    const updatedEntity = await db.findByIdAndUpdate(
      "entity",
      req.params.id,
      req.body,
      true,
      true
    );

    if (!updatedEntity) {
      next({
        status: 404,
        message: [{ msg: "Entity not found" }]
      });
      return;
    }

    res.status(200).json(updatedEntity);
  } catch (error) {
    next({
      status: 400,
      message: [{ msg: error.message }]
    });
  }
};

exports.getFilteredEntity = async (req, res, next) => {
  // Retrieve user id from the decoded JWT
  const { id: userId } = req.decoded;
  try {
    // Finds the validation errors in this request and wraps them in an object
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next({
        status: 422,
        message: errors.array()
      });
      return;
    }

    let filter = {},
      sort = {};

    filter.userId = db.getObjectId(userId);

    // Add filter queries applied by the user
    filter.entityType = {
      $in: req.query.eType
    };

    // Add sorting queries applied by the user
    sort[req.query.sortBy] = req.query.orderBy; // default sortBy = name, orderBy = 1

    // Paging
    const limit = req.query.limit; // default limit = 10
    const skip = req.query.pageNo * limit - limit; // default pageNo = 1

    const pipelines = [
      { $match: filter },
      { $sort: sort },
      {
        $facet: {
          entities: [{ $skip: skip }, { $limit: limit }],
          totalCount: [
            {
              $count: "count"
            }
          ]
        }
      }
    ];

    const entities = await db.aggregateData("entity", pipelines);

    if (!entities[0].totalCount[0]) entities[0].totalCount.push({ count: 0 });

    log.info(entities);

    res.status(200).json(entities[0]);
  } catch (error) {
    next({
      status: 400,
      message: [{ msg: error.message }]
    });
  }
};
