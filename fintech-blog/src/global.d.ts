declare global {
  interface Window {
    targetPageParams: any,
    targetPageParamsAll: any,
    targetGlobalSettings: any;
    s: any;
    AppMeasurement: any;
    s_gi: (any) => void;
    adobe: {
      target?: {
        triggerView: (viewName: string) => void;
        getOffers: (any) => Promise<any>; // Method to get offers
        applyOffers: (any) => Promise<any>; // Apply offers
        trackEvent: (any) => void; // Track events
        init: () => void; // Initialize Adobe Target
        delivery: (options: { prefetch: { views: any[] } }) => void; // Method to send data to Adobe Target
        // Add other methods and properties you might need from Adobe Target
      };
      // Add other Adobe properties if necessary
    };
    Visitor?: {
      getInstance: (imsOrgId: string, config: any) => any;
    }
  }
}

export {};