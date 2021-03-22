const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;
chai.use(chaiHttp);

const mongoose = require("mongoose");
const User = require("../../../src/models/users.model");
const Entity = require("../../../src/models/entities.model");

const app = require("../../../src/common/index");

describe("Integration Tests - Entity routes", () => {
  let token, userId;
  before(done => {
    chai
      .request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Ayush Shah",
        email: "shahayush457@gmail.com",
        password: "testtest"
      })
      .end((err, user) => {
        expect(user.status).to.equal(201);
        expect(user.body).to.have.property("token");
        token = user.body.token;
        userId = user.body.id;
        done();
      });
  });

  describe("GET /api/v1/entities", () => {
    afterEach("dropping entity collection", done => {
      Entity.collection.drop();
      done();
    });

    it("It should return status 200 and an empty array", async () => {
      const res = await chai
        .request(app)
        .get("/api/v1/entities")
        .set("authorization", "Bearer " + token);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array").that.is.empty;
    });

    it("It should return status 200 and an array of 1 entity", async () => {
      const entity = await Entity.create({
        userId,
        name: "Ayush Shah",
        address: "India",
        contactNo: "983883832",
        entityType: "vendor"
      });
      const user = await User.findById(userId);
      user.entities.push(entity._id);
      await user.save();
      const res = await chai
        .request(app)
        .get("/api/v1/entities")
        .set("authorization", "Bearer " + token);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
      expect(res.body[0].userId).to.be.equal(userId);
    });
  });

  describe("POST /api/v1/entities", () => {
    afterEach("dropping entity collection", done => {
      Entity.collection.drop();
      done();
    });

    it("It should successfully add an entity of vendor type to the database", async () => {
      const entity = {
        userId,
        name: "Ayush Shah",
        address: "India",
        contactNo: "983883832",
        entityType: "vendor"
      };
      const res = await chai
        .request(app)
        .post("/api/v1/entities")
        .set("authorization", "Bearer " + token)
        .send(entity);
      expect(res.status).to.equal(201);
      expect(res.body.entityType).to.be.equal("vendor");
      expect(res.body.userId).to.be.equal(userId);
    });

    it("It should successfully add an entity of customer type to the database", async () => {
      const entity = {
        userId,
        name: "Ayush Shah",
        address: "India",
        contactNo: "983883832",
        entityType: "customer"
      };
      const res = await chai
        .request(app)
        .post("/api/v1/entities")
        .set("authorization", "Bearer " + token)
        .send(entity);
      expect(res.status).to.equal(201);
      expect(res.body.entityType).to.be.equal("customer");
      expect(res.body.userId).to.be.equal(userId);
    });

    it("It should return status 422 - Missing entityType", async () => {
      const entity = {
        userId,
        name: "Ayush Shah",
        address: "India",
        contactNo: "983883832"
      };
      const res = await chai
        .request(app)
        .post("/api/v1/entities")
        .set("authorization", "Bearer " + token)
        .send(entity);
      expect(res.status).to.equal(422);
    });

    it("It should return status 422 - Missing name", async () => {
      const entity = {
        userId,
        address: "India",
        contactNo: "983883832",
        entityType: "vendor"
      };
      const res = await chai
        .request(app)
        .post("/api/v1/entities")
        .set("authorization", "Bearer " + token)
        .send(entity);
      expect(res.status).to.equal(422);
    });

    it("It should return status 422 - Missing contactNo", async () => {
      const entity = {
        userId,
        name: "Ayush Shah",
        address: "India",
        entityType: "vendor"
      };
      const res = await chai
        .request(app)
        .post("/api/v1/entities")
        .set("authorization", "Bearer " + token)
        .send(entity);
      expect(res.status).to.equal(422);
    });

    it("It should return status 422 - Missing address", async () => {
      const entity = {
        userId,
        name: "Ayush Shah",
        contactNo: "983883832",
        entityType: "vendor"
      };
      const res = await chai
        .request(app)
        .post("/api/v1/entities")
        .set("authorization", "Bearer " + token)
        .send(entity);
      expect(res.status).to.equal(422);
    });
  });

  describe("GET /api/v1/entities/:id", () => {
    afterEach("dropping entity collection", done => {
      Entity.collection.drop();
      done();
    });

    it("It should return status 422 - Entity id not a mongo id", async () => {
      const res = await chai
        .request(app)
        .get("/api/v1/entities/ddd")
        .set("authorization", "Bearer " + token);
      expect(res.status).to.equal(422);
    });

    it("It should return status 200 and entity object of given entity id", async () => {
      const entity = await Entity.create({
        userId,
        name: "Ayush Shah",
        address: "India",
        contactNo: "983883832",
        entityType: "customer"
      });
      const res = await chai
        .request(app)
        .get("/api/v1/entities/" + entity.id)
        .set("authorization", "Bearer " + token);
      expect(res.status).to.equal(200);
      expect(res.body.name).to.be.equal("Ayush Shah");
      expect(res.body.userId).to.be.equal(userId);
    });
  });

  describe("PATCH /api/v1/entities/:id", () => {
    afterEach("dropping entity collection", done => {
      Entity.collection.drop();
      done();
    });

    it("It should return status 422 - Entity id not a mongo id", async () => {
      const entity = {
        name: "Ayush Shah",
        address: "USA",
        contactNo: "983883839",
        entityType: "vendor"
      };
      const res = await chai
        .request(app)
        .patch("/api/v1/entities/ddd")
        .set("authorization", "Bearer " + token)
        .send(entity);
      expect(res.status).to.equal(422);
    });

    it("It should successfully update the entityType", async () => {
      const entity = await Entity.create({
        userId,
        name: "Ayush Shah",
        address: "India",
        contactNo: "983883832",
        entityType: "customer"
      });
      const updateEntity = {
        entityType: "vendor"
      };
      const res = await chai
        .request(app)
        .patch("/api/v1/entities/" + entity.id)
        .set("authorization", "Bearer " + token)
        .send(updateEntity);
      expect(res.status).to.equal(200);
      expect(res.body.userId).to.be.equal(userId);
      expect(res.body._id).to.be.equal(entity.id.toString());
      expect(res.body.entityType).to.be.equal(updateEntity.entityType);
    });

    it("It should successfully update the name and contactNo ", async () => {
      const entity = await Entity.create({
        userId,
        name: "Ayush Shah",
        address: "India",
        contactNo: "983883832",
        entityType: "customer"
      });
      const updateEntity = {
        name: "New name",
        contactNo: "123883832"
      };
      const res = await chai
        .request(app)
        .patch("/api/v1/entities/" + entity.id)
        .set("authorization", "Bearer " + token)
        .send(updateEntity);
      expect(res.status).to.equal(200);
      expect(res.body.userId).to.be.equal(userId);
      expect(res.body._id).to.be.equal(entity.id.toString());
      expect(res.body.name).to.be.equal(updateEntity.name);
      expect(res.body.contactNo).to.be.equal(updateEntity.contactNo);
    });
  });

  after("dropping test db", async () => {
    await mongoose.connection.dropDatabase();
    console.log("\n Test database dropped");
  });
});
