import { AsyncErrorDemo } from "../src/js/demos/asyncError.js";
import { beforeEach, jest } from "@jest/globals";

describe("AsyncErrorDemo", () => {
  let demo;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="asyncButton">Trigger</button>
      <div id="asyncResult" class="d-none"></div>
      <div id="asyncError" class="d-none"></div>
    `;
    demo = new AsyncErrorDemo();
  });

  afterEach(() => {
    if (demo) {
      demo.destroy();
      demo = null;
    }
    document.body.innerHTML = "";
    jest.restoreAllMocks();
  });

  describe("initialization", () => {
    test("should initialize with required elements", () => {
      expect(demo.button).toBeTruthy();
      expect(demo.result).toBeTruthy();
      expect(demo.error).toBeTruthy();
    });

    test("should throw error if elements missing", () => {
      document.body.innerHTML = "";

      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      expect(() => {
        new AsyncErrorDemo();
      }).toThrow("AsyncErrorDemo initialization failed");

      consoleErrorSpy.mockRestore();
    });
  });

  describe("async operations", () => {
    test("should fetch and process user data", async () => {
      const userData = await demo.fetchUserData(false);
      expect(userData).toEqual({ id: 1, name: "John Doe" });

      const processed = await demo.processUserData(userData);
      expect(processed).toContain("Processed John Doe");
    });

    test("should show loading state during operation", async () => {
      const promise = demo.handleOperation();
      expect(demo.button.disabled).toBe(true);
      expect(demo.button.innerHTML).toContain("spinner-border");
      await promise;
    });
  });

  describe("error handling", () => {
    test("should handle fetch errors", async () => {
      await demo.handleOperation();
      expect(demo.error.classList.contains("d-none")).toBe(false);
      expect(demo.error.innerHTML).toContain("Network error");
    });

    test("should sanitize error messages", () => {
      const xss = "<script>alert('xss')</script>";
      const sanitized = demo.sanitizeHTML(xss);
      expect(sanitized).not.toContain("<script>");
    });

    test("should attempt recovery after error", async () => {
      jest.spyOn(demo, "attemptRecovery");
      await demo.handleOperation();
      expect(demo.attemptRecovery).toHaveBeenCalled();
    });
  });

  describe("display management", () => {
    test("should reset display before operation", () => {
      demo.result.classList.remove("d-none");
      demo.error.classList.remove("d-none");

      demo.resetDisplay();

      expect(demo.result.classList.contains("d-none")).toBe(true);
      expect(demo.error.classList.contains("d-none")).toBe(true);
    });

    test("should show successful result", () => {
      demo.showResult("Test message");
      expect(demo.result.textContent).toBe("Test message");
      expect(demo.result.classList.contains("d-none")).toBe(false);
    });
  });

  describe("cleanup", () => {
    beforeEach(() => {
      document.body.innerHTML = `
          <button id="asyncButton">Trigger</button>
          <div id="asyncResult" class="d-none"></div>
          <div id="asyncError" class="d-none"></div>
      `;
      demo = new AsyncErrorDemo();
    });

    test("should remove event listeners and references", () => {
      // Store reference to bound handler and button
      const handler = demo.handleOperationBound;
      const button = demo.button;

      // Spy on removeEventListener before destroy
      const removeEventListenerSpy = jest.spyOn(button, "removeEventListener");

      // Call destroy
      demo.destroy();

      // Verify cleanup
      expect(removeEventListenerSpy).toHaveBeenCalledWith("click", handler);
      expect(demo.button).toBeNull();
      expect(demo.result).toBeNull();
      expect(demo.error).toBeNull();
    });
  });
});
