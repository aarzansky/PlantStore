import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ContactPage.css';

function ContactPage() {
  const contactMethods = [
    {
      icon: '✉️',
      label: 'Email',
      value: 'support@thesecretgarden.com',
      note: 'We usually reply within 24 hours.',
    },
    {
      icon: '📞',
      label: 'Phone',
      value: '+977 1-4123456',
      note: 'Sun–Fri, 9:00 AM – 6:00 PM',
    },
    {
      icon: '📍',
      label: 'Visit us',
      value: 'Jhamsikhel, Lalitpur, Nepal',
      note: 'Drop by our garden store in person.',
    },
    {
      icon: '💬',
      label: 'Social',
      value: '@thesecretgarden',
      note: 'Find us on Instagram and Facebook.',
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="contact-page">
        <div className="contact-header">
          <h1>Get in Touch</h1>
          <p>Have a question about an order, a plant, or anything else? Here's how to reach us.</p>
        </div>

        <div className="contact-grid">
          {contactMethods.map((method, i) => (
            <div className="contact-card" key={i}>
              <span className="contact-icon">{method.icon}</span>
              <h3>{method.label}</h3>
              <p className="contact-value">{method.value}</p>
              <p className="contact-note">{method.note}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ContactPage;
