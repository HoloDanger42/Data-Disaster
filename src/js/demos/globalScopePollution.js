/**
 * Demonstrates JavaScript global scope pollution and prevention
 * @class GlobalScopeDemo
 */
export class GlobalScopeDemo {
  constructor() {
    this.handleDemoBound = this.handleDemo.bind(this);
    try {
      this.initElements();
      this.bindEvents();
    } catch (error) {
      console.error("Failed to initialize GlobalScopeDemo:", error);
      throw new Error("GlobalScopeDemo initialization failed");
    }
  }

  initElements() {
    this.button = document.getElementById("globalScopeButton");
    this.result = document.getElementById("globalScopeResult");
  }

  bindEvents() {
    this.button.addEventListener("click", this.handleDemoBound);
  }

  setLoading(isLoading) {
    this.button.disabled = isLoading;
    this.button.innerHTML = isLoading
      ? '<span class="spinner-border spinner-border-sm"></span> Processing...'
      : "Run Demo";
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

  handleDemo() {
    try {
      this.setLoading(true);
      const results = this.demonstrateScoping();
      this.displayResults(results);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setLoading(false);
    }
  }

  demonstrateScoping() {
    // Global var example
    var globalCounter = 0;
    globalCounter++;
    const globalResult = globalCounter;

    // Block-scoped example
    let scopedCounter = 0;
    {
      let scopedCounter = 10; // New variable in block
    }
    const scopedResult = scopedCounter; // Still 0

    // Module pattern example
    const moduleExample = (() => {
      let privateCounter = 0;
      return {
        increment() {
          privateCounter++;
          return privateCounter;
        },
      };
    })();

    return {
      global: globalResult,
      scoped: scopedResult,
      module: moduleExample.increment(),
    };
  }

  displayResults({ global, scoped, module }) {
    const html = `
      <h5>Scope Behavior Demonstration:</h5>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Scope Type</th>
            <th>Value</th>
            <th>Explanation</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table-danger">
            <td><code>var (global)</code></td>
            <td>${global}</td>
            <td>Can be accessed and modified globally</td>
          </tr>
          <tr class="table-success">
            <td><code>let (block)</code></td>
            <td>${scoped}</td>
            <td>Maintains original value despite block reassignment</td>
          </tr>
          <tr class="table-success">
            <td><code>module pattern</code></td>
            <td>${module}</td>
            <td>Private variable protected by closure</td>
          </tr>
        </tbody>
      </table>
      <div class="alert alert-info mt-3">
        <h6>Key Takeaways:</h6>
        <ul>
          <li>Global variables (<code>var</code>) can be accidentally modified from anywhere</li>
          <li>Block-scoped variables (<code>let</code>) are protected from outside modification</li>
          <li>Module pattern provides true privacy through closures</li>
          <li>Use <code>let/const</code> and modules to prevent scope pollution</li>
        </ul>
      </div>`;

    this.result.innerHTML = html;
  }

  destroy() {
    if (this.button && this.handleDemoBound) {
      this.button.removeEventListener("click", this.handleDemoBound);
    }
    this.button = null;
    this.result = null;
  }
}
