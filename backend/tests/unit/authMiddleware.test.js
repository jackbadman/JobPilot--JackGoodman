import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, mock, test } from "node:test";

import jwt from "jsonwebtoken";
import authMiddleware from "../../src/middleware/auth.js";

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
}

describe("auth middleware", () => {
  const originalSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = "unit-test-secret";
  });

  afterEach(() => {
    mock.restoreAll();
    if (originalSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalSecret;
    }
  });

  test("returns 401 when the authorization header is missing", () => {
    const req = { headers: {} };
    const res = createResponse();
    let nextCalled = false;

    authMiddleware(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { error: "Authorization token missing." });
  });

  test("returns 401 when the authorization header is not a bearer token", () => {
    const req = { headers: { authorization: "Basic abc123" } };
    const res = createResponse();

    authMiddleware(req, res, () => {});

    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { error: "Authorization token missing." });
  });

  test("returns 401 when jwt verification fails", () => {
    const verifyMock = mock.method(jwt, "verify", () => {
      throw new Error("bad token");
    });
    const req = { headers: { authorization: "Bearer bad-token" } };
    const res = createResponse();
    let nextCalled = false;

    authMiddleware(req, res, () => {
      nextCalled = true;
    });

    assert.equal(verifyMock.mock.calls.length, 1);
    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { error: "Invalid or expired token." });
  });

  test("sets req.user and calls next for a valid bearer token", () => {
    const verifyMock = mock.method(jwt, "verify", () => ({ sub: "user-123" }));
    const req = { headers: { authorization: "Bearer valid-token" } };
    const res = createResponse();
    let nextCalled = false;

    authMiddleware(req, res, () => {
      nextCalled = true;
    });

    assert.equal(verifyMock.mock.calls.length, 1);
    assert.deepEqual(verifyMock.mock.calls[0].arguments, ["valid-token", "unit-test-secret"]);
    assert.equal(nextCalled, true);
    assert.deepEqual(req.user, { id: "user-123" });
    assert.equal(res.body, null);
  });
});
