import { useState } from 'react';
import toast from 'react-hot-toast';

function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Currently just a UI confirmation - can be wired to a backend endpoint or email service later
    toast.success('Message sent! We\'ll get back to you soon.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="legal-page">
      <h1>Contact Us</h1>
      <p>Have a question or need help with an order? Reach out to us below.</p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Your Email" value={form.email} onChange={handleChange} required />
        <textarea name="message" placeholder="Your Message" rows={5} value={form.message} onChange={handleChange} required />
        <button type="submit">Send Message</button>
      </form>

      <div className="contact-info">
        <p>📧 support@buyeasy.com</p>
        <p>📞 +91 90874 47567</p>
      </div>
    </div>
  );
}

export default ContactUs;