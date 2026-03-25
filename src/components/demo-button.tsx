"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DemoButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDemo() {
    setLoading(true);
    const res = await fetch("/api/demo", { method: "POST" });
    const data = await res.json();
    if (data.success) {
      router.push("/dashboard");
    } else {
      setLoading(false);
      alert("Failed to load demo. Please try again.");
    }
  }

  return (
    <button
      onClick={handleDemo}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 border border-gray-300 font-medium px-6 py-3 rounded-lg hover:bg-gray-50 transition text-base disabled:opacity-50"
    >
      {loading ? "Loading demo..." : "View demo"}
    </button>
  );
}
