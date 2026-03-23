import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

import app from "../../src/app.js";
import JobStatus from "../../src/models/JobStatus.js";
import JobType from "../../src/models/JobType.js";
import Location from "../../src/models/Location.js";
import WorkType from "../../src/models/WorkType.js";

let mongoServer;

export async function startTestDatabase() {
  process.env.JWT_SECRET ||= "integration-test-secret";

  mongoServer = await MongoMemoryServer.create({
    instance: {
      ip: "127.0.0.1"
    }
  });
  await mongoose.connect(mongoServer.getUri(), {
    serverSelectionTimeoutMS: 5000
  });
}

export async function stopTestDatabase() {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }
}

export async function resetDatabase() {
  const { collections } = mongoose.connection;
  await Promise.all(
    Object.values(collections).map(collection => collection.deleteMany({}))
  );
}

export async function seedLookups() {
  const [appliedStatus, interviewStatus, fullTimeType, remoteType, londonLocation] =
    await Promise.all([
      JobStatus.create({ name: "Applied" }),
      JobStatus.create({ name: "Interview" }),
      JobType.create({ name: "Full-time" }),
      WorkType.create({ name: "Remote" }),
      Location.create({ name: "London" })
    ]);

  return {
    appliedStatus,
    interviewStatus,
    fullTimeType,
    remoteType,
    londonLocation
  };
}

export function buildJobPayload(lookups, overrides = {}) {
  return {
    company: "Acme Ltd",
    jobTitle: "Software Engineer",
    location: String(lookups.londonLocation._id),
    jobStatus: String(lookups.appliedStatus._id),
    jobType: String(lookups.fullTimeType._id),
    workType: String(lookups.remoteType._id),
    salary: 45000,
    appliedDate: "2026-03-01",
    closingDate: "2026-03-31",
    ...overrides
  };
}

export async function registerAndLogin(overrides = {}) {
  const payload = {
    name: "Test User",
    emailAddress: "test@example.com",
    password: "Password123!",
    ...overrides
  };

  const response = await request(app)
    .post("/api/users/register")
    .send(payload);

  return {
    response,
    token: response.body.token,
    user: response.body.user
  };
}

export { app, request };
