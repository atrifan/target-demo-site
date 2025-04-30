export default function getMcId() {
  const visitor = window.Visitor?.getInstance(window.extension_data.org || "011B56B451AE49A90A490D4D@AdobeOrg", {
    trackingServer: window.extension_data.analyticsReportingServer || `${window.extension_data.tenant}.com.sc.omtrdc.net`,      // Replace with your tracking server
    trackingServerSecure: window.extension_data.analyticsReportingServer || `${window.extension_data.tenant}.com.ssl.sc.omtrdc.net`,  // Optional, for HTTPS
  });
  const mcId = visitor.getMarketingCloudVisitorID();
  console.log(mcId);
  return mcId;
}

export function getSdId() {
  const visitor = window.Visitor?.getInstance(window.extension_data.org || "011B56B451AE49A90A490D4D@AdobeOrg", {
    trackingServer: window.extension_data.analyticsReportingServer || `${window.extension_data.tenant}.com.sc.omtrdc.net`,      // Replace with your tracking server
    trackingServerSecure: window.extension_data.analyticsReportingServer || `${window.extension_data.tenant}.com.ssl.sc.omtrdc.net`,  // Optional, for HTTPS
  });
  const sdId = visitor.getSupplementalDataID();
  console.log(sdId);
  return sdId;
}

export function trackEvent(event: string, mcId: string, sdId: string = window.s.visitor.getSupplementalDataID(), obj: any = {}) {
  console.log(window.s.supplementalDataID);
  window.s.account = window.extension_data.reportSuite || "atetrifandemo";
  window.s.events = event;
  window.s.marketingCloudVisitorID = mcId;
  window.s.supplementalDataID = sdId;

  if (obj) {
    Object.keys(obj).forEach((key) => {
      window.s[key] = obj[key];
    });
  }

  window.s.t();
}