import { after, before, beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";

import JobStatus from "../../src/models/JobStatus.js";
import Location from "../../src/models/Location.js";
import {
  app,
  registerAndLogin,
  request,
  resetDatabase,
  startTestDatabase,
  stopTestDatabase
} from "../helpers/testApp.js";

describe("lookup integration", () => {
  before(startTestDatabase);
  after(stopTestDatabase);
  beforeEach(resetDatabase);

  test("lookup endpoints require auth", async () => {
    const response = await request(app).get("/api/lookup/job-statuses");
    assert.equal(response.status, 401);
    assert.equal(response.body.error, "Authorization token missing.");
  });

  test("lookup endpoints return sorted values", async () => {
    const user = await registerAndLogin();
    await JobStatus.create([{ name: "Offer" }, { name: "Applied" }, { name: "Rejected" }]);
    await Location.create([{ name: "Zurich" }, { name: "Berlin" }]);

    const statusesResponse = await request(app)
      .get("/api/lookup/job-statuses")
      .set("Authorization", `Bearer ${user.token}`);

    assert.equal(statusesResponse.status, 200);
    assert.deepEqual(
      statusesResponse.body.map(item => item.name),
      ["Applied", "Offer", "Rejected"]
    );

    const locationsResponse = await request(app)
      .get("/api/lookup/locations")
      .set("Authorization", `Bearer ${user.token}`);

    assert.equal(locationsResponse.status, 200);
    assert.deepEqual(
      locationsResponse.body.map(item => item.name),
      ["Berlin", "Zurich"]
    );
  });
});
