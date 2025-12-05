import { test, expect } from "vitest";
import { hasShape, isArrayOf, isString, optionally } from "./03_currying";

const isValidResponse = hasShape({
    id: isString,
    firstName: isString,
    middleName: optionally(isString),
    lastName: isString,
    addresses: isArrayOf(hasShape({ street: isString, city: isString })),
    phones: optionally(hasShape({
        home: optionally(isString),
        mobile: optionally(isString),
        work: optionally(isString)
    }))
});

test("Empty object is invalid", () => {
    expect(isValidResponse({})).toBe(false);
});

test("Array is invalid", () => {
    expect(isValidResponse([])).toBe(false);
});

test("String is invalid", () => {
    expect(isValidResponse("hello")).toBe(false);
});

test("Valid minimal object", () => {
    expect(isValidResponse({
        id: "aaa",
        firstName: "bbb",
        lastName: "ccc",
        addresses: []
    })).toBe(true);
});

test("Missing fields in address is invalid", () => {
    expect(isValidResponse({
        id: "aaa",
        firstName: "bbb",
        lastName: "ccc",
        addresses: [{}]
    })).toBe(false);
});

test("Valid full object", () => {
    expect(isValidResponse({
        id: "aaa",
        firstName: "bbb",
        lastName: "ccc",
        addresses: [{ city: "hello", street: "world" }],
        phones: {}
    })).toBe(true);
});
