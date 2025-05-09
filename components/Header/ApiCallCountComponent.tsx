"use client";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import Toast from "../Toast";
import { useStripeModal } from "@/context/useStripeModalContext";

export const ApiCallCountComponent = ({
  aiCallLeft,
}: {
  aiCallLeft: number;
}) => {
  const [showToast, setShowToast] = useState(false);
  const { openDialogStripe } = useStripeModal();
  const handleIconClick = () => {
    if (aiCallLeft > 0) {
      setShowToast(true);
    } else {
      openDialogStripe();
    }
  };
  return (
    <>
      <li className="text-center" onClick={handleIconClick}>
        <strong>{aiCallLeft}</strong>
        <i className="inline-block align-middle ml-2">
          <RefreshCcw width={25} />
        </i>
      </li>
      <Toast
        message={`Hai a disposizione ancora ${aiCallLeft} rigenerazioni del menu`}
        type="info"
        onClose={() => setShowToast(false)}
        showToast={showToast}
      />
    </>
  );
};
