export default function getMcId() {
  const visitor = window.Visitor?.getInstance("011B56B451AE49A90A490D4D@AdobeOrg", {
    trackingServer: "adobetargeteng.d1.sc.omtrdc.net",      // Replace with your tracking server
    trackingServerSecure: "adobetargeteng.d1.sc.omtrdc.net",  // Optional, for HTTPS
  });
  const mcId = visitor.getMarketingCloudVisitorID();
  console.log(mcId);
  return mcId;
}

export function getSdId() {
  const visitor = window.Visitor?.getInstance("011B56B451AE49A90A490D4D@AdobeOrg", {
    trackingServer: "adobetargeteng.d1.sc.omtrdc.net",      // Replace with your tracking server
    trackingServerSecure: "adobetargeteng.d1.sc.omtrdc.net",  // Optional, for HTTPS
  });
  const sdId = visitor.getSupplementalDataID();
  console.log(sdId);
  return sdId;
}

export function trackEvent(event: string, mcId: string, sdId: string = window.s.visitor.getSupplementalDataID()) {
  console.log(window.s.supplementalDataID);
  window.s.account = "atetrifandemo";
  window.s.events = event;
  window.s.marketingCloudVisitorID = mcId;
  window.s.supplementalDataID = sdId;
  window.s.t();
}