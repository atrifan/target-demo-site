export default async function AtJs() {
  if (window.adobe && window.adobe.target) {
    window.adobe.target = undefined;
  }
  return new Promise((resolve, reject) => {
    if (!window.adobe || !window.adobe.target) {
      const script = document.createElement('script');
      script.src = '/target-demo-site/at.js'; // Replace with actual path to at.js
      script.async = true;
      script.onload = () => {
        console.log("at.js loaded");
        resolve(true);

      };
      script.onerror = () => {
        console.error("Failed to load at.js");
        reject(false);
      };
      document.head.appendChild(script);
    }
  })
}