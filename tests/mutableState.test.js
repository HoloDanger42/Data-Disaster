import { MutableStateDemo } from "../src/js/demos/mutableState.js";
import { jest } from "@jest/globals";

describe("MutableStateDemo", () => {
  let demo;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="mutableResult"></div>
      <input id="arrayInput" value="[1,2,3]" />
      <input id="newItemInput" value="4" />
      <button id="mutableButton">Mutate Array</button>
    `;
    demo = new MutableStateDemo();
  });

  afterEach(() => {
    if (demo) {
      demo.destroy();
    }
    document.body.innerHTML = "";
    jest.restoreAllMocks();
  });

  describe("initialization", () => {
    test("should initialize with required elements", () => {
      expect(demo.button).toBeTruthy();
      expect(demo.result).toBeTruthy();
      expect(demo.arrayInput).toBeTruthy();
      expect(demo.newItemInput).toBeTruthy();
    });

    test("should set accessibility attributes", () => {
      expect(demo.result.getAttribute("role")).toBe("region");
      expect(demo.result.getAttribute("aria-live")).toBe("polite");
      expect(demo.result.getAttribute("aria-atomic")).toBe("true");
      expect(demo.button.getAttribute("aria-label")).toBeTruthy();
    });
  });

  describe("array mutations", () => {
    test("should demonstrate mutable vs immutable operations", () => {
      const initial = [1, 2, 3];
      const newItem = 4;

      const result = demo.demonstrateMutation(initial, newItem);

      expect(result.original).toEqual([1, 2, 3]);
      expect(result.mutable).toEqual([1, 2, 3, 4]);
      expect(result.immutable.original).toEqual([1, 2, 3]);
      expect(result.immutable.new).toEqual([1, 2, 3, 4]);
    });

    test("should handle JSON parsing errors", () => {
      demo.arrayInput.value = "invalid json";
      demo.handleMutation();
      expect(demo.result.innerHTML).toContain("Error");
    });
  });

  describe("display", () => {
    test("should show mutation comparison table", () => {
      const results = {
        original: [1, 2],
        mutable: [1, 2, 3],
        immutable: {
          original: [1, 2],
          new: [1, 2, 3],
        },
      };

      demo.displayResults(results);

      expect(demo.result.innerHTML).toContain("Mutation Comparison");
      expect(demo.result.innerHTML).toContain("table-danger");
      expect(demo.result.innerHTML).toContain("table-success");
    });
  });

  describe("cleanup", () => {
    test("should remove event listeners and clear references", () => {
      const handler = demo.handleMutationBound;
      const removeEventListenerSpy = jest.spyOn(
        demo.button,
        "removeEventListener"
      );

      demo.destroy();

      expect(removeEventListenerSpy).toHaveBeenCalledWith("click", handler);
      expect(demo.button).toBeNull();
      expect(demo.display).toBeNull();
    });
  });
});
