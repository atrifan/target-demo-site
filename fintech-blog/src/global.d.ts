declare global {
  interface Window {
    adobe: {
      target: {
        triggerView: (viewName: string) => void;
        getOffers: (params: {
          mbox: string; // The mbox name
          success: (offers: any) => void; // Success callback with the offers
          error: (error: any) => void; // Error callback
        }) => void; // Method to get offers
        applyOffers: (options: { offers: any }) => void; // Apply offers
        // Add other methods and properties you might need from Adobe Target
      };
      // Add other Adobe properties if necessary
    };
  }
}

export {};