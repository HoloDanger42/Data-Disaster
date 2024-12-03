import { TypeCoercionDemo } from "../src/js/demos/typeCoercion";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";

describe("TypeCoercionDemo", () => {
  let demo;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
            <div id="coercionResult"></div>
            <input id="coercionInput1" />
            <input id="coercionInput2" />
            <button id="coercionButton">Compare Values</button>
    `;
    demo = new TypeCoercionDemo();
  });

  afterEach(() => {
    demo.destroy();
    document.body.innerHTML = "";
    jest.restoreAllMocks();
  });

  describe("initialization", () => {
    test("should initialize with required elements", () => {
      expect(demo.button).toBeTruthy();
      expect(demo.result).toBeTruthy();
      expect(demo.input1).toBeTruthy();
      expect(demo.input2).toBeTruthy();
    });

    test("should set accessibility attributes", () => {
      expect(demo.result.getAttribute("role")).toBe("region");
      expect(demo.result.getAttribute("aria-live")).toBe("polite");
      expect(demo.result.getAttribute("aria-atomic")).toBe("true");
    });
  });

  describe("input validation", () => {
    test("should validate empty input", () => {
      expect(() => demo.validateInput("")).toThrow("Input value is required");
    });

    test("should validate input length", () => {
      const longInput = "a".repeat(101);
      expect(() => demo.validateInput(longInput)).toThrow("Input too long");
    });
  });

  describe("value parsing", () => {
    test("should parse quoted strings", () => {
      expect(demo.parseValue('"hello"')).toBe("hello");
    });

    test("should convert numbers", () => {
      expect(demo.parseValue("123")).toBe(123);
      expect(demo.parseValue("-12.34")).toBe(-12.34);
    });
  });

  describe("comparison", () => {
    test("should compare numbers loosely", () => {
      const result = demo.compareValues(5, "5");
      expect(result.loose).toBe(true);
      expect(result.strict).toBe(false);
    });

    test("should compare strings strictly", () => {
      const result = demo.compareValues("hello", "hello");
      expect(result.loose).toBe(true);
      expect(result.strict).toBe(true);
    });
  });

  describe("display", () => {
    test("should show explanation for coerced values", () => {
      const explanation = demo.getExplanation(true, false);
      expect(explanation).toContain("type coercion");
      expect(explanation).toContain("strict comparison");
    });
  });

  describe("cleanup", () => {
    test("should remove event listeners and references", () => {
      // Store reference to bound handler
      const handler = demo.handleComparisonBound;

      // Spy on removeEventListener before destroy
      const removeEventListenerSpy = jest.spyOn(
        demo.button,
        "removeEventListener"
      );

      demo.destroy();

      // Verify cleanup
      expect(removeEventListenerSpy).toHaveBeenCalledWith("click", handler);
      expect(demo.button).toBeNull();
      expect(demo.result).toBeNull();
      expect(demo.handleComparisonBound).toBeNull();
    });
  });
});
