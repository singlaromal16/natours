import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(process.env.STRIPE_PUBLIC_KEY);

export const bookTour = async (tourId) => {
  //1) Get the session from the server
  console.log(tourId);
  try {
    const session = await axios({
      method: 'GET',
      url: `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`,
    });

    console.log('Session = ', session);

    //2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('Error', err);
  }
};
