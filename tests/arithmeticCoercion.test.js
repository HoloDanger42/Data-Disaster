import { ArithmeticCoercionDemo } from "../src/js/demos/arithmeticCoercion.js";
import { jest } from "@jest/globals";

describe("ArithmeticCoercionDemo", () => {
  let demo;
  let mockElements;

  afterEach(() => {
    if (demo) {
      demo.destroy();
      demo = null;
    }
    document.body.innerHTML = "";
    jest.restoreAllMocks();
  });

  describe("initialization", () => {
    test("should initialize successfully with all required elements", () => {
      // Set up DOM
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

      // Initialize demo
      demo = new ArithmeticCoercionDemo();
      expect(demo.form).toBeTruthy();
      expect(demo.result).toBeTruthy();
      expect(demo.button).toBeTruthy();
    });

    test("should throw error if form not found", () => {
      // Suppress console.error during this test
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Clear DOM to simulate missing form
      document.body.innerHTML = "";

      // Initialize demo and expect error
      expect(() => {
        new ArithmeticCoercionDemo();
      }).toThrow(/ArithmeticCoercionDemo initialization failed/);

      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  });

  describe("input validation", () => {
    beforeEach(() => {
      // Set up DOM
      document.body.innerHTML = `
        <form id="arithmeticForm">
          <div id="arithmeticResult"></div>
          <input id="arithmeticInput1" />
          <input id="arithmeticInput2" />
          <select id="arithmeticOperator">
            <option value="+">+</option>
          </select>
          <button id="arithmeticButton">Calculate</button>
        </form>
      `;
      demo = new ArithmeticCoercionDemo();
    });

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
    beforeEach(() => {
      // Set up DOM
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
      demo = new ArithmeticCoercionDemo();
    });

    test("should perform addition with type coercion", () => {
      const result = demo.performCalculation("5", "3", "+");
      expect(result).toEqual({
        val1: "5",
        val2: "3",
        op: "+",
        nonCoerced: "53",
        coerced: 8,
      });
    });

    test("should perform multiplication with type coercion", () => {
      const result = demo.performCalculation("5", "3", "*");
      expect(result).toEqual({
        val1: "5",
        val2: "3",
        op: "*",
        nonCoerced: "5*3",
        coerced: 15,
      });
    });

    test("should handle division by zero", () => {
      const result = demo.performCalculation("5", "0", "/");
      expect(result.coerced).toBe(Infinity);
    });
  });

  describe("display", () => {
    beforeEach(() => {
      // Set up DOM with all required elements
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
      demo = new ArithmeticCoercionDemo();
    });

    test("should generate explanation for different operators", () => {
      const explanation = demo.getExplanation("+", "53", 8);
      expect(explanation).toContain("Type Coercion Explanation");
      expect(explanation).toContain("concatenates strings");
    });
  });

  describe("cleanup", () => {
    beforeEach(() => {
      // Set up DOM with all required elements
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
      demo = new ArithmeticCoercionDemo();
    });

    test("should remove event listeners and clear references", () => {
      // Capture handleClick before destroying
      const handleClick = demo.handleClick;

      // Spy on removeEventListener
      const removeEventListenerSpy = jest.spyOn(
        demo.button,
        "removeEventListener"
      );

      // Call destroy method
      demo.destroy();

      // Assert removeEventListener was called with correct arguments
      expect(removeEventListenerSpy).toHaveBeenCalledWith("click", handleClick);
      expect(demo.button).toBeNull();
      expect(demo.form).toBeNull();
    });
  });
});
