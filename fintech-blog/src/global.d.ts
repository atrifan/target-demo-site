declare global {
  interface Window {
    targetPageParams: any,
    targetGlobalSettings: any;
    adobe: {
      target?: {
        triggerView: (viewName: string) => void;
        getOffers: (any) => Promise<any>; // Method to get offers
        applyOffers: (any) => void; // Apply offers
        init: () => void; // Initialize Adobe Target
        delivery: (options: { prefetch: { views: any[] } }) => void; // Method to send data to Adobe Target
        // Add other methods and properties you might need from Adobe Target
      };
      // Add other Adobe properties if necessary
    };
  }
}

export {};