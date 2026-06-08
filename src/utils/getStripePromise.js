import { loadStripe } from "@stripe/stripe-js";
import { getStripeConfig } from "../services/adminService";

export const getStripePromise = async () => {
  const publishableKey = await getStripeConfig();

  return loadStripe(publishableKey);
};
