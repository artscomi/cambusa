"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Return() {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCheckout = async () => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const sessionId = urlParams.get("session_id");

      try {
        const res = await fetch(
          `/api/checkout_sessions?session_id=${sessionId}`,
          {
            method: "GET",
          }
        );

        if (!res.ok) {
          throw new Error("Network response was not ok: " + res.statusText);
        }

        const data = await res.json();
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      } catch (error) {
        console.error("Error fetching checkout session:", error);
      }
    };
    fetchCheckout();
  }, []);

  useEffect(() => {
    if (status === "complete") {
      const resetApiCallCount = async () => {
        const res = await fetch("/api/reset-api-call-count", {
          method: "POST",
        });
        if (res.ok) {
          console.log("API call count reset successfully");
        } else {
          console.error("Error resetting API call count:");
        }
      };

      resetApiCallCount();
    }
  }, [status]);

  useEffect(() => {
    if (status === "open") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "complete") {
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to{" "}
          {customerEmail}. If you have any questions, please email{" "}
          <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
      </section>
    );
  }

  return null;
}
