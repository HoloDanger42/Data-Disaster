/**
 * Demonstrates JavaScript mutable state and reference sharing behavior
 * @class MutableStateDemo
 */
export class MutableStateDemo {
  constructor() {
    this.handleMutationBound = this.handleMutation.bind(this);
    try {
      this.initElements();
      this.bindEvents();
    } catch (error) {
      console.error("Failed to initialize MutableStateDemo:", error);
      throw new Error("MutableStateDemo initialization failed");
    }
  }

  initElements() {
    this.button = document.getElementById("mutableButton");
    this.result = document.getElementById("mutableResult");
    this.arrayInput = document.getElementById("arrayInput");
    this.newItemInput = document.getElementById("newItemInput");
  }

  getElement(id) {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Element with id "${id}" not found`);
    return element;
  }

  bindEvents() {
    this.button.addEventListener("click", this.handleMutationBound);
  }

  setLoading(isLoading) {
    this.button.disabled = isLoading;
    this.button.innerHTML = isLoading
      ? '<span class="spinner-border spinner-border-sm"></span> Processing...'
      : "Mutate Array";
  }

  handleError(error) {
    this.display.innerHTML = `
        <div class="alert alert-danger">
          <strong>Error:</strong> ${this.sanitizeHTML(error.message)}
        </div>`;
  }

  sanitizeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  handleMutation() {
    try {
      this.setLoading(true);
      const initialArray = JSON.parse(this.arrayInput.value || '[1, 2, 3]');
      const newItem = JSON.parse(this.newItemInput.value || '4');
      
      const results = this.demonstrateMutation(initialArray, newItem);
      this.displayResults(results);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Demonstrates mutable vs immutable array operations
   * @returns {Object} State objects showing mutation effects
   */
  demonstrateMutation(initialArray, newItem) {
    // Mutable approach
    const shallowCopy = [...initialArray];
    shallowCopy.push(newItem);

    // Immutable approach
    const safeCopy = [...initialArray];
    const newArray = [...safeCopy, newItem];

    return {
      original: initialArray,
      mutable: shallowCopy,
      immutable: {
        original: safeCopy,
        new: newArray
      }
    };
  }

  /**
   * Displays the mutation demonstration results
   * @param {string} originalState - Initial array state
   * @param {string} mutatedState - State after mutation
   * @param {Object} immutableState - States from immutable updates
   */
  displayResults({ original, mutable, immutable }) {
    const html = `
      <h5>Mutation Comparison:</h5>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Operation</th>
            <th>Original Array</th>
            <th>Result Array</th>
            <th>Side Effects</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table-danger">
            <td><code>Mutable Update</code></td>
            <td>${JSON.stringify(original)}</td>
            <td>${JSON.stringify(mutable)}</td>
            <td>Original array modified</td>
          </tr>
          <tr class="table-success">
            <td><code>Immutable Update</code></td>
            <td>${JSON.stringify(immutable.original)}</td>
            <td>${JSON.stringify(immutable.new)}</td>
            <td>Original array preserved</td>
          </tr>
        </tbody>
      </table>
      <div class="alert alert-info mt-3">
        <h6>Key Takeaways:</h6>
        <ul>
          <li>Mutable operations modify the original array</li>
          <li>Immutable operations create new arrays</li>
          <li>Use spread operator [...] for safe copies</li>
          <li>Return new arrays instead of modifying existing ones</li>
        </ul>
      </div>`;

    this.result.innerHTML = html;
  }

  destroy() {
    this.button.removeEventListener("click", this.handleMutationBound);
    this.button = null;
    this.display = null;
  }
}

/**
 * TodoList class for demonstrating mutations
 * @class
 */
class TodoList {
  /**
   * Creates a new TodoList
   * @param {Array} items - Initial todo items
   */
  constructor(items = []) {
    this.items = items;
  }

  addItemMutable(item) {
    this.items.push(item);
    return this.items;
  }

  addItemImmutable(item) {
    return new TodoList([...this.items, item]);
  }
}
