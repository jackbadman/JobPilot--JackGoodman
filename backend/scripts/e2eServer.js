import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;
let httpServer;

async function seedLookups() {
  const [{ default: JobStatus }, { default: JobType }, { default: WorkType }, { default: Location }] =
    await Promise.all([
      import("../src/models/JobStatus.js"),
      import("../src/models/JobType.js"),
      import("../src/models/WorkType.js"),
      import("../src/models/Location.js")
    ]);

  await Promise.all([
    JobStatus.insertMany([{ name: "Applied" }, { name: "Interview" }, { name: "Offer" }]),
    JobType.insertMany([{ name: "Full-time" }, { name: "Contract" }]),
    WorkType.insertMany([{ name: "Remote" }, { name: "Hybrid" }]),
    Location.insertMany([{ name: "London" }, { name: "Manchester" }])
  ]);
}

async function start() {
  process.env.JWT_SECRET ||= "e2e-test-secret";
  process.env.CLOUDINARY_CLOUD_NAME ||= "e2e-cloud";
  process.env.CLOUDINARY_API_KEY ||= "e2e-key";
  process.env.CLOUDINARY_API_SECRET ||= "e2e-secret";

  mongoServer = await MongoMemoryServer.create({
    instance: {
      ip: "127.0.0.1",
      port: 27018
    }
  });

  await mongoose.connect(mongoServer.getUri(), {
    serverSelectionTimeoutMS: 5000
  });

  await seedLookups();

  const { default: app } = await import("../src/app.js");
  const port = Number(process.env.PORT || 5000);

  await new Promise(resolve => {
    httpServer = app.listen(port, "127.0.0.1", resolve);
  });

  console.log(`E2E backend listening on http://127.0.0.1:${port}`);
}

async function stop(exitCode = 0) {
  if (httpServer) {
    await new Promise(resolve => httpServer.close(resolve));
    httpServer = null;
  }

  await mongoose.disconnect();

  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }

  process.exit(exitCode);
}

process.on("SIGINT", () => {
  void stop(0);
});

process.on("SIGTERM", () => {
  void stop(0);
});

start().catch(error => {
  console.error("Failed to start E2E backend:", error);
  void stop(1);
});
