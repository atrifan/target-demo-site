import React, { useEffect } from 'react';

const Contact: React.FC = () => {
  useEffect(() => {
    if (window.adobe && window.adobe.target) {
      window.adobe.target.triggerView('contact');
    }
  }, []);
  return (
    <main>
      <h2>Get in Touch</h2>
      <p>Have questions or suggestions? Feel free to reach out!</p>
      <form>
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea placeholder="Your Message" required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </main>
  );
};

export default Contact;
