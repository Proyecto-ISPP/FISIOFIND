import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutButton = () => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Llamada al endpoint de backend que crea la sesión de checkout
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
      });
      const data = await response.json();

      // Se espera que el endpoint retorne { id: 'session_id' }
      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({
        sessionId: data.id,
      });

      if (result.error) {
        // Manejar error, por ejemplo mostrar un mensaje
        console.error(result.error.message);
      }
    } catch (error) {
      console.error('Error al crear la sesión de pago:', error);
    }
    setLoading(false);
  };

  return (
    <button onClick={handleCheckout} disabled={loading}>
      {loading ? 'Procesando...' : 'Pagar'}
    </button>
  );
};

export default CheckoutButton;
