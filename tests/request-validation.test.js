import test from "node:test";
import assert from "node:assert/strict";
import { validateRequestInput } from "../src/features/requests/validate-request.js";

const categories = [{ id: "category-id", name: "Maintenance" }];
const validInput = { title: "Leaking tap", description: "Water is dripping.", location: "Community hall", categoryId: "category-id", sensitiveInformation: false };

test("FR-001: accepts required text and an explicit false sensitivity answer without an attachment", () => {
  const result = validateRequestInput(validInput, categories);
  assert.equal(result.valid, true);
  assert.equal(result.values.sensitiveInformation, false);
});
test("FR-001: rejects empty and whitespace-only required text with field feedback", () => {
  const result = validateRequestInput({ ...validInput, title: "   ", description: "", location: "\t" }, categories);
  assert.equal(result.valid, false);
  assert.deepEqual(Object.keys(result.errors).sort(), ["description", "location", "title"]);
});
test("FR-002: rejects an unknown category even if the caller bypasses the select control", () => {
  const result = validateRequestInput({ ...validInput, categoryId: "not-allowed" }, categories);
  assert.equal(result.valid, false);
  assert.ok(result.errors.categoryId);
});
test("FR-001: an absent or string sensitivity answer cannot silently become false", () => {
  for (const value of [undefined, null, "false", "true", "", 0]) {
    assert.ok(validateRequestInput({ ...validInput, sensitiveInformation: value }, categories).errors.sensitiveInformation);
  }
  assert.equal(validateRequestInput({ ...validInput, sensitiveInformation: true }, categories).valid, true);
});
test("normalisation trims text without accepting caller-supplied identity, status or timestamp", () => {
  const result = validateRequestInput({ ...validInput, title: "  Leaking tap  ", requesterId: "someone-else", status: "Closed", createdAt: "yesterday" }, categories);
  assert.deepEqual(result.values, validInput);
});
test("malformed input produces validation feedback instead of crashing", () => {
  assert.equal(validateRequestInput(null, categories).valid, false);
  assert.ok(validateRequestInput({ ...validInput, title: { value: "object" } }, categories).errors.title);
});
