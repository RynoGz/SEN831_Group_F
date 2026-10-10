import test from "node:test";
import assert from "node:assert/strict";
import {
  REQUEST_STATUSES,
  assertTransitionAllowed,
  canTransition,
} from "../src/domain/requests/request-transition-policy.js";

const allowedTransitions = [
  ["Submitted", "Accepted"],
  ["Submitted", "Rejected"],
  ["Accepted", "Assigned"],
  ["Assigned", "In Progress"],
  ["In Progress", "Resolved"],
  ["Resolved", "Closed"],
];

test("uses exactly the seven CivicConnect request statuses", () => {
  assert.deepEqual(REQUEST_STATUSES, [
    "Submitted",
    "Accepted",
    "Assigned",
    "In Progress",
    "Resolved",
    "Closed",
    "Rejected",
  ]);
});

test("allows every defined lifecycle transition", () => {
  for (const [currentStatus, newStatus] of allowedTransitions) {
    assert.equal(canTransition(currentStatus, newStatus), true);
    assert.doesNotThrow(() =>
      assertTransitionAllowed(currentStatus, newStatus),
    );
  }
});

test("rejects skipped lifecycle stages", () => {
  assert.equal(canTransition("Submitted", "In Progress"), false);
  assert.throws(
    () => assertTransitionAllowed("Submitted", "In Progress"),
    /not allowed/,
  );
});

test("allows rejection only from Submitted", () => {
  assert.equal(canTransition("Accepted", "Rejected"), false);
  assert.throws(
    () => assertTransitionAllowed("Accepted", "Rejected"),
    /not allowed/,
  );
});

test("does not allow transitions out of Closed or Rejected", () => {
  assert.equal(canTransition("Closed", "In Progress"), false);
  assert.equal(canTransition("Rejected", "Submitted"), false);
});

test("rejects transitions to the same status", () => {
  for (const status of REQUEST_STATUSES) {
    assert.equal(canTransition(status, status), false);
  }
  assert.throws(
    () => assertTransitionAllowed("Assigned", "Assigned"),
    /not allowed/,
  );
});

test("rejects unknown current and new statuses", () => {
  assert.equal(canTransition("Unknown", "Submitted"), false);
  assert.equal(canTransition("Submitted", "Unknown"), false);
  assert.throws(
    () => assertTransitionAllowed("Unknown", "Submitted"),
    /Unknown current request status/,
  );
  assert.throws(
    () => assertTransitionAllowed("Submitted", "Unknown"),
    /Unknown new request status/,
  );
});

test("rejects reopening while its rules remain deferred", () => {
  assert.equal(canTransition("Closed", "Submitted"), false);
  assert.throws(
    () => assertTransitionAllowed("Closed", "Submitted"),
    /not allowed/,
  );
});
