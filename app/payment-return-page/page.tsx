"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Toast from "@/components/Toast";
import { resetApiCallCount } from "@/app/api/actions"; // Assicurati che questa sia la path corretta
import { useRouter } from "next/navigation";

export default function PaymentReturnPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successPayment, setSuccessPayment] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchStripeState = async () => {
      return fetch(
        `/api/checkout-sessions?session_id=${searchParams.get("session_id")}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then(async (data) => {
          if (data.status === "complete") {
            try {
              await resetApiCallCount();
              console.log("API call count reset successfully");
              setSuccessPayment(true);
              router.refresh()
              setTimeout(() => router.push("/"), 2000); 
            } catch (e) {
              console.error(`Error resetting API call count: ${e}`);
            }
          } else {
            throw new Error("Pagamento non completato, riprova");
          }
        })
        .catch((error) => {
          console.error(error);
          setError(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    if (searchParams.get("session_id")) {
      fetchStripeState();
    }
  }, [searchParams]);

  return (
    <div className="return-page-container">
      {loading ? (
        <p>Il pagamento è in corso, per favore attendi...</p>
      ) : (
        <>
          {error && (
            <Toast
              message={error}
              type="error"
              onClose={() => setError(null)}
              showToast={!!error}
            />
          )}
          {successPayment && (
            <Toast
              message="Pagamento effettuato con successo!"
              type="success"
              onClose={() => setSuccessPayment(false)}
              showToast={successPayment}
            />
          )}

          {!error && !successPayment && (
            <p>Stiamo verificando il pagamento, per favore attendi...</p>
          )}
        </>
      )}
    </div>
  );
}
