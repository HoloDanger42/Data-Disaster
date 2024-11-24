/**
 * Demonstrates JavaScript async error handling patterns
 * @class AsyncErrorDemo
 */
export class AsyncErrorDemo {
  constructor() {
    this.handleOperationBound = this.handleOperation.bind(this);
    try {
      this.initElements();
      this.bindEvents();
    } catch (error) {
      console.error("Failed to initialize AsyncErrorDemo:", error);
      throw new Error("AsyncErrorDemo initialization failed");
    }
  }

  initElements() {
    this.button = this.getElement("asyncButton");
    this.result = this.getElement("asyncResult");
    this.error = this.getElement("asyncError");
  }

  getElement(id) {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Element with id "${id}" not found`);
    return element;
  }

  bindEvents() {
    this.button.addEventListener("click", this.handleOperationBound);
  }

  setLoading(isLoading) {
    this.button.disabled = isLoading;
    this.button.innerHTML = isLoading
      ? '<span class="spinner-border spinner-border-sm"></span> Processing...'
      : "Trigger Async Operation";
  }

  handleError(error) {
    this.error.innerHTML = `
      <strong>Original Error:</strong> ${this.sanitizeHTML(error.message)}<br>
      <small class="text-muted">Stack trace: ${this.sanitizeHTML(error.stack)
        .split("\n")
        .join("<br>")}</small>`;
    this.error.classList.remove("d-none");
  }

  sanitizeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  async handleOperation() {
    this.resetDisplay();
    this.setLoading(true);

    try {
      const userData = await this.fetchUserData(true);
      const processed = await this.processUserData(userData);
      this.showResult(processed);
    } catch (error) {
      this.handleError(error);
      await this.attemptRecovery();
    } finally {
      this.setLoading(false);
    }
  }

  resetDisplay() {
    this.result.classList.add("d-none");
    this.error.classList.add("d-none");
  }

  async fetchUserData(shouldFail = false) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (shouldFail) throw new Error("Network error: Failed to fetch user data");
    return { id: 1, name: "John Doe" };
  }

  async processUserData(data, shouldFail = false) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (shouldFail) throw new Error("Processing error: Invalid data format");
    return `Processed ${data.name}'s information`;
  }

  showResult(message) {
    this.result.textContent = message;
    this.result.classList.remove("d-none");
  }

  async attemptRecovery() {
    try {
      const userData = await this.fetchUserData(false);
      const processed = await this.processUserData(userData);
      this.showResult(`Recovery successful: ${processed}`);
    } catch (error) {
      this.error.textContent += "\nRecovery attempt also failed!";
    }
  }

  destroy() {
    this.button.removeEventListener("click", this.handleOperationBound);
    this.button = null;
    this.result = null;
    this.error = null;
  }
}
