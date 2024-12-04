import { CallbackHellDemo } from "../src/js/demos/callbackHell.js";
import { jest } from "@jest/globals";

const flushPromises = () => new Promise(process.nextTick);

describe("CallbackHellDemo", () => {
  let demo;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="callbackButton">Run Tasks</button>
      <div id="callbackResult"></div>
    `;
    demo = new CallbackHellDemo();

    // Mock the delay method to speed up tests
    jest.spyOn(demo, "delay").mockImplementation(() => Promise.resolve());
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

      expect(() => new CallbackHellDemo()).toThrow(
        "CallbackHellDemo initialization failed"
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("async operations", () => {
    beforeEach(() => {
      jest.useFakeTimers({
        doNotFake: ["nextTick"],
        advanceTimers: true,
      });
      jest.clearAllTimers();
    });

    afterEach(() => {
      jest.clearAllTimers();
      jest.useRealTimers();
    });

    test("should demonstrate callback pattern", async () => {
      jest.setTimeout(10000);
      const results = await demo.demonstrateTasks();

      expect(results.callback).toHaveLength(3);
      results.callback.forEach((entry) => {
        expect(entry).toMatch(/task: \d+ms/);
      });
    });

    test("should demonstrate promise pattern", async () => {
      const resultsPromise = demo.demonstrateTasks();
      const results = await resultsPromise;

      expect(results.promise).toHaveLength(3);
      results.promise.forEach((entry) => {
        expect(entry).toMatch(/task: \d+ms/);
      });
    });

    test("should demonstrate async/await pattern", async () => {
      const resultsPromise = demo.demonstrateTasks();
      const results = await resultsPromise;

      expect(results.async).toHaveLength(3);
      results.async.forEach((entry) => {
        expect(entry).toMatch(/task: \d+ms/);
      });
    });

    test("should show loading state during execution", async () => {
      const promise = demo.handleDemo();
      expect(demo.button.disabled).toBe(true);
      expect(demo.button.innerHTML).toContain("spinner-border");

      await promise;

      expect(demo.button.disabled).toBe(false);
      expect(demo.button.innerHTML).toBe("Run Tasks");
    });
  });

  describe("display", () => {
    test("should show pattern comparison table", () => {
      const times = {
        callback: ["First: 1000ms", "Second: 2000ms", "Third: 3000ms"],
        promise: ["First: 1000ms", "Second: 2000ms", "Third: 3000ms"],
        async: ["First: 1000ms", "Second: 2000ms", "Third: 3000ms"],
      };

      demo.displayResults(times);

      expect(demo.result.innerHTML).toContain("Async Pattern Comparison");
      expect(demo.result.innerHTML).toContain("table-danger");
      expect(demo.result.innerHTML).toContain("table-warning");
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
    });
  });
});
