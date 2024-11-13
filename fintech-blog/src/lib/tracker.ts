export default function Tracker(className: string, action: () => void) {
  const conversionElements = document.querySelectorAll(className);

  conversionElements.forEach((element) => {
    const handleClick = (event: Event) => {
      const target = event.currentTarget as HTMLDivElement;

      action(); // Trigger the provided action

      // Add a class to style as "clicked"
      target.classList.add('clicked');

      // Remove the click event listener to prevent further clicks
      element.removeEventListener('click', handleClick);
    };

    // Add the click event listener to each element
    element.addEventListener('click', handleClick);
  });

  // Cleanup function to remove event listeners when the component is unmounted
  return () => {
    conversionElements.forEach((element) => {
      element.replaceWith(element.cloneNode(true)); // Removes event listeners by replacing nodes
    });
  };
}