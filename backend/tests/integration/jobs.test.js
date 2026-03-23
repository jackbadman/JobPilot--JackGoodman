import { after, before, beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";

import Job from "../../src/models/Job.js";
import {
  app,
  buildJobPayload,
  registerAndLogin,
  request,
  resetDatabase,
  seedLookups,
  startTestDatabase,
  stopTestDatabase
} from "../helpers/testApp.js";

describe("job integration", () => {
  before(startTestDatabase);
  after(stopTestDatabase);
  beforeEach(resetDatabase);

  test("authenticated users can create and list only their own jobs", async () => {
    const lookups = await seedLookups();
    const userOne = await registerAndLogin({
      emailAddress: "one@example.com"
    });
    const userTwo = await registerAndLogin({
      emailAddress: "two@example.com"
    });

    const createResponse = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${userOne.token}`)
      .send(buildJobPayload(lookups));

    assert.equal(createResponse.status, 201);
    assert.equal(createResponse.body.company, "Acme Ltd");

    const listForOwner = await request(app)
      .get("/api/jobs")
      .set("Authorization", `Bearer ${userOne.token}`);

    assert.equal(listForOwner.status, 200);
    assert.equal(listForOwner.body.length, 1);
    assert.equal(listForOwner.body[0].company, "Acme Ltd");
    assert.equal(listForOwner.body[0].jobStatus.name, "Applied");

    const listForOtherUser = await request(app)
      .get("/api/jobs")
      .set("Authorization", `Bearer ${userTwo.token}`);

    assert.equal(listForOtherUser.status, 200);
    assert.equal(listForOtherUser.body.length, 0);
  });

  test("jobs are protected by ownership for fetch, update, and delete", async () => {
    const lookups = await seedLookups();
    const owner = await registerAndLogin({
      emailAddress: "owner@example.com"
    });
    const otherUser = await registerAndLogin({
      emailAddress: "other@example.com"
    });

    const job = await Job.create({
      ...buildJobPayload(lookups),
      userId: owner.user.id
    });

    const getResponse = await request(app)
      .get(`/api/jobs/${job._id}`)
      .set("Authorization", `Bearer ${otherUser.token}`);
    assert.equal(getResponse.status, 404);

    const updateResponse = await request(app)
      .put(`/api/jobs/${job._id}`)
      .set("Authorization", `Bearer ${otherUser.token}`)
      .send({ company: "Changed Co" });
    assert.equal(updateResponse.status, 404);

    const deleteResponse = await request(app)
      .delete(`/api/jobs/${job._id}`)
      .set("Authorization", `Bearer ${otherUser.token}`);
    assert.equal(deleteResponse.status, 404);
  });

  test("jobs support filtering by lookup fields", async () => {
    const lookups = await seedLookups();
    const user = await registerAndLogin();

    await Job.create({
      ...buildJobPayload(lookups),
      userId: user.user.id
    });
    await Job.create({
      ...buildJobPayload(lookups, {
        company: "Beta Corp",
        jobStatus: lookups.interviewStatus._id
      }),
      userId: user.user.id
    });

    const response = await request(app)
      .get(`/api/jobs?status=${lookups.interviewStatus._id}`)
      .set("Authorization", `Bearer ${user.token}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.length, 1);
    assert.equal(response.body[0].company, "Beta Corp");
    assert.equal(response.body[0].jobStatus.name, "Interview");
  });
});
