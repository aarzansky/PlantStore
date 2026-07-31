import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './KhaltiCallbackPage.css';

// Khalti redirects here after the user pays (or cancels). The query string params
// (status, pidx, etc.) are NOT trusted on their own - we always re-check with our
// backend, which calls Khalti's lookup API before marking the order as paid.
function KhaltiCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [state, setState] = useState('checking'); // checking | success | pending | failed
  const [message, setMessage] = useState('');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const pidx = searchParams.get('pidx');

    // Khalti appends pidx, transaction_id, amount, status, etc. to this URL.
    // We only need pidx (and only for this one lookup) - strip the query
    // string from the address bar right away so none of that sits visible
    // in the browser header/history. replace: true avoids adding a back-
    // button entry for the "dirty" URL.
    navigate('/payment/khalti/callback', { replace: true });

    if (!pidx) {
      setState('failed');
      setMessage('Missing payment reference. If money was deducted, check My Orders before retrying.');
      return;
    }

    const verify = async () => {
      try {
        const response = await ordersAPI.verifyKhalti(pidx);
        const { order: verifiedOrder, khaltiStatus } = response.data;
        setOrder(verifiedOrder);

        if (khaltiStatus === 'Completed') {
          clearCart();
          setState('success');
        } else if (['Pending', 'Initiated'].includes(khaltiStatus)) {
          setState('pending');
          setMessage('Khalti is still processing this payment. Please check back in a moment.');
        } else {
          setState('failed');
          setMessage(`Payment was not completed (status: ${khaltiStatus}).`);
        }
      } catch (err) {
        setState('failed');
        setMessage(err.response?.data?.message || 'Could not verify the payment.');
      }
    };

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Navbar />
      <div className="khalti-callback-page">
        {state === 'checking' && (
          <div className="khalti-status">
            <div className="khalti-spinner" />
            <h2>Confirming your payment...</h2>
            <p>Please don't close this page.</p>
          </div>
        )}

        {state === 'success' && order && (
          <div className="khalti-status khalti-success">
            <h2>Payment successful 🎉</h2>
            <p>Your order {order.orderNumber} has been placed and paid via Khalti.</p>
            <button className="btn-primary" onClick={() => navigate(`/orders/${order._id}`)}>
              View Order
            </button>
          </div>
        )}

        {state === 'pending' && (
          <div className="khalti-status khalti-pending">
            <h2>Payment pending</h2>
            <p>{message}</p>
            <Link to="/orders" className="btn-primary">
              Check My Orders
            </Link>
          </div>
        )}

        {state === 'failed' && (
          <div className="khalti-status khalti-failed">
            <h2>Payment not completed</h2>
            <p>{message}</p>
            <div className="khalti-actions">
              <Link to="/checkout" className="btn-primary">
                Try Again
              </Link>
              <Link to="/cart">Back to Cart</Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default KhaltiCallbackPage;
