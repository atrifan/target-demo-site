export default function Tracker(className: string, action: () => void) {
  const conversionElements = document.querySelectorAll('.conversion');
  conversionElements.forEach((element) => {
    element.addEventListener('click', action);
  });

  // Cleanup function to remove the event listener when the component is unmounted
  return () => {
    conversionElements.forEach((element) => {
      element.removeEventListener('click', action);
    });
  };
}

