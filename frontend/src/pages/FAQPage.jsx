import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './FAQPage.css';

function FAQPage() {
  const faqs = [
    {
      q: 'How long does shipping take?',
      a: 'Most orders within the valley arrive in 1-3 business days. Orders outside the valley may take 3-5 business days depending on your location.',
    },
    {
      q: 'Can I cancel or change my order?',
      a: "Yes. You can cancel an order from the My Orders page as long as it's still Pending or Processing. Once it ships, we're no longer able to cancel it.",
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We currently support Cash on Delivery and Khalti. You can choose your preferred method at checkout.',
    },
    {
      q: 'Do you offer a plant health guarantee?',
      a: 'Yes. If a plant arrives damaged or unhealthy, contact us within 48 hours of delivery with a photo and we\u2019ll arrange a replacement or refund.',
    },
    {
      q: 'How do I know which plant is right for my space?',
      a: 'Check the light and care details on each plant\u2019s product page, or visit our Plant Care and User Guides pages for tips on matching plants to your space.',
    },
    {
      q: 'Do you ship internationally?',
      a: 'Not yet - we currently deliver within Nepal only. We\u2019re hoping to expand shipping in the future.',
    },
    {
      q: 'How can I track my order?',
      a: 'Once you\u2019re signed in, head to My Orders to see the live status of every order you\u2019ve placed, from Pending through to Delivered.',
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="faq-page">
        <div className="faq-header">
          <h1>Frequently Asked Questions</h1>
          <p>Answers to the questions we hear most often. Can't find what you need? Reach out on our Contact page.</p>
        </div>

        <div className="faq-list">
          {faqs.map((item, i) => (
            <details className="faq-item" key={i}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default FAQPage;
