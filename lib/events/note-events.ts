
export const triggerRandomNote = () => {
  // prevent spam (optional randomness control)
  if (Math.random() < 0.7) {
    window.dispatchEvent(new Event("show-random-note"));
  }
};