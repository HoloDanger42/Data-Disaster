/**
 * Demonstrates JavaScript type coercion behavior
 * @class TypeCoercionDemo
 */
export class TypeCoercionDemo {
  constructor() {
    this.handleComparisonBound = this.handleComparison.bind(this);
    try {
      this.initElements();
      this.bindEvents();
    } catch (error) {
      console.error("Failed to initialize TypeCoercionDemo:", error);
      throw new Error("TypeCoercionDemo initialization failed");
    }
  }

  initElements() {
    this.button = document.getElementById("coercionButton");
    this.result = document.getElementById("coercionResult");
    this.input1 = document.getElementById("coercionInput1");
    this.input2 = document.getElementById("coercionInput2");
  }

  getElement(id) {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Element with id "${id}" not found`);
    return element;
  }

  bindEvents() {
    this.button.addEventListener("click", this.handleComparisonBound);
  }

  setLoading(isLoading) {
    this.button.disabled = isLoading;
    this.button.innerHTML = isLoading
      ? '<span class="spinner-border spinner-border-sm"></span> Processing...'
      : "Compare Values";
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

  validateInput(value) {
    if (!value) throw new Error("Input value is required");
    if (value.length > 100) throw new Error("Input too long (max 100 chars)");
    return value;
  }

  handleComparison() {
    try {
      const val1 = this.parseValue(this.validateInput(this.input1.value));
      const val2 = this.parseValue(
        this.validateInput(this.validateInput(this.input2.value))
      );

      const results = this.compareValues(val1, val2);
      this.displayResults(results);
    } catch (error) {
      this.handleError(error);
    }
  }

  parseValue(value) {
    if (!value) return value;
    return value.startsWith('"') && value.endsWith('"')
      ? value.slice(1, -1)
      : !isNaN(value)
      ? Number(value)
      : value;
  }

  compareValues(val1, val2) {
    return {
      val1,
      val2,
      loose: val1 == val2,
      strict: val1 === val2,
    };
  }

  displayResults({ val1, val2, loose, strict }) {
    // Build table HTML
    const html = `
      <h5>Comparison Results:</h5>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Expression</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Value 1</code></td>
            <td>${val1} (${typeof val1})</td>
          </tr>
          <tr>
            <td><code>Value 2</code></td>
            <td>${val2} (${typeof val2})</td>
          </tr>
          <tr class="${
            loose && strict
              ? "table-success"
              : loose
              ? "table-warning"
              : "table-danger"
          }">
            <td><code>${this.formatValue(val1)} == ${this.formatValue(
      val2
    )} (Loose)</code></td>
            <td>${loose}</td>
          </tr>
          <tr class="${loose && strict ? "table-success" : "table-danger"}">
            <td><code>${this.formatValue(val1)} === ${this.formatValue(
      val2
    )} (Strict)</code></td>
            <td>${strict}</td>
          </tr>
        </tbody>
      </table>
      ${this.getExplanation(loose, strict)}`;

    this.result.innerHTML = html;
  }

  formatValue(val) {
    return val instanceof Number || typeof val === "number" ? val : `"${val}"`;
  }

  getExplanation(loose, strict) {
    return loose !== strict
      ? `
      <div class="alert alert-info mt-3">
        <p>Notice: Loose comparison (==) returned ${loose} while strict comparison (===) returned ${strict}.</p>
        <p>This is because loose comparison performs type coercion, while strict comparison checks both value and type.</p>
      </div>`
      : "";
  }

  destroy() {
    this.button.removeEventListener("click", this.handleComparisonBound);
    this.button = null;
    this.result = null;
    this.input1 = null;
    this.input2 = null;
  }
}
