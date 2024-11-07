export default function getMcId() {
  const visitor = window.Visitor.getInstance("011B56B451AE49A90A490D4D@AdobeOrg", {
    trackingServer: "adobetargeteng.d1.sc.omtrdc.net",      // Replace with your tracking server
    trackingServerSecure: "adobetargeteng.d1.sc.omtrdc.net",  // Optional, for HTTPS
  });
  const mcId = visitor.getMarketingCloudVisitorID();
  console.log(mcId);
  return mcId;
}