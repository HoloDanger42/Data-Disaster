/**
 * Demonstrates JavaScript 'this' keyword behavior
 * @class ThisKeywordDemo
 */
export class ThisKeywordDemo {
  constructor() {
    this.handleDemoBound = this.handleDemo.bind(this);
    try {
      this.initElements();
      this.bindEvents();
    } catch (error) {
      console.error("Failed to initialize ThisKeywordDemo:", error);
      throw new Error("ThisKeywordDemo initialization failed");
    }
  }

  initElements() {
    this.button = document.getElementById("thisButton");
    this.result = document.getElementById("thisResult");
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
      const results = this.demonstrateThis();
      this.displayResults(results);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setLoading(false);
    }
  }

  demonstrateThis() {
    const regularObj = {
      name: "Alice",
      greet: function () {
        return `Hello, my name is ${
          this && this.name ? this.name : "&lt;no context&gt;"
        }`;
      },
    };

    const arrowObj = {
      name: "Bob",
      greet: () => {
        return `Hello, my name is ${arrowObj.name}`;
      },
    };

    return {
      regularDirect: regularObj.greet(),
      regularDetached: regularObj.greet.bind(undefined)(),
      arrowDirect: arrowObj.greet(),
      arrowDetached: arrowObj.greet.bind(undefined)(),
    };
  }

  displayResults({
    regularDirect,
    regularDetached,
    arrowDirect,
    arrowDetached,
  }) {
    const html = `
      <h5>This Keyword Behavior:</h5>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Method Type</th>
            <th>Direct Call</th>
            <th>Detached Call</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Regular Function</code></td>
            <td class="table-success">${regularDirect}</td>
            <td class="table-danger">${regularDetached}</td>
          </tr>
          <tr>
            <td><code>Arrow Function</code></td>
            <td class="table-success">${arrowDirect}</td>
            <td class="table-success">${arrowDetached}</td>
          </tr>
        </tbody>
      </table>
      <div class="alert alert-info mt-3">
        <h6>Key Takeaways:</h6>
        <ul>
          <li>Regular functions: 'this' depends on how the function is called</li>
          <li>Arrow functions: 'this' is lexically scoped (captured from surrounding context)</li>
          <li>Detached regular functions lose their 'this' binding</li>
          <li>Arrow functions maintain their 'this' value even when detached</li>
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
