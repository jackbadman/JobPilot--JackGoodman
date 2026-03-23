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

describe("dashboard integration", () => {
  before(startTestDatabase);
  after(stopTestDatabase);
  beforeEach(resetDatabase);

  test("dashboard summary returns only the current user's totals, recency, and status breakdown", async () => {
    const lookups = await seedLookups();
    const currentUser = await registerAndLogin({
      emailAddress: "current@example.com"
    });
    const otherUser = await registerAndLogin({
      emailAddress: "other@example.com"
    });

    const recentJob = await Job.create({
      ...buildJobPayload(lookups, {
        company: "Recent Co"
      }),
      userId: currentUser.user.id
    });

    const olderJob = await Job.create({
      ...buildJobPayload(lookups, {
        company: "Older Co",
        jobStatus: lookups.interviewStatus._id
      }),
      userId: currentUser.user.id
    });

    await Job.collection.updateOne(
      { _id: olderJob._id },
      { $set: { createdAt: new Date("2000-01-01T00:00:00.000Z") } }
    );

    await Job.create({
      ...buildJobPayload(lookups, {
        company: "Other User Co"
      }),
      userId: otherUser.user.id
    });

    assert.ok(recentJob);

    const response = await request(app)
      .get("/api/dashboard/summary")
      .set("Authorization", `Bearer ${currentUser.token}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.totalApplications, 2);
    assert.equal(response.body.recentCount, 1);
    assert.deepEqual(
      response.body.byStatus.sort((a, b) => a.status.localeCompare(b.status)),
      [
        { status: "Applied", count: 1 },
        { status: "Interview", count: 1 }
      ]
    );
  });
});
