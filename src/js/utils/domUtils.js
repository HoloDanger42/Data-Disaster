/**
 * Utility class for DOM operations and UI state management
 * @class DOMUtils
 */
export class DOMUtils {
  /**
   * Safely gets an element by ID with error handling
   * @param {string} id - Element ID to find
   * @returns {HTMLElement} The found element
   * @throws {Error} If element not found
   */
  static getElement(id) {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Element with id "${id}" not found`);
    return element;
  }

  /**
   * Sanitizes HTML string to prevent XSS
   * @param {string} str - String to sanitize
   * @returns {string} Sanitized string
   */
  static sanitizeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Sets loading state on a button
   * @param {HTMLButtonElement} button - Button to update
   * @param {boolean} isLoading - Loading state
   * @param {string} defaultText - Original button text
   */
  static setLoading(button, isLoading, defaultText) {
    button.disabled = isLoading;
    button.innerHTML = isLoading
      ? '<span class="spinner-border spinner-border-sm"></span> Processing...'
      : defaultText;
  }

  /**
   * Displays error message in container
   * @param {HTMLElement} container - Error container
   * @param {Error} error - Error to display
   */
  static showError(container, error) {
    container.innerHTML = `
        <div class="alert alert-danger">
          <strong>Error:</strong> ${this.sanitizeHTML(error.message)}
        </div>`;
  }

  /**
   * Toggles element visibility
   * @param {HTMLElement} element - Element to toggle
   * @param {boolean} show - Whether to show element
   */
  static toggleVisibility(element, show) {
    element.classList.toggle("d-none", !show);
  }

  /**
   * Creates stack trace display
   * @param {Error} error - Error with stack trace
   * @returns {string} Formatted HTML
   */
  static formatStackTrace(error) {
    return `
        <strong>Original Error:</strong> ${this.sanitizeHTML(error.message)}<br>
        <small class="text-muted">Stack trace: ${this.sanitizeHTML(error.stack)
          .split("\n")
          .join("<br>")}</small>`;
  }
}
