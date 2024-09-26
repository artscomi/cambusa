import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";
import React, { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { resetApiCallCount } from "@/app/api/actions";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const DialogStripe: React.FC<Props> = ({ isOpen, setIsOpen }) => {
  const fetchClientSecret = useCallback(() => {
    return fetch("/api/checkout-sessions", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  const onComplete = useCallback(async () => {
    try {
      await resetApiCallCount();
      console.log("API call count reset successfully");
      setTimeout(() => setIsOpen(false), 4000);
    } catch (error) {
      console.error("Error resetting API call count:");
    }
  }, []);

  const options = { fetchClientSecret, onComplete };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hai raggiunto il limite di rigenerazioni</DialogTitle>
          <DialogDescription>Compra altre 5 rigenerazioni</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-auto">
          <div id="checkout">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
