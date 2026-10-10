import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, CircleAlert, LoaderCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function PaymentResult({ onClearCart }) {
  const [searchParams] = useSearchParams();
  const txRef = searchParams.get('tx_ref');
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState({ loading: true, error: '' });

  useEffect(() => {
    let active = true;

    async function verifyPayment() {
      if (!txRef) {
        setStatus({ loading: false, error: 'The payment reference is missing.' });
        return;
      }

      setStatus({ loading: true, error: '' });
      try {
        const response = await fetch(
          `${API_BASE_URL}/orders/payment/verify/${encodeURIComponent(txRef)}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
          },
        );
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Payment has not been confirmed.');
        }

        if (active) {
          onClearCart?.();
          setStatus({ loading: false, error: '', orderId: result.orderId });
        }
      } catch (error) {
        if (active) setStatus({ loading: false, error: error.message });
      }
    }

    verifyPayment();
    return () => { active = false; };
  }, [txRef, attempt, onClearCart]);

  return (
    <main className="container py-5" style={{ minHeight: '55vh' }}>
      <section className="card border-0 shadow-sm rounded-4 mx-auto text-center p-4 p-md-5" style={{ maxWidth: 620 }}>
        {status.loading ? (
          <>
            <LoaderCircle size={54} className="text-warning mx-auto mb-3" aria-hidden="true" />
            <h1 className="h3 fw-bold">Verifying your payment</h1>
            <p className="text-muted mb-0">Please wait while we confirm your payment with Chapa.</p>
          </>
        ) : status.error ? (
          <>
            <CircleAlert size={54} className="text-danger mx-auto mb-3" aria-hidden="true" />
            <h1 className="h3 fw-bold">Payment not confirmed yet</h1>
            <p className="text-muted">{status.error}</p>
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              <button type="button" className="btn btn-warning fw-semibold" onClick={() => setAttempt((value) => value + 1)}>
                Check Again
              </button>
              <Link className="btn btn-outline-dark" to="/cart">Return to Cart</Link>
            </div>
          </>
        ) : (
          <>
            <CheckCircle2 size={60} className="text-success mx-auto mb-3" aria-hidden="true" />
            <h1 className="h3 fw-bold">Order placed successfully!</h1>
            <p className="text-muted">Chapa confirmed your payment. Your order is saved to your account.</p>
            <p className="small text-muted">Order reference: {status.orderId}</p>
            <Link className="btn btn-warning fw-semibold align-self-center" to="/profile">
              View My Dashboard
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
