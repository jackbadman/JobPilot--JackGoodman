import { after, before, beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";

import User from "../../src/models/User.js";
import {
  app,
  registerAndLogin,
  request,
  resetDatabase,
  startTestDatabase,
  stopTestDatabase
} from "../helpers/testApp.js";

describe("auth integration", () => {
  before(startTestDatabase);
  after(stopTestDatabase);
  beforeEach(resetDatabase);

  test("register creates a user, normalizes email, and returns a token", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({
        name: "Jane Doe",
        emailAddress: " Jane.Doe@Example.com ",
        password: "Password123!"
      });

    assert.equal(response.status, 201);
    assert.ok(response.body.token);
    assert.equal(response.body.user.emailAddress, "jane.doe@example.com");

    const savedUser = await User.findOne({ emailAddress: "jane.doe@example.com" }).select("+passwordHash");
    assert.ok(savedUser);
    assert.ok(savedUser.passwordHash);
    assert.notEqual(savedUser.passwordHash, "Password123!");
  });

  test("register rejects duplicate email addresses", async () => {
    await registerAndLogin();

    const response = await request(app)
      .post("/api/users/register")
      .send({
        name: "Another User",
        emailAddress: "TEST@example.com",
        password: "Password123!"
      });

    assert.equal(response.status, 409);
    assert.equal(response.body.error, "Email already registered.");
  });

  test("login and me return the authenticated user and reject missing auth", async () => {
    await registerAndLogin({
      name: "Jamie",
      emailAddress: "jamie@example.com",
      password: "Password123!"
    });

    const loginResponse = await request(app)
      .post("/api/users/login")
      .send({
        emailAddress: "JAMIE@example.com",
        password: "Password123!"
      });

    assert.equal(loginResponse.status, 200);
    assert.ok(loginResponse.body.token);

    const meResponse = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${loginResponse.body.token}`);

    assert.equal(meResponse.status, 200);
    assert.equal(meResponse.body.emailAddress, "jamie@example.com");
    assert.equal(meResponse.body.name, "Jamie");

    const unauthorizedResponse = await request(app).get("/api/users/me");
    assert.equal(unauthorizedResponse.status, 401);
    assert.equal(unauthorizedResponse.body.error, "Authorization token missing.");
  });
});
