declare global {
  interface Window {
    adobe: {
      target: {
        triggerView: (viewName: string) => void;
        // Add other methods and properties you might need from Adobe Target
      };
      // Add other Adobe properties if necessary
    };
  }
}

export {};