import React from 'react';

const Contact: React.FC = () => {
  return (
    <div>
      <h2>Get in Touch</h2>
      <p>Have questions or suggestions? Feel free to reach out!</p>
      <form>
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea placeholder="Your Message" required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default Contact;
