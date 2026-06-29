import { describe, it, expect, vi, beforeEach, afterEach } from "vite-plus/test";
import { copyToClipboard } from "./clipboard";

describe("copyToClipboard", () => {
  let originalClipboard: Clipboard;
  let originalExecCommand: typeof document.execCommand;

  beforeEach(() => {
    originalClipboard = navigator.clipboard;
    originalExecCommand = document.execCommand;
    // happy-dom doesn't define execCommand, so provide a stub
    if (!document.execCommand) {
      document.execCommand = vi.fn().mockReturnValue(true);
    }
  });

  afterEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: originalClipboard,
      writable: true,
      configurable: true,
    });
    document.execCommand = originalExecCommand;
    vi.restoreAllMocks();
  });

  it("calls navigator.clipboard.writeText when available", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      writable: true,
      configurable: true,
    });

    await copyToClipboard("hello");
    expect(writeText).toHaveBeenCalledWith("hello");
  });

  it("falls back to execCommand when navigator.clipboard is undefined", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    document.execCommand = vi.fn().mockReturnValue(true);
    const appendChild = vi.spyOn(document.body, "appendChild");
    const removeChild = vi.spyOn(document.body, "removeChild");

    await copyToClipboard("fallback text");

    expect(document.execCommand).toHaveBeenCalledWith("copy");
    expect(appendChild).toHaveBeenCalled();
    expect(removeChild).toHaveBeenCalled();

    const textarea = appendChild.mock.calls[0][0] as HTMLTextAreaElement;
    expect(textarea.value).toBe("fallback text");
  });

  it("falls back to execCommand when writeText rejects", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("Not allowed"));
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      writable: true,
      configurable: true,
    });

    document.execCommand = vi.fn().mockReturnValue(true);

    await copyToClipboard("rejected text");

    expect(writeText).toHaveBeenCalledWith("rejected text");
    expect(document.execCommand).toHaveBeenCalledWith("copy");
  });
});
