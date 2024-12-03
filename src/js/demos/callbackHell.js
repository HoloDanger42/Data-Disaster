export class CallbackHellDemo {
  constructor() {
    this.handleDemoBound = this.handleDemo.bind(this);
    try {
      this.initElements();
      this.bindEvents();
    } catch (error) {
      console.error("Failed to initialize CallbackHellDemo:", error);
      throw new Error("CallbackHellDemo initialization failed");
    }
  }

  initElements() {
    this.button = document.getElementById("callbackButton");
    this.result = document.getElementById("callbackResult");
  }

  bindEvents() {
    this.button.addEventListener("click", this.handleDemoBound);
  }

  setLoading(isLoading) {
    this.button.disabled = isLoading;
    this.button.innerHTML = isLoading
      ? '<span class="spinner-border spinner-border-sm"></span> Processing...'
      : "Run Tasks";
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

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async handleDemo() {
    try {
      this.setLoading(true);
      const results = await this.demonstrateTasks();
      this.displayResults(results);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setLoading(false);
    }
  }

  async demonstrateTasks() {
    // Track execution times for each approach
    const times = {
      callback: [],
      promise: [],
      async: []
    };

    // Callback approach
    const startCallback = Date.now();
    await new Promise(resolve => {
      setTimeout(() => {
        times.callback.push('First task: ' + (Date.now() - startCallback) + 'ms');
        setTimeout(() => {
          times.callback.push('Second task: ' + (Date.now() - startCallback) + 'ms');
          setTimeout(() => {
            times.callback.push('Third task: ' + (Date.now() - startCallback) + 'ms');
            resolve();
          }, 1000);
        }, 1000);
      }, 1000);
    });

    // Promise approach
    const startPromise = Date.now();
    await this.delay(1000)
      .then(() => {
        times.promise.push('First task: ' + (Date.now() - startPromise) + 'ms');
        return this.delay(1000);
      })
      .then(() => {
        times.promise.push('Second task: ' + (Date.now() - startPromise) + 'ms');
        return this.delay(1000);
      })
      .then(() => {
        times.promise.push('Third task: ' + (Date.now() - startPromise) + 'ms');
      });

    // Async/await approach
    const startAsync = Date.now();
    await this.delay(1000);
    times.async.push('First task: ' + (Date.now() - startAsync) + 'ms');
    await this.delay(1000);
    times.async.push('Second task: ' + (Date.now() - startAsync) + 'ms');
    await this.delay(1000);
    times.async.push('Third task: ' + (Date.now() - startAsync) + 'ms');

    return times;
  }

  displayResults(times) {
    const html = `
      <h5>Async Pattern Comparison:</h5>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Pattern</th>
            <th>Execution Timeline</th>
            <th>Code Style</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table-danger">
            <td><code>Callbacks</code></td>
            <td>${times.callback.join('<br>')}</td>
            <td>Nested, hard to follow</td>
          </tr>
          <tr class="table-warning">
            <td><code>Promises</code></td>
            <td>${times.promise.join('<br>')}</td>
            <td>Linear chains, better flow</td>
          </tr>
          <tr class="table-success">
            <td><code>Async/Await</code></td>
            <td>${times.async.join('<br>')}</td>
            <td>Clean, synchronous style</td>
          </tr>
        </tbody>
      </table>
      <div class="alert alert-info mt-3">
        <h6>Key Takeaways:</h6>
        <ul>
          <li>Callback nesting creates "pyramid of doom"</li>
          <li>Promises provide better error handling and chaining</li>
          <li>Async/await offers most readable solution</li>
          <li>All approaches complete in same time, just different syntax</li>
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