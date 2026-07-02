import { describe, it, expect } from "vite-plus/test";
import { convertUnscaledDecimalRawToNumber } from "./arrowDecimal";

describe("convertUnscaledDecimalRawToNumber", () => {
  it("applies scale to unscaled integer strings", () => {
    expect(convertUnscaledDecimalRawToNumber("12345", 2)).toBe(123.45);
    expect(convertUnscaledDecimalRawToNumber("100", 2)).toBe(1);
  });

  it("handles negatives", () => {
    expect(convertUnscaledDecimalRawToNumber("-12345", 2)).toBe(-123.45);
  });

  it("returns plain number for scale 0", () => {
    expect(convertUnscaledDecimalRawToNumber("42", 0)).toBe(42);
  });

  it("treats zero string without fractional work", () => {
    expect(convertUnscaledDecimalRawToNumber("0", 4)).toBe(0);
  });
});
