import { ArithmeticCoercionDemo } from "../src/js/demos/arithmeticCoercion.js";
import { jest } from "@jest/globals";

describe("ArithmeticCoercionDemo", () => {
  let demo;
  let mockElements;

  beforeEach(() => {
    // Setup DOM elements
    document.body.innerHTML = `
      <form id="arithmeticForm">
        <div id="arithmeticResult"></div>
        <input id="arithmeticInput1" />
        <input id="arithmeticInput2" />
        <select id="arithmeticOperator">
          <option value="+">+</option>
          <option value="-">-</option>
          <option value="*">*</option>
          <option value="/">/</option>
        </select>
        <button id="arithmeticButton">Calculate</button>
      </form>
    `;

    // Store references to elements
    mockElements = {
      form: document.getElementById("arithmeticForm"),
      result: document.getElementById("arithmeticResult"),
      input1: document.getElementById("arithmeticInput1"),
      input2: document.getElementById("arithmeticInput2"),
      operator: document.getElementById("arithmeticOperator"),
      button: document.getElementById("arithmeticButton"),
    };

    // Create spy on getElementById
    const getElementByIdSpy = jest.spyOn(document, "getElementById");
    getElementByIdSpy.mockImplementation((id) => {
      if (id === "arithmeticForm") return mockElements.form;
      const key = id.replace("arithmetic", "").toLowerCase();
      return mockElements[key] || null;
    });

    demo = new ArithmeticCoercionDemo();
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jest.restoreAllMocks();
    demo.destroy();
  });

  describe("initialization", () => {
    test("should initialize successfully with all required elements", () => {
      expect(demo.form).toBeTruthy();
      expect(demo.result).toBeTruthy();
      expect(demo.button).toBeTruthy();
    });

    test("should throw error if form not found", () => {
      document.getElementById.mockImplementation(() => null);
      expect(() => new ArithmeticCoercionDemo()).toThrow();
    });
  });

  describe("input validation", () => {
    test("should validate numerical input", () => {
      expect(() => demo.validateNumber("")).toThrow("Input value is required");
      expect(() => demo.validateNumber("abc")).toThrow(
        "Please enter a valid number"
      );
      expect(demo.validateNumber("123")).toBe("123");
      expect(demo.validateNumber("-12.34")).toBe("-12.34");
    });
  });

  describe("calculations", () => {
    test("should perform addition with type coercion", () => {
      mockElements.operator.value = "+";
      const result = demo.performCalculation("5", "3", "+");
      expect(result).toEqual({
        val1: "5",
        val2: "3",
        op: "+",
        nonCoerced: "53", // String concatenation
        coerced: 8, // Numeric addition
      });
    });

    test("should perform multiplication with type coercion", () => {
      mockElements.operator.value = "*";
      const result = demo.performCalculation("5", "3", "*");
      expect(result).toEqual({
        val1: "5",
        val2: "3",
        op: "*",
        nonCoerced: "5*3", // Show expression instead of attempting string multiplication
        coerced: 15, // Numeric multiplication
      });
    });

    test("should handle division by zero", () => {
      mockElements.operator.value = "/";
      const result = demo.performCalculation("5", "0", "/");
      expect(result.coerced).toBe(Infinity);
    });
  });

  describe("display", () => {
    test("should generate explanation for different operators", () => {
      const explanation = demo.getExplanation("+", "53", 8);
      expect(explanation).toContain("Type Coercion Explanation");
      expect(explanation).toContain("concatenates strings");
    });
  });

  describe("cleanup", () => {
    test("should remove event listeners and clear references", () => {
      const removeEventListener = jest.spyOn(
        demo.button,
        "removeEventListener"
      );
      demo.destroy();
      expect(removeEventListener).toHaveBeenCalled();
      expect(demo.button).toBeNull();
      expect(demo.form).toBeNull();
    });
  });
});
