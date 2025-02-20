import React from "react";
import { Invoice } from "@/shared/types";
import { formatCurrency } from "@/lib/utils";

interface SummaryProps {
  selectedInvoice: Invoice | null;
  selectedCreditNotes: Invoice[];
  totalCreditAmount: number;
  newInvoiceAmount: number;
}

const Summary = ({
  selectedInvoice,
  selectedCreditNotes,
  totalCreditAmount,
  newInvoiceAmount,
}: SummaryProps) => {
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg shadow-md transition-all duration-300 ease-in-out">
      <h4 className="font-semibold text-lg text-blue-800 mb-2">
        Resumen de Asignación
      </h4>
      <p className="text-blue-700">
        Factura:{" "}
        {selectedInvoice &&
          formatCurrency(selectedInvoice.amount, selectedInvoice.currency)}
      </p>
      <p className="text-blue-700">Notas de Crédito Seleccionadas:</p>
      <ul className="list-disc list-inside pl-4 text-blue-700">
        {selectedCreditNotes.map((note) => (
          <li key={note.id}>{formatCurrency(note.amount, note.currency)}</li>
        ))}
      </ul>
      <p className="text-blue-700">
        Total Notas de Crédito:{" "}
        {formatCurrency(totalCreditAmount, selectedInvoice?.currency || "")}
      </p>
      <p className="font-bold text-blue-900">
        Nuevo Monto de Factura:{" "}
        {selectedInvoice &&
          formatCurrency(newInvoiceAmount, selectedInvoice.currency)}
      </p>
    </div>
  );
};

export default Summary;
