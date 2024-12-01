export const initiateCheckout = async () => {
  // Mock Stripe checkout for standalone mode
  alert('Stripe checkout disabled in standalone mode');
  return Promise.resolve();
};