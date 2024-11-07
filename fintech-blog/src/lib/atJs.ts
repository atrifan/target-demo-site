const clearAllCookies = () => {
  const cookies = document.cookie.split(";");

  cookies.forEach((cookie) => {
    console.log(cookie);
    const cookieName = cookie.split("=")[0].trim();
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
};
export default async function AtJs() {
  if (window.adobe && window.adobe.target) {
    window.adobe.target = undefined;
    clearAllCookies();
  }
  return new Promise((resolve, reject) => {
    if (!window.adobe || !window.adobe.target) {
      //get script element from head with id at-js
      const oldScript = document.getElementById("at-js");
      //if oldScript is present than delete it
      if (oldScript) {
        oldScript.remove();
      }
      const script = document.createElement('script');
      script.id="at-js";
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