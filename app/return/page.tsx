"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

export default function Return() {
  const [status, setStatus] = useState(null);
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
        <p className="mb-10">
          Grazie! Ora hai diritto ad altre tre rigenerazioni. Per qualsiasi
          informazioni scrivi a{" "}
          <a href="mailto:cristina.luerti@gmail.com">cambusa@vercel.com</a>.
        </p>

        <Button center onClick={() => router.push("/")}>
          Genera un nuovo menu
        </Button>
      </section>
    );
  }

  return null;
}
