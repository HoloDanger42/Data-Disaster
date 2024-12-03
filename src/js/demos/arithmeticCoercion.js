/**
 * Demonstrates JavaScript arithmetic type coercion behavior
 * @class ArithmeticCoercionDemo
 */
export class ArithmeticCoercionDemo {
  constructor() {
    try {
      this.initElements();
      this.bindEvents();
    } catch (error) {
      console.error("Failed to initialize ArithmeticCoercionDemo:", error);
      throw new Error("ArithmeticCoercionDemo initialization failed");
    }
  }

  initElements() {
    this.form = document.getElementById("arithmeticForm");
    this.result = document.getElementById("arithmeticResult");
    this.input1 = document.getElementById("arithmeticInput1");
    this.input2 = document.getElementById("arithmeticInput2");
    this.operator = document.getElementById("arithmeticOperator");
    this.button = document.getElementById("arithmeticButton");

    if (!this.form) throw new Error("Arithmetic form not found");

    // Add accessibility attributes
    this.form.setAttribute(
      "aria-label",
      "Arithmetic type coercion demonstration"
    );
    this.result.setAttribute("role", "region");
    this.result.setAttribute("aria-live", "polite");
    this.result.setAttribute("aria-atomic", "true");

    // Add descriptive labels
    this.input1.setAttribute("aria-describedby", "arithmeticInput1Help");
    this.input2.setAttribute("aria-describedby", "arithmeticInput2Help");
    this.operator.setAttribute("aria-label", "Arithmetic operator");

    // Add keyboard support for button
    this.button.setAttribute("role", "button");
    this.button.setAttribute(
      "aria-label",
      "Calculate and demonstrate type coercion"
    );
  }

  bindEvents() {
    this.handleClick = (e) => {
      e.preventDefault();
      this.handleCalculation();
    };

    if (!this.button) {
      console.error("Button not found for event binding");
      return;
    }

    this.button.addEventListener("click", this.handleClick);
  }

  setLoading(isLoading) {
    this.button.disabled = isLoading;
    this.button.innerHTML = isLoading
      ? '<span class="spinner-border spinner-border-sm"></span> Processing...'
      : "Calculate";
  }

  handleError(error) {
    this.result.innerHTML = `
      <div class="alert alert-danger">
        <strong>Error:</strong> ${this.sanitizeHTML(error.message)}
      </div>`;
  }

  sanitizeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  validateNumber(value) {
    if (!value) throw new Error("Input value is required");
    if (!/^-?\d*\.?\d*$/.test(value.trim())) {
      throw new Error("Please enter a valid number");
    }
    return value;
  }

  getElement(id) {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Element with id "${id}" not found`);
    return element;
  }

  handleCalculation() {
    try {
      this.setLoading(true);
      const val1 = this.validateNumber(this.input1.value);
      const val2 = this.validateNumber(this.input2.value);
      const op = this.operator.value;

      const results = this.performCalculation(val1, val2, op);
      this.displayResults(results);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setLoading(false);
    }
  }

  performCalculation(val1, val2, op = "+") {
    try {
      const num1 = Number(val1);
      const num2 = Number(val2);

      // Validate operator
      if (!["+", "-", "*", "/"].includes(op)) {
        throw new Error("Invalid operator");
      }

      let nonCoerced;
      // Handle string operations differently based on operator
      if (op === "+") {
        nonCoerced = `${val1}${val2}`; // String concatenation
      } else {
        nonCoerced = String(val1) + op + String(val2); // Show expression
      }

      let coerced;
      switch (op) {
        case "+":
          coerced = num1 + num2;
          break;
        case "-":
          coerced = num1 - num2;
          break;
        case "*":
          coerced = num1 * num2;
          break;
        case "/":
          coerced = num2 === 0 ? Infinity : num1 / num2;
          break;
        default:
          throw new Error("Invalid operator");
      }

      return { val1, val2, op, nonCoerced, coerced };
    } catch (error) {
      console.error("Calculation error:", error);
      throw error;
    }
  }

  displayResults({ val1, val2, op, nonCoerced, coerced }) {
    const html = `
      <h5>Type Coercion Demonstration:</h5>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Stage</th>
            <th>Expression</th>
            <th>Result</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table-warning">
            <td>Original Input</td>
            <td><code>${val1} ${op} ${val2}</code></td>
            <td>${nonCoerced}</td>
            <td><span class="badge bg-secondary">${typeof nonCoerced}</span></td>
          </tr>
          <tr class="table-info">
            <td>After Number() Conversion</td>
            <td><code>${Number(val1)} ${op} ${Number(val2)}</code></td>
            <td>${coerced}</td>
            <td><span class="badge bg-primary">${typeof coerced}</span></td>
          </tr>
        </tbody>
      </table>
      ${this.getExplanation(op, nonCoerced, coerced)}`;

    this.result.innerHTML = html;
  }

  getExplanation(op, nonCoerced, coerced) {
    const explanations = {
      "+": "concatenates strings when using + with strings, but adds numbers after Number() conversion",
      "-": "coerces strings to numbers when using - operator since subtraction only works with numbers",
      "*": "coerces strings to numbers when using * operator since multiplication only works with numbers",
      "/": "coerces strings to numbers when using / operator since division only works with numbers",
    };

    return `
      <div class="alert alert-info mt-3">
        <h6>Type Coercion Explanation:</h6>
        <p>Without Number() conversion: "${nonCoerced}" (${typeof nonCoerced})</p>
        <p>With Number() conversion: ${coerced} (${typeof coerced})</p>
        <p>Notice how JavaScript ${explanations[op]}</p>
      </div>`;
  }

  destroy() {
    if (this.button && this.handleClick) {
      this.button.removeEventListener("click", this.handleClick);
    }
    this.button = null;
    this.handleClick = null;
    this.form = null;
    this.result = null;
    this.input1 = null;
    this.input2 = null;
    this.operator = null;
    this.handleSubmit = null;
  }
}
