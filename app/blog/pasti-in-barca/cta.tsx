"use client";

import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";

export const BlogCta = () => {
  const router = useRouter();
  return (
    <Button center onClick={() => router.push("/")}>
      Genera il menu!
    </Button>
  );
};
