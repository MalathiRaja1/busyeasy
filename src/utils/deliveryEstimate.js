export const getDeliveryEstimate = (stock) => {
  const today = new Date();

  if (stock > 20) {
    // High stock - fastest delivery
    const date = new Date(today);
    date.setDate(date.getDate() + 1);
    return {
      text: 'Get it tomorrow',
      dateText: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
      speed: 'fast',
    };
  } else if (stock > 5) {
    const date = new Date(today);
    date.setDate(date.getDate() + 2);
    return {
      text: 'Get it in 2 days',
      dateText: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
      speed: 'medium',
    };
  } else if (stock > 0) {
    const date = new Date(today);
    date.setDate(date.getDate() + 4);
    return {
      text: 'Get it in 3-4 days',
      dateText: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
      speed: 'slow',
    };
  }
  return null; // out of stock, no estimate
};