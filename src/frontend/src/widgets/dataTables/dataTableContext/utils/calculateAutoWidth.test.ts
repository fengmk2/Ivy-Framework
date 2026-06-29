import { describe, it, expect } from "vite-plus/test";
import { calculateAutoWidth } from "./calculateAutoWidth";
import { ColType, type DataColumn } from "../../types/types";

function col(partial: {
  name: string;
  header?: string;
  type?: ColType;
  width?: number;
}): DataColumn {
  return {
    name: partial.name,
    header: partial.header,
    type: partial.type ?? ColType.Text,
    width: partial.width ?? 100,
  };
}

describe("calculateAutoWidth", () => {
  it("uses type default when header is short", () => {
    expect(calculateAutoWidth(col({ name: "x", type: ColType.Boolean }))).toBe(80);
    expect(calculateAutoWidth(col({ name: "x", type: ColType.Number }))).toBe(100);
    expect(calculateAutoWidth(col({ name: "x", type: ColType.DateTime }))).toBe(160);
    expect(calculateAutoWidth(col({ name: "x", type: ColType.Icon }))).toBe(60);
  });

  it("estimates width from header text and padding", () => {
    const header = "A".repeat(20);
    const expected = Math.min(400, Math.max(60, Math.ceil(20 * 8 + 48)));
    expect(calculateAutoWidth(col({ name: "c", header, type: ColType.Text }))).toBe(expected);
  });

  it("uses column name when header is absent", () => {
    const name = "B".repeat(25);
    const fromName = Math.min(400, Math.max(60, Math.ceil(25 * 8 + 48)));
    expect(calculateAutoWidth(col({ name, type: ColType.Text }))).toBe(fromName);
  });

  it("clamps to minimum width", () => {
    expect(calculateAutoWidth(col({ name: "a", header: "", type: ColType.Boolean }))).toBe(80);
  });

  it("clamps to maximum auto width", () => {
    const long = "Z".repeat(100);
    expect(calculateAutoWidth(col({ name: "c", header: long, type: ColType.Text }))).toBe(400);
  });

  it("falls back to text default when type has no specific default", () => {
    expect(
      calculateAutoWidth({
        name: "e",
        type: "Weird" as unknown as ColType,
        width: 100,
      }),
    ).toBe(180);
  });
});
