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
    this.button = this.getElement("mutableButton");
    this.display = this.getElement("stateDisplay");
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
      const { originalState, mutatedState, immutableState } =
        this.demonstrateMutation();
      this.displayResults(originalState, mutatedState, immutableState);
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
  demonstrateMutation() {
    const originalList = new TodoList([
      { id: 1, text: "Learn JavaScript" },
      { id: 2, text: "Build Project" },
    ]);

    const originalState = JSON.stringify(originalList.items, null, 2);
    const shallowCopy = originalList.items;
    shallowCopy.push({ id: 3, text: "New Task" });

    const safeList = new TodoList([...originalList.items]);
    const updatedList = safeList.addItemImmutable({
      id: 4,
      text: "Another Task",
    });

    return {
      originalState,
      mutatedState: JSON.stringify(originalList.items, null, 2),
      immutableState: {
        original: JSON.stringify(safeList.items, null, 2),
        updated: JSON.stringify(updatedList.items, null, 2),
      },
    };
  }

  /**
   * Displays the mutation demonstration results
   * @param {string} originalState - Initial array state
   * @param {string} mutatedState - State after mutation
   * @param {Object} immutableState - States from immutable updates
   */
  displayResults(originalState, mutatedState, immutableState) {
    const html = `
    <div class="card mb-4">
      <div class="card-header bg-warning text-dark">
        <h6 class="mb-0">Reference Sharing (Mutable)</h6>
      </div>
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-4">
            <h6>Original State:</h6>
            <pre class="code-block"><code>${originalState}</code></pre>
          </div>
          <div class="col-md-4">
            <h6>After Mutation:</h6>
            <pre class="code-block"><code>${mutatedState}</code></pre>
          </div>
          <div class="col-md-4">
            <h6>Shallow Copy:</h6>
            <pre class="code-block"><code>${mutatedState}</code></pre>
          </div>
        </div>
        <div class="alert alert-warning">
          <i class="bi bi-exclamation-triangle"></i> Notice: Both arrays changed because they share the same reference!
        </div>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-header bg-success text-white">
        <h6 class="mb-0">Immutable Update</h6>
      </div>
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-6">
            <h6>Original List:</h6>
            <pre class="code-block"><code>${immutableState.original}</code></pre>
          </div>
          <div class="col-md-6">
            <h6>Updated List:</h6>
            <pre class="code-block"><code>${immutableState.updated}</code></pre>
          </div>
        </div>
        <div class="alert alert-success">
          <i class="bi bi-check-circle"></i> Notice: Original list remains unchanged while new list contains the added item!
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header bg-info text-white">
        <h6 class="mb-0">Key Takeaways</h6>
      </div>
      <div class="card-body">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <i class="bi bi-arrow-right"></i> Direct array/object mutations affect all references
          </li>
          <li class="list-group-item">
            <i class="bi bi-arrow-right"></i> Use spread operator or Object.assign() for shallow copies
          </li>
          <li class="list-group-item">
            <i class="bi bi-arrow-right"></i> Return new objects instead of mutating existing ones
          </li>
          <li class="list-group-item">
            <i class="bi bi-arrow-right"></i> Consider using immutable data structures for complex state
          </li>
        </ul>
      </div>
    </div>`;

    this.display.innerHTML = html;
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
