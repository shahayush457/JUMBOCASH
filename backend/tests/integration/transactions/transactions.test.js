const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;
chai.use(chaiHttp);

const mongoose = require("mongoose");
const Entity = require("../../../src/models/entities.model");
const Transaction = require("../../../src/models/transactions.model");

const app = require("../../../src/common/index");

describe("Integration Tests - Transaction routes", () => {
  let token, userId, newEntity, entityId;
  before(done => {
    chai
      .request(app)
      .post("/api/v2/auth/register")
      .send({
        name: "Ayush Shah",
        email: "shahayush457@gmail.com",
        password: "testtest"
      })
      .end(async (err, user) => {
        expect(user.status).to.equal(201);
        expect(user.body).to.have.property("token");
        token = user.body.token;
        userId = user.body.id;
        newEntity = await Entity.create({
          userId,
          name: "Ayush Shah",
          address: "India",
          contactNo: "983883832",
          entityType: "vendor"
        });
        entityId = newEntity._id.toString();
        done();
      });
  });

  describe("GET /api/v2/transactions", () => {
    afterEach("dropping transaction collection", async () => {
      Transaction.collection.drop();
    });

    it("It should return status 200 and an empty array", async () => {
      const res = await chai
        .request(app)
        .get("/api/v2/transactions")
        .set("authorization", "Bearer " + token);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array").that.is.empty;
    });

    it("It should return status 200 and an array of 1 transaction", async () => {
      const transaction = await Transaction.create({
        userId,
        entityId,
        amount: 50,
        transactionType: "debit",
        transactionMode: "credit-card",
        transactionStatus: "paid",
        remark: "5 star"
      });
      const res = await chai
        .request(app)
        .get("/api/v2/transactions")
        .set("authorization", "Bearer " + token);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
      expect(res.body[0].userId).to.be.equal(userId);
      expect(res.body[0].entityId).to.be.equal(entityId);
    });
  });

  describe("POST /api/v2/transactions", () => {
    afterEach("dropping transaction collection", async () => {
      Transaction.collection.drop();
    });

    it("It should successfully add a paid debit transaction to the database", async () => {
      const transaction = {
        entityId,
        amount: 100,
        transactionType: "debit",
        transactionMode: "cash",
        transactionStatus: "paid",
        remark: "Good customer"
      };
      const res = await chai
        .request(app)
        .post("/api/v2/transactions")
        .set("authorization", "Bearer " + token)
        .send(transaction);
      expect(res.status).to.equal(201);
      expect(res.body.userId).to.be.equal(userId);
      expect(res.body.entityId).to.be.equal(entityId);
    });

    it("It should successfully add a paid credit transaction to the database", async () => {
      const transaction = {
        entityId,
        amount: 100,
        transactionType: "credit",
        transactionMode: "cash",
        transactionStatus: "paid",
        remark: "Good customer"
      };
      const res = await chai
        .request(app)
        .post("/api/v2/transactions")
        .set("authorization", "Bearer " + token)
        .send(transaction);
      expect(res.status).to.equal(201);
      expect(res.body.userId).to.be.equal(userId);
      expect(res.body.entityId).to.be.equal(entityId);
    });

    it("It should successfully add a pending debit transaction to the database", async () => {
      const transaction = {
        entityId,
        amount: 100,
        transactionType: "debit",
        transactionMode: "cash",
        transactionStatus: "pending",
        remark: "Good customer"
      };
      const res = await chai
        .request(app)
        .post("/api/v2/transactions")
        .set("authorization", "Bearer " + token)
        .send(transaction);
      expect(res.status).to.equal(201);
      expect(res.body.userId).to.be.equal(userId);
      expect(res.body.entityId).to.be.equal(entityId);
    });

    it("It should successfully add a pending credit transaction to the database", async () => {
      const transaction = {
        entityId,
        amount: 100,
        transactionType: "credit",
        transactionMode: "cash",
        transactionStatus: "pending",
        remark: "Good customer"
      };
      const res = await chai
        .request(app)
        .post("/api/v2/transactions")
        .set("authorization", "Bearer " + token)
        .send(transaction);
      expect(res.status).to.equal(201);
      expect(res.body.userId).to.be.equal(userId);
      expect(res.body.entityId).to.be.equal(entityId);
    });

    it("It should return status 422 - all fields are required", async () => {
      const transaction = {};
      const res = await chai
        .request(app)
        .post("/api/v2/transactions")
        .set("authorization", "Bearer " + token)
        .send(transaction);
      expect(res.status).to.equal(422);
    });

    it("It should return status 422 - entity doesn't exists", async () => {
      const transaction = {
        amount: 100,
        transactionType: "debit",
        transactionMode: "cash",
        transactionStatus: "paid",
        remark: "Good customer"
      };
      const res = await chai
        .request(app)
        .post("/api/v2/transactions")
        .set("authorization", "Bearer " + token)
        .send(transaction);
      expect(res.status).to.equal(422);
    });
  });

  describe("GET /api/v2/transactions/:id", () => {
    afterEach("dropping transaction collection", async () => {
      Transaction.collection.drop();
    });

    it("It should return status 422 - Not a mongo id", async () => {
      const res = await chai
        .request(app)
        .get("/api/v2/transactions/ddd")
        .set("authorization", "Bearer " + token);
      expect(res.status).to.equal(422);
    });

    it("It should return status 200 and transaction object of given transaction id", async () => {
      const transaction = await Transaction.create({
        userId,
        entityId,
        amount: 50,
        transactionType: "debit",
        transactionMode: "credit-card",
        transactionStatus: "paid",
        remark: "5 star"
      });
      const res = await chai
        .request(app)
        .get("/api/v2/transactions/" + transaction.id)
        .set("authorization", "Bearer " + token);
      expect(res.status).to.equal(200);
      expect(res.body.userId).to.be.equal(userId);
      expect(res.body.entityId).to.be.equal(entityId);
      expect(res.body.amount).to.be.equal(transaction.amount);
      expect(res.body.transactionStatus).to.be.equal(
        transaction.transactionStatus
      );
    });
  });

  describe("PATCH /api/v2/transactions/:id", () => {
    afterEach("dropping transaction collection", async () => {
      Transaction.collection.drop();
    });

    it("It should return status 422 - Not a mongo id", async () => {
      const transaction = {
        amount: 50,
        transactionMode: "credit-card"
      };
      const res = await chai
        .request(app)
        .patch("/api/v2/transactions/ddd")
        .set("authorization", "Bearer " + token)
        .send(transaction);
      expect(res.status).to.equal(422);
    });

    it("It should successfully update the transaction status, type and amount for a pending debit transaction", async () => {
      const transaction = await Transaction.create({
        userId,
        entityId,
        amount: 50,
        transactionType: "debit",
        transactionMode: "cash",
        transactionStatus: "pending",
        remark: "5 star"
      });
      const updateTransaction = {
        amount: 100,
        transactionType: "credit",
        transactionStatus: "paid"
      };
      const res = await chai
        .request(app)
        .patch("/api/v2/transactions/" + transaction.id)
        .set("authorization", "Bearer " + token)
        .send(updateTransaction);
      expect(res.status).to.equal(200);
      expect(res.body.userId).to.be.equal(userId);
      expect(res.body.entityId).to.be.equal(entityId);
      expect(res.body.amount).to.be.equal(updateTransaction.amount);
    });

    it("It should successfully update the transaction status, type and amount for a paid debit transaction", async () => {
      const transaction = await Transaction.create({
        userId,
        entityId,
        amount: 50,
        transactionType: "debit",
        transactionMode: "cash",
        transactionStatus: "paid",
        remark: "5 star"
      });
      const updateTransaction = {
        amount: 100,
        transactionType: "credit",
        transactionStatus: "pending"
      };
      const res = await chai
        .request(app)
        .patch("/api/v2/transactions/" + transaction.id)
        .set("authorization", "Bearer " + token)
        .send(updateTransaction);
      expect(res.status).to.equal(200);
      expect(res.body.userId).to.be.equal(userId);
      expect(res.body.entityId).to.be.equal(entityId);
      expect(res.body.amount).to.be.equal(updateTransaction.amount);
    });

    it("It should successfully update the transaction status, type and amount for a paid credit transaction", async () => {
      const transaction = await Transaction.create({
        userId,
        entityId,
        amount: 50,
        transactionType: "credit",
        transactionMode: "cash",
        transactionStatus: "paid",
        remark: "5 star"
      });
      const updateTransaction = {
        amount: 100,
        transactionType: "debit",
        transactionStatus: "pending"
      };
      const res = await chai
        .request(app)
        .patch("/api/v2/transactions/" + transaction.id)
        .set("authorization", "Bearer " + token)
        .send(updateTransaction);
      expect(res.status).to.equal(200);
      expect(res.body.userId).to.be.equal(userId);
      expect(res.body.entityId).to.be.equal(entityId);
      expect(res.body.amount).to.be.equal(updateTransaction.amount);
    });

    it("It should return status 405 - cannot update user id", async () => {
      const transaction = await Transaction.create({
        userId,
        entityId,
        amount: 50,
        transactionType: "debit",
        transactionMode: "cash",
        transactionStatus: "paid",
        remark: "5 star"
      });
      const updateTransaction = {
        userId: "skskdk"
      };
      const res = await chai
        .request(app)
        .patch("/api/v2/transactions/" + transaction.id)
        .set("authorization", "Bearer " + token)
        .send(updateTransaction);
      expect(res.status).to.equal(405);
    });
  });

  after("dropping test db", done => {
    //Entity.collection.drop();
    mongoose.connection.dropDatabase(() => {
      console.log("\n Test database dropped");
    });
    mongoose.connection.close(() => {
      done();
    });
  });
});
