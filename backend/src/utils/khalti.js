// Thin wrapper around Khalti's ePayment (KPG-2) API.
// Docs: https://docs.khalti.com/khalti-epayment/

const KHALTI_BASE_URL = process.env.KHALTI_BASE_URL || 'https://dev.khalti.com/api/v2';

const khaltiRequest = async (path, body) => {
  if (!process.env.KHALTI_SECRET_KEY) {
    throw new Error('KHALTI_SECRET_KEY is not set in the environment');
  }

  const response = await fetch(`${KHALTI_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.return_url?.[0] ||
      data?.amount?.[0] ||
      data?.error_key ||
      'Khalti request failed';
    const error = new Error(message);
    error.khaltiResponse = data;
    throw error;
  }

  return data;
};

// amount must be in paisa (Rs * 100)
const initiateKhaltiPayment = ({
  amount,
  purchaseOrderId,
  purchaseOrderName,
  returnUrl,
  websiteUrl,
  customerInfo,
}) => {
  return khaltiRequest('/epayment/initiate/', {
    return_url: returnUrl,
    website_url: websiteUrl,
    amount,
    purchase_order_id: purchaseOrderId,
    purchase_order_name: purchaseOrderName,
    customer_info: customerInfo,
  });
};

const lookupKhaltiPayment = (pidx) => {
  return khaltiRequest('/epayment/lookup/', { pidx });
};

module.exports = { initiateKhaltiPayment, lookupKhaltiPayment };
