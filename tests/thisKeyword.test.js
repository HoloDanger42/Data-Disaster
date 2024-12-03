import { ThisKeywordDemo } from "../src/js/demos/thisKeyword.js";
import { jest } from "@jest/globals";

describe("ThisKeywordDemo", () => {
  let demo;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="thisButton">Run Demo</button>
      <div id="thisResult"></div>
    `;
    demo = new ThisKeywordDemo();
  });

  afterEach(() => {
    if (demo) {
      demo.destroy();
    }
    document.body.innerHTML = "";
    jest.restoreAllMocks();
  });

  describe("initialization", () => {
    test("should initialize with required elements", () => {
      expect(demo.button).toBeTruthy();
      expect(demo.result).toBeTruthy();
    });

    test("should throw error if elements missing", () => {
      document.body.innerHTML = "";

      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => new ThisKeywordDemo()).toThrow(
        "ThisKeywordDemo initialization failed"
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("this binding demonstrations", () => {
    test("should demonstrate regular function this binding", () => {
      const results = demo.demonstrateThis();
      expect(results.regularDirect).toBe("Hello, my name is Alice");
      expect(results.regularDetached).toBe(
        "Hello, my name is &lt;no context&gt;"
      );
    });

    test("should demonstrate arrow function this binding", () => {
      const results = demo.demonstrateThis();
      expect(results.arrowDirect).toBe("Hello, my name is Bob");
      expect(results.arrowDetached).toBe("Hello, my name is Bob");
    });
  });

  describe("display", () => {
    test("should show this binding comparison table", () => {
      const results = {
        regularDirect: "Hello, my name is Alice",
        regularDetached: "Hello, my name is <no context>",
        arrowDirect: "Hello, my name is Bob",
        arrowDetached: "Hello, my name is Bob",
      };

      demo.displayResults(results);

      expect(demo.result.innerHTML).toContain("This Keyword Behavior");
      expect(demo.result.innerHTML).toContain("table-success");
      expect(demo.result.innerHTML).toContain("table-danger");
    });

    test("should sanitize HTML in content", () => {
      const xss = "<script>alert('xss')</script>";
      const sanitized = demo.sanitizeHTML(xss);
      expect(sanitized).not.toContain("<script>");
    });
  });

  describe("error handling", () => {
    test("should display error message", () => {
      demo.handleError(new Error("Test error"));
      expect(demo.result.innerHTML).toContain("Test error");
    });
  });

  describe("loading state", () => {
    test("should update button state while loading", () => {
      demo.setLoading(true);
      expect(demo.button.disabled).toBe(true);
      expect(demo.button.innerHTML).toContain("spinner-border");

      demo.setLoading(false);
      expect(demo.button.disabled).toBe(false);
      expect(demo.button.innerHTML).toBe("Run Demo");
    });
  });

  describe("cleanup", () => {
    test("should remove event listeners and clear references", () => {
      const handler = demo.handleDemoBound;
      const removeEventListenerSpy = jest.spyOn(
        demo.button,
        "removeEventListener"
      );

      demo.destroy();

      expect(removeEventListenerSpy).toHaveBeenCalledWith("click", handler);
      expect(demo.button).toBeNull();
      expect(demo.result).toBeNull();
    });
  });
});
