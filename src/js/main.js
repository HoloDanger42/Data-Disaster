import { TypeCoercionDemo } from "./demos/typeCoercion.js";
import { ArithmeticCoercionDemo } from "./demos/arithmeticCoercion.js";
import { MutableStateDemo } from "./demos/mutableState.js";
import { AsyncErrorDemo } from "./demos/asyncError.js";
import { ProgressTracker } from "./utils/progressTracker.js";

let demos = [];

document.addEventListener("DOMContentLoaded", () => {
  try {
    // Initialize progress tracker first
    const progressTracker = new ProgressTracker([
      "type-coercion",
      "mutable-state",
      "async-error",
    ]);

    // Initialize demos
    demos = [
      progressTracker,
      new TypeCoercionDemo(),
      new ArithmeticCoercionDemo(),
      new MutableStateDemo(),
      new AsyncErrorDemo(),
    ];
  } catch (error) {
    console.error("Failed to initialize demos:", error);
  }
});

// Cleanup on page unload
window.addEventListener("unload", () => {
  demos.forEach((demo) => {
    try {
      demo.destroy?.();
    } catch (error) {
      console.error(`Failed to cleanup demo:`, error);
    }
  });
  demos = [];
});
