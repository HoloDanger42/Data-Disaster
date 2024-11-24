// Type Coercion Demo
document.addEventListener("DOMContentLoaded", () => {
  // Comparison Demo
  const coercionButton = document.getElementById("coercionButton");
  const coercionResult = document.getElementById("coercionResult");

  coercionButton.addEventListener("click", () => {
    // Get raw input values and preserve type information
    const input1 = document.getElementById("coercionInput1");
    const input2 = document.getElementById("coercionInput2");

    // Try to parse val1 as a number if possible, otherwise indicate it couldn't be parsed
    const val1 = !isNaN(input1.value)
      ? Number(input1.value)
      : `${input1.value} (Could not be parsed as number)`;
    // Keep val2 as string if it has quotes, otherwise convert to number
    const val2 =
      input2.value.startsWith('"') && input2.value.endsWith('"')
        ? input2.value.slice(1, -1)
        : !isNaN(input2.value)
        ? Number(input2.value)
        : input2.value;

    // Perform comparisons
    const looseComparison = val1 == val2;
    const strictComparison = val1 === val2;

    coercionResult.innerHTML = `
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
                <tr>
                    <td><code>${
                      val1 instanceof Number || typeof val1 === "number"
                        ? val1
                        : `"${val1}"`
                    } == ${
      typeof val2 === "string" ? `"${val2}"` : val2
    } (Loose Comparison)</code></td>
                    <td>${looseComparison}</td>
                </tr>
                <tr>
                    <td><code>${
                      val1 instanceof Number || typeof val1 === "number"
                        ? val1
                        : `"${val1}"`
                    } === ${
      typeof val2 === "string" ? `"${val2}"` : val2
    } (Strict Comparison)</code></td>
                    <td>${strictComparison}</td>
                </tr>
                </tbody>
            </table>
        `;

    // Add visual indicators
    const rows = coercionResult.querySelectorAll("tr");

    // Reset classes first
    rows[2].className = "";
    rows[3].className = "";

    // Apply specific classes based on comparison results
    if (looseComparison && strictComparison) {
      rows[2].classList.add("table-success");
      rows[3].classList.add("table-success");
    } else if (looseComparison && !strictComparison) {
      rows[2].classList.add("table-warning");
      rows[3].classList.add("table-danger");
    } else {
      rows[2].classList.add("table-danger");
      rows[3].classList.add("table-danger");
    }

    // Show explanation when loose and strict comparisons differ
    if (looseComparison !== strictComparison) {
      coercionResult.insertAdjacentHTML(
        "beforeend",
        `
                <div class="alert alert-info mt-3">
                    <p>Notice: Loose comparison (==) returned ${looseComparison} while strict comparison (===) returned ${strictComparison}.</p>
                    <p>This is because loose comparison performs type coercion, while strict comparison checks both value and type.</p>
                </div>
            `
      );
    }
  });

  // Arithmetic Demo
  const arithmeticResult = document.getElementById("arithmeticResult");
  const arithmeticForm = document
    .querySelector("#arithmeticButton")
    .closest("form");

  function isValidNumber(value) {
    return /^-?\d*\.?\d*$/.test(value.trim());
  }

  function getExplanation(
    val1,
    val2,
    operator,
    result,
    originalVal1,
    originalVal2
  ) {
    const explanations = [];

    // Type coercion detection
    if (typeof originalVal1 === "string" && typeof originalVal2 === "string") {
      explanations.push(
        "Input values were automatically converted from strings to numbers for calculation."
      );
    }

    if (
      operator === "+" &&
      (typeof val1 === "string" || typeof val2 === "string")
    ) {
      explanations.push(
        "String concatenation would occur if values weren't converted to numbers first."
      );
    }

    if (operator === "/" && val2 === 0) {
      explanations.push(
        "Division by zero results in Infinity. This is a special numeric value in JavaScript."
      );
    }

    if (operator === "*" && (isNaN(val1) || isNaN(val2))) {
      explanations.push(
        "Multiplication with non-numbers results in NaN (Not a Number)."
      );
    }

    if (result === Infinity || result === -Infinity) {
      explanations.push(
        "Operation resulted in Infinity. This occurs when a number exceeds JavaScript's maximum number value."
      );
    }

    return explanations.join(" ");
  }

  function applyResultStyling(result, row, hadTypeCoercion) {
    row.className = "";

    if (hadTypeCoercion) {
      row.classList.add("table-warning");
    } else if (typeof result === "number" && !isNaN(result)) {
      row.classList.add("table-success");
    } else if (result && result.toString().startsWith("Error:")) {
      row.classList.add("table-danger");
    }
  }

  function getCoercionDemonstration(val1, val2, operator) {
    // Show what would happen without explicit conversion
    let nonCoercedResult;
    try {
      // Evaluate without Number() conversion
      switch (operator) {
        case "+":
          nonCoercedResult = val1 + val2; // String concatenation
          break;
        case "-":
          nonCoercedResult = val1 - val2; // Automatic number conversion
          break;
        case "*":
          nonCoercedResult = val1 * val2; // Automatic number conversion
          break;
        case "/":
          nonCoercedResult = val1 / val2; // Automatic number conversion
          break;
      }
    } catch (e) {
      nonCoercedResult = "Error";
    }
    return nonCoercedResult;
  }

  function getEnhancedExplanation(val1, val2, operator, coercedResult) {
    const explanations = [];

    if (operator === "+") {
      explanations.push(
        `Without explicit conversion: "${
          val1 + val2
        }" (string concatenation) vs 
         With Number() conversion: ${coercedResult} (numeric addition)`
      );
    } else {
      explanations.push(
        `JavaScript automatically coerces strings to numbers for ${operator} operations.
         The same result would occur with or without explicit Number() conversion.`
      );
    }

    return explanations.join(" ");
  }

  arithmeticForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const originalVal1 = document.getElementById("arithmeticInput1").value;
    const originalVal2 = document.getElementById("arithmeticInput2").value;
    const operator = document.getElementById("arithmeticOperator").value;

    if (!isValidNumber(originalVal1) || !isValidNumber(originalVal2)) {
      arithmeticResult.innerHTML = `
        <div class="alert alert-danger">
          Please enter valid numbers. Accepted format: digits, decimal point, negative sign.
        </div>
      `;
      return;
    }

    // Demonstrate coercion by showing both paths
    const nonCoercedResult = getCoercionDemonstration(
      originalVal1,
      originalVal2,
      operator
    );
    const num1 = Number(originalVal1);
    const num2 = Number(originalVal2);

    let coercedResult;
    try {
      switch (operator) {
        case "+":
          coercedResult = num1 + num2;
          break;
        case "-":
          coercedResult = num1 - num2;
          break;
        case "*":
          coercedResult = num1 * num2;
          break;
        case "/":
          coercedResult = num2 === 0 ? Infinity : num1 / num2;
          break;
        default:
          throw new Error("Invalid operator");
      }
    } catch (error) {
      coercedResult = `Error: ${error.message}`;
    }

    const explanation = getEnhancedExplanation(
      originalVal1,
      originalVal2,
      operator,
      nonCoercedResult,
      coercedResult
    );

    arithmeticResult.innerHTML = `
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
            <td><code>${originalVal1} ${operator} ${originalVal2}</code></td>
            <td>${nonCoercedResult}</td>
            <td><span class="badge bg-secondary">${typeof nonCoercedResult}</span></td>
          </tr>
          <tr class="table-info">
            <td>After Number() Conversion</td>
            <td><code>${num1} ${operator} ${num2}</code></td>
            <td>${coercedResult}</td>
            <td><span class="badge bg-primary">${typeof coercedResult}</span></td>
          </tr>
        </tbody>
      </table>
      <div class="alert alert-info mt-3">
        <h6>Type Coercion Explanation:</h6>
        ${explanation}
      </div>
    `;
  });

  // Mutable State Demo
  const mutableButton = document.getElementById("mutableButton");
  const stateDisplay = document.getElementById("stateDisplay");

  class TodoList {
    constructor(items = []) {
      this.items = items;
    }

    // Demonstrates mutation
    addItemMutable(item) {
      this.items.push(item);
      return this.items;
    }

    // Demonstrates immutable update
    addItemImmutable(item) {
      return new TodoList([...this.items, item]);
    }
  }

  mutableButton.addEventListener("click", () => {
    // Example 1: Reference Sharing
    const originalList = new TodoList([
      { id: 1, text: "Learn JavaScript" },
      { id: 2, text: "Build Project" },
    ]);

    // Show original state
    const originalState = JSON.stringify(originalList.items);

    // Demonstrate reference sharing
    const shallowCopy = originalList.items;
    shallowCopy.push({ id: 3, text: "New Task" });

    // Example 2: Immutable Update
    const safeList = new TodoList([
      { id: 1, text: "Learn JavaScript" },
      { id: 2, text: "Build Project" },
    ]);

    const updatedList = safeList.addItemImmutable({ id: 3, text: "New Task" });

    stateDisplay.innerHTML = `
    <div class="card mb-4">
      <div class="card-header bg-warning text-dark">
        <h6 class="mb-0">Reference Sharing (Mutable)</h6>
      </div>
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-4">
            <h6>Original State:</h6>
            <pre class="code-block"><code>${JSON.stringify(
              originalState,
              null,
              2
            )}</code></pre>
          </div>
          <div class="col-md-4">
            <h6>After Mutation:</h6>
            <pre class="code-block"><code>${JSON.stringify(
              originalList.items,
              null,
              2
            )}</code></pre>
          </div>
          <div class="col-md-4">
            <h6>Shallow Copy:</h6>
            <pre class="code-block"><code>${JSON.stringify(
              shallowCopy,
              null,
              2
            )}</code></pre>
          </div>
        </div>
        <div class="alert alert-warning">
          <i class="bi bi-exclamation-triangle"></i>Notice: Both arrays changed because they share the same reference!
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
            <pre class="code-block"><code>${JSON.stringify(
              safeList.items,
              null,
              2
            )}</code></pre>
          </div>
          <div class="col-md-6">
            <h6>Updated List:</h6>
            <pre class="code-block"><code>${JSON.stringify(
              updatedList.items,
              null,
              2
            )}</code></pre>
          </div>
        </div>
        <div class="alert alert-success">
          <i class="bi bi-check-circle"></i>Notice: Original list remains unchanged while new list contains the added item!
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
            <i class="bi bi-arrow-right"></i>Direct array/object mutations affect all references
          </li>
          <li class="list-group-item">
            <i class="bi bi-arrow-right"></i>Use spread operator or Object.assign() for shallow copies
          </li>
          <li class="list-group-item">
            <i class="bi bi-arrow-right"></i>Return new objects instead of mutating existing ones
          </li>
          <li class="list-group-item">
            <i class="bi bi-arrow-right"></i>Consider using immutable data structures for complex state
          </li>
        </ul>
      </div>
    </div>
  `;
  });

  // Async Error Demo
  const asyncButton = document.getElementById("asyncButton");
  const asyncResult = document.getElementById("asyncResult");
  const asyncError = document.getElementById("asyncError");

  // Simulate API calls with different outcomes
  async function fetchUserDate(shouldFail = false) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (shouldFail) throw new Error("Network error: Failed to fetch user data");
    return { id: 1, name: "John Doe" };
  }

  async function processUserData(data, shouldFail = false) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (shouldFail) throw new Error("Processing error: Invalid data format");
    return `Processed ${data.name}'s information`;
  }

  asyncButton.addEventListener("click", async () => {
    // Reset display state
    asyncResult.classList.add("d-none");
    asyncError.classList.add("d-none");
    asyncButton.disabled = true;

    try {
      // First attempt - will fail
      const userData = await fetchUserDate(true);
      const processed = await processUserData(userData);
      asyncResult.textContent = processed;
      asyncResult.classList.remove("d-none");
    } catch (error) {
      asyncError.innerHTML = `
  <strong>Original Error:</strong> ${error.message}<br>
  <small class="text-muted">Stack trace: ${error.stack
    .split("\n")
    .join("<br>")}</small>
`;
      asyncError.classList.remove("d-none");

      // Recovery attempt
      try {
        const userData = await fetchUserDate(false);
        const processed = await processUserData(userData);
        asyncResult.textContent = `Recovery successful: ${processed}`;
        asyncResult.classList.remove("d-none");
      } catch (error) {
        asyncError.textContent += "\nRecovery attempt also failed!";
      }
    } finally {
      asyncButton.disabled = false;
    }
  });

  // Update progress as user scrolls through sections
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          updateProgress(entry.target.id);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll("section[id]").forEach((section) => {
    observer.observe(section);
  });

  function updateProgress(sectionId) {
    const progressBar = document.querySelector(".progress-bar");
    const sections = ["type-coercion", "mutable-state", "async-error"];
    const currentIndex = sections.indexOf(sectionId);

    if (currentIndex !== -1) {
      const progress = ((currentIndex + 1) / sections.length) * 100;

      progressBar.style.width = `${progress}%`;
      progressBar.setAttribute("aria-valuenow", progress);
      progressBar.textContent = `${currentIndex + 1}/${sections.length}`;
    }
  }
});
