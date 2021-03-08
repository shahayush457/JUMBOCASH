const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;
chai.use(chaiHttp);

const mongoose = require("mongoose");
const User = require("../../../src/models/users.model");

const app = require("../../../src/common/index");

describe("Integration Tests - Auth routes", () => {
  describe("POST /api/v1/auth/register", () => {
    it("It should successfully register a user", async () => {
      const user = await chai
        .request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Ayush Shah",
          email: "fake@gmail.com",
          password: "test"
        });
      expect(user.status).to.be.equal(201);
      expect(user.body).to.be.have.property("token");
    });

    it("It should not register the user - email already registered", async () => {
      const user = await chai
        .request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Ayush Shah",
          email: "fake@gmail.com",
          password: "test"
        });
      expect(user.status).to.be.equal(400);
    });

    it("It should not register the user - email field missing", async () => {
      const user = await chai
        .request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Ayush Shah",
          password: "test"
        });
      expect(user.status).to.be.equal(400);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    before("Save a user for login tests", async () => {
      await chai
        .request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Ayush Shah",
          email: "login@gmail.com",
          password: "test"
        });
    });
    it("It should successfully login the user", async () => {
      const user = await chai
        .request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "login@gmail.com",
          password: "test"
        });
      expect(user.status).to.be.equal(200);
      expect(user.body).to.be.have.property("token");
    });

    it("It should not login the user - email not registered", async () => {
      const user = await chai
        .request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "fakelogin@gmail.com",
          password: "test"
        });
      expect(user.status).to.be.equal(400);
    });

    it("It should not login the user - invalid email", async () => {
      const user = await chai
        .request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "fakelogin@gmail.com",
          password: "test"
        });
      expect(user.status).to.be.equal(400);
    });

    it("It should not login the user - invalid password", async () => {
      const user = await chai
        .request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "login@gmail.com",
          password: "fake"
        });
      expect(user.status).to.be.equal(400);
    });
  });

  after("dropping test db", async () => {
    //User.collection.drop();
    await mongoose.connection.dropDatabase(() => {
      console.log("\n Test database dropped");
    });
  });
});
