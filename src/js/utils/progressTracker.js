import { DOMUtils } from "./domUtils.js";

/**
 * Tracks progress through sections and updates progress bar
 * @class ProgressTracker
 */
export class ProgressTracker {
  /**
   * @param {string[]} sections - Array of section IDs to track
   */
  constructor(sections) {
    this.sections = sections;
    this.progressBar = DOMUtils.getElement("progress-bar");
    this.currentSection = 0;

    try {
      this.initObserver();
    } catch (error) {
      console.error("Failed to initialize ProgressTracker:", error);
      throw new Error("ProgressTracker initialization failed");
    }
  }

  /**
   * Initializes Intersection Observer for section tracking
   * @private
   */
  initObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.updateProgress(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll("section[id]").forEach((section) => {
      this.observer.observe(section);
    });
  }

  /**
   * Updates progress bar based on current section
   * @param {string} sectionId - ID of current visible section
   * @private
   */
  updateProgress(sectionId) {
    const currentIndex = this.sections.indexOf(sectionId);
    if (currentIndex !== -1) {
      const progress = ((currentIndex + 1) / this.sections.length) * 100;

      this.progressBar.style.width = `${progress}%`;
      this.progressBar.setAttribute("aria-valuenow", progress);
      this.progressBar.textContent = `${currentIndex + 1}/${
        this.sections.length
      }`;

      this.currentSection = currentIndex;
    }
  }

  /**
   * Cleanup resources
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.progressBar = null;
    this.sections = null;
  }
}
