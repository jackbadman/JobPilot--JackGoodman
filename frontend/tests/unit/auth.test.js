import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { afterEach, beforeEach, describe, test } from "node:test";

import {
  clearToken,
  getToken,
  getValidToken,
  hasValidToken,
  isTokenExpired,
  parseJwt,
  setToken
} from "../../src/utils/auth.js";

function createToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${header}.${body}.signature`;
}

function createLocalStorageMock() {
  const store = new Map();

  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    }
  };
}

const originalLocalStorage = globalThis.localStorage;
const originalAtob = globalThis.atob;

beforeEach(() => {
  globalThis.localStorage = createLocalStorageMock();
  globalThis.atob = input => Buffer.from(input, "base64").toString("binary");
});

afterEach(() => {
  if (originalLocalStorage === undefined) {
    delete globalThis.localStorage;
  } else {
    globalThis.localStorage = originalLocalStorage;
  }

  if (originalAtob === undefined) {
    delete globalThis.atob;
  } else {
    globalThis.atob = originalAtob;
  }
});

describe("frontend auth utilities", () => {
  test("parseJwt returns the payload for a valid token", () => {
    const token = createToken({ sub: "user-123", exp: 9999999999 });

    assert.deepEqual(parseJwt(token), { sub: "user-123", exp: 9999999999 });
  });

  test("parseJwt returns null for invalid tokens", () => {
    assert.equal(parseJwt(""), null);
    assert.equal(parseJwt("not-a-jwt"), null);
    assert.equal(parseJwt("one.two"), null);
  });

  test("isTokenExpired respects token expiry and skew", () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const validToken = createToken({ exp: nowSeconds + 120 });
    const expiredToken = createToken({ exp: nowSeconds + 10 });

    assert.equal(isTokenExpired(validToken), false);
    assert.equal(isTokenExpired(expiredToken), true);
  });

  test("setToken and getToken store the token", () => {
    setToken("token-123");

    assert.equal(getToken(), "token-123");
  });

  test("getValidToken returns the token when it is still valid", () => {
    const token = createToken({ exp: Math.floor(Date.now() / 1000) + 120 });
    setToken(token);

    assert.equal(getValidToken(), token);
    assert.equal(getToken(), token);
    assert.equal(hasValidToken(), true);
  });

  test("getValidToken clears expired tokens", () => {
    const expiredToken = createToken({ exp: Math.floor(Date.now() / 1000) - 1 });
    setToken(expiredToken);

    assert.equal(getValidToken(), null);
    assert.equal(getToken(), null);
    assert.equal(hasValidToken(), false);
  });

  test("clearToken removes any saved token", () => {
    setToken("token-123");

    clearToken();

    assert.equal(getToken(), null);
  });
});
