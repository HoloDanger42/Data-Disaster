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

    // Convert to numbers immediately after validation
    const num1 = Number(originalVal1);
    const num2 = Number(originalVal2);
    const hadTypeCoercion = true; // Since inputs are always strings initially

    let result;
    let explanation = "";

    try {
      if (isNaN(num1) || isNaN(num2)) {
        throw new Error("One or more inputs is not a valid number");
      }

      switch (operator) {
        case "+":
          result = num1 + num2;
          break;
        case "-":
          result = num1 - num2;
          break;
        case "*":
          result = num1 * num2;
          break;
        case "/":
          result = num2 === 0 ? Infinity : num1 / num2;
          break;
        default:
          throw new Error("Invalid operator");
      }

      explanation = getExplanation(
        num1,
        num2,
        operator,
        result,
        originalVal1,
        originalVal2
      );
    } catch (error) {
      result = `Error: ${error.message}`;
      explanation = "";
    }

    arithmeticResult.innerHTML = `
      <h5>Arithmetic Results:</h5>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Expression</th>
            <th>Result</th>
            <th>Original Type</th>
            <th>Computed Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Value 1</code></td>
            <td>${originalVal1} → ${num1}</td>
            <td><span class="badge bg-secondary">string</span></td>
            <td><span class="badge bg-primary">number</span></td>
          </tr>
          <tr>
            <td><code>Value 2</code></td>
            <td>${originalVal2} → ${num2}</td>
            <td><span class="badge bg-secondary">string</span></td>
            <td><span class="badge bg-primary">number</span></td>
          </tr>
          <tr>
            <td><code>${num1} ${operator} ${num2}</code></td>
            <td>${result}</td>
            <td colspan="2"><span class="badge bg-secondary">${typeof result}</span></td>
          </tr>
        </tbody>
      </table>
      ${
        explanation
          ? `<div class="alert alert-info mt-3">${explanation}</div>`
          : ""
      }
    `;

    const rows = arithmeticResult.querySelectorAll("tbody tr");
    applyResultStyling(result, rows[2], hadTypeCoercion);
  });
});
