const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;
chai.use(chaiHttp);

const mongoose = require("mongoose");
const User = require("../../../src/models/users.model");
const Entity = require("../../../src/models/entities.model");
const Transaction = require("../../../src/models/transactions.model");

const app = require("../../../src/common/index");

describe("Integration Tests - Transaction's route", () => {
  let token, userId, newEntity, entityId;
  before(done => {
    chai
      .request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Ayush Shah",
        email: "shahayush457@gmail.com",
        password: "test"
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

  describe("GET /api/v1/transactions", () => {
    afterEach("dropping transactions collection", async () => {
      let updateUser = await User.findById(userId);
      updateUser.balance = 0;
      await updateUser.save();
      Transaction.collection.drop();
    });

    it("It should return status 200 and an empty array", async () => {
      const res = await chai
        .request(app)
        .get("/api/v1/transactions")
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
        remark: "5 star"
      });
      const res = await chai
        .request(app)
        .get("/api/v1/transactions")
        .set("authorization", "Bearer " + token);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
      expect(res.body[0].userId).to.be.equal(userId);
      expect(res.body[0].entityId).to.be.equal(entityId);
    });
  });

  describe("POST /api/v1/transactions", () => {
    afterEach("dropping transactions collection", async () => {
      let updateUser = await User.findById(userId);
      updateUser.balance = 0;
      await updateUser.save();
      Transaction.collection.drop();
    });

    it("It should successfully add a debit transaction to the database", async () => {
      const transaction = {
        entityId,
        amount: 100,
        transactionType: "debit",
        transactionMode: "cash",
        remark: "Good customer"
      };
      const res = await chai
        .request(app)
        .post("/api/v1/transactions")
        .set("authorization", "Bearer " + token)
        .send(transaction);
      const updatedUser = await User.findById(userId);
      expect(res.status).to.equal(201);
      expect(res.body.userId).to.be.equal(userId);
      expect(res.body.entityId).to.be.equal(entityId);
      expect(updatedUser.balance).to.be.equal(-100);
    });

    it("It should successfully add a credit transaction to the database", async () => {
      const transaction = {
        entityId,
        amount: 100,
        transactionType: "credit",
        transactionMode: "cash",
        remark: "Good customer"
      };
      const res = await chai
        .request(app)
        .post("/api/v1/transactions")
        .set("authorization", "Bearer " + token)
        .send(transaction);
      const updatedUser = await User.findById(userId);
      expect(res.status).to.equal(201);
      expect(res.body.userId).to.be.equal(userId);
      expect(res.body.entityId).to.be.equal(entityId);
      expect(updatedUser.balance).to.be.equal(100);
    });

    it("It should return status 400", async () => {
      const transaction = {
        amount: 100,
        transactionType: "debit",
        transactionMode: "cash",
        remark: "Good customer"
      };
      const res = await chai
        .request(app)
        .post("/api/v1/transactions")
        .set("authorization", "Bearer " + token)
        .send(transaction);
      expect(res.status).to.equal(400);
    });
  });

  describe("GET /api/v1/transactions/:id", () => {
    afterEach("dropping transactions collection", async () => {
      let updateUser = await User.findById(userId);
      updateUser.balance = 0;
      await updateUser.save();
      Transaction.collection.drop();
    });

    it("It should return status 404", async () => {
      const res = await chai
        .request(app)
        .get("/api/v1/transactions/ddd")
        .set("authorization", "Bearer " + token);
      expect(res.status).to.equal(404);
    });

    it("It should return status 200 and transaction object of given transaction id", async () => {
      const transaction = await Transaction.create({
        userId,
        entityId,
        amount: 50,
        transactionType: "debit",
        transactionMode: "credit-card",
        remark: "5 star"
      });
      const res = await chai
        .request(app)
        .get("/api/v1/transactions/" + transaction.id)
        .set("authorization", "Bearer " + token);
      expect(res.status).to.equal(200);
      expect(res.body.userId).to.be.equal(userId);
      expect(res.body.entityId).to.be.equal(entityId);
      expect(res.body.amount).to.be.equal(transaction.amount);
    });
  });

  describe("PATCH /api/v1/transactions/:id", () => {
    afterEach("dropping transactions collection", async () => {
      let updateUser = await User.findById(userId);
      updateUser.balance = 0;
      await updateUser.save();
      Transaction.collection.drop();
    });

    it("It should return status 404", async () => {
      const transaction = {
        amount: 50,
        transactionMode: "credit-card"
      };
      const res = await chai
        .request(app)
        .patch("/api/v1/transactions/ddd")
        .set("authorization", "Bearer " + token)
        .send(transaction);
      expect(res.status).to.equal(404);
    });

    it("It should successfully update the amount for credit transaction", async () => {
      const transaction = await Transaction.create({
        userId,
        entityId,
        amount: 50,
        transactionType: "credit",
        transactionMode: "credit-card",
        remark: "5 star"
      });
      await User.findByIdAndUpdate(userId, { balance: 50 });
      const updateTransaction = {
        amount: 100,
        transactionMode: "cash"
      };
      const res = await chai
        .request(app)
        .patch("/api/v1/transactions/" + transaction.id)
        .set("authorization", "Bearer " + token)
        .send(updateTransaction);
      const updatedUser = await User.findById(userId);
      expect(res.status).to.equal(200);
      expect(res.body.userId).to.be.equal(userId);
      expect(res.body.entityId).to.be.equal(entityId);
      expect(res.body.amount).to.be.equal(updateTransaction.amount);
      expect(updatedUser.balance).to.be.equal(100);
    });

    it("It should successfully update the amount for debit transaction", async () => {
      const transaction = await Transaction.create({
        userId,
        entityId,
        amount: 50,
        transactionType: "debit",
        transactionMode: "cash",
        remark: "5 star"
      });
      await User.findByIdAndUpdate(userId, { balance: -50 });
      const updateTransaction = {
        amount: 100
      };
      const res = await chai
        .request(app)
        .patch("/api/v1/transactions/" + transaction.id)
        .set("authorization", "Bearer " + token)
        .send(updateTransaction);
      const updatedUser = await User.findById(userId);
      expect(res.status).to.equal(200);
      expect(res.body.userId).to.be.equal(userId);
      expect(res.body.entityId).to.be.equal(entityId);
      expect(res.body.amount).to.be.equal(updateTransaction.amount);
      expect(updatedUser.balance).to.be.equal(-100);
    });

    it("It should return status 405 - cannot update user id", async () => {
      const transaction = await Transaction.create({
        userId,
        entityId,
        amount: 50,
        transactionType: "debit",
        transactionMode: "cash",
        remark: "5 star"
      });
      const updateTransaction = {
        userId: "skskdk"
      };
      const res = await chai
        .request(app)
        .patch("/api/v1/transactions/" + transaction.id)
        .set("authorization", "Bearer " + token)
        .send(updateTransaction);
      expect(res.status).to.equal(405);
    });
  });

  after("dropping test db", done => {
    //User.collection.drop();
    //Entity.collection.drop();
    mongoose.connection.dropDatabase(() => {
      console.log("\n Test database dropped");
    });
    mongoose.connection.close(() => {
      done();
    });
  });
});
