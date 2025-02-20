import { useState, useEffect } from "react";
import { Invoice } from "@/shared/types";

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const response = await fetch(
          "https://recruiting.api.bemmbo.com/invoices/pending"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch invoices");
        }
        const data = await response.json();
        setInvoices(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setLoading(false);
      }
    }

    fetchInvoices();
  }, []);

  return { invoices, loading, error };
}
