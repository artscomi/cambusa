import { DialogStripe } from "@/components/ui/dialogs/Stripe";
import { createContext, useContext, useState, ReactNode } from "react";

interface StripeModalContextProps {
  isDialogStripeOpen: boolean;
  openDialogStripe: () => void;
  closeDialogStripe: () => void;
}

const StripeModalContext = createContext<StripeModalContextProps | undefined>(undefined);

export const StripeModalProvider = ({ children }: { children: ReactNode }) => {
  const [isDialogStripeOpen, setIsDialogStripeOpen] = useState(false);

  const openDialogStripe = () => {
    setIsDialogStripeOpen(true);
  };

  const closeDialogStripe = () => {
    setIsDialogStripeOpen(false);
  };

  return (
    <StripeModalContext.Provider value={{ isDialogStripeOpen, openDialogStripe, closeDialogStripe }}>
      {children}
      <DialogStripe
        isOpen={isDialogStripeOpen}
        setIsOpen={setIsDialogStripeOpen}
      />
    </StripeModalContext.Provider>
  );
};

export const useStripeModal = () => {
  const context = useContext(StripeModalContext);
  if (!context) {
    throw new Error("useStripeModal must be used within a StripeModalProvider");
  }
  return context;
};
