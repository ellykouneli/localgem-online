"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function SupabaseCheck() {
  const [message, setMessage] = useState("Checking Supabase...");

  useEffect(() => {
    const checkConnection = async () => {
      const { data, error } = await supabase
        .from("hidden_gems")
        .select("*")
        .limit(1);

      if (error) {
        setMessage(`❌ Error: ${error.message}`);
      } else {
        setMessage(
          `✅ Connected! Found ${data?.length ?? 0} rows in "hidden_gems".`
        );
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="p-4 rounded-lg border bg-gray-50">
      <p className="font-mono text-sm">{message}</p>
    </div>
  );
}
