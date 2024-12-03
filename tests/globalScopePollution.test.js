import { GlobalScopeDemo } from "../src/js/demos/globalScopePollution.js";
import { jest } from "@jest/globals";

describe("GlobalScopeDemo", () => {
  let demo;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="globalScopeButton">Run Demo</button>
      <div id="globalScopeResult"></div>
    `;
    demo = new GlobalScopeDemo();
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

    test("should set accessibility attributes", () => {
      expect(demo.result.getAttribute("role")).toBe("region");
      expect(demo.result.getAttribute("aria-live")).toBe("polite");
      expect(demo.result.getAttribute("aria-atomic")).toBe("true");
      expect(demo.button.getAttribute("aria-label")).toBeTruthy();
    });

    test("should throw error if elements missing", () => {
      document.body.innerHTML = "";

      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => new GlobalScopeDemo()).toThrow(
        "GlobalScopeDemo initialization failed"
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("scope demonstrations", () => {
    test("should demonstrate global var behavior", () => {
      const results = demo.demonstrateScoping();
      expect(results.global).toBe(1);
    });

    test("should demonstrate block scope protection", () => {
      const results = demo.demonstrateScoping();
      expect(results.scoped).toBe(0);
    });

    test("should demonstrate module pattern privacy", () => {
      const results = demo.demonstrateScoping();
      expect(results.module).toBe(1);
    });
  });

  describe("display", () => {
    test("should show scope comparison table", () => {
      const results = {
        global: 1,
        scoped: 0,
        module: 1,
      };

      demo.displayResults(results);

      expect(demo.result.innerHTML).toContain("Scope Behavior Demonstration");
      expect(demo.result.innerHTML).toContain("table-danger");
      expect(demo.result.innerHTML).toContain("table-success");
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
      expect(demo.handleDemoBound).toBeNull();
    });
  });
});
