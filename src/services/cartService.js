export const getCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product) => {
  const cart = getCart();
  const existingItem = cart.find((item) => item._id === product._id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
};

export const updateCartItem = (productId, quantity) => {
  const cart = getCart();

  const updatedCart = cart.map((item) =>
    item._id === productId ? { ...item, quantity } : item,
  );

  localStorage.setItem("cart", JSON.stringify(updatedCart));
};

export const removeCartItem = (productId) => {
  const cart = getCart();

  const updatedCart = cart.filter((item) => item._id !== productId);

  localStorage.setItem("cart", JSON.stringify(updatedCart));

  return updatedCart;
};

export const clearCart = () => {
  localStorage.removeItem("cart");
};
