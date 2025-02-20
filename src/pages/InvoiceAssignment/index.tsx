"use client";

import { useState, useCallback } from "react";
import { useInvoices } from "@/hooks/useInvoices";
import type { Invoice } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { convertAmount, formatCurrency } from "@/lib/utils";

import { ReceivedInvoicesTable } from "@/components/InvoiceAssignment/RecievedTable";
import { CreditNotesTable } from "@/components/InvoiceAssignment/CreditNoteTable";
import Summary from "@/components/InvoiceAssignment/Summary";
import { SuccessModal } from "@/components/InvoiceAssignment/SuccessModal";

export function InvoiceAssignment() {
  const { invoices, loading, error } = useInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedCreditNotes, setSelectedCreditNotes] = useState<Invoice[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInvoiceSelect = useCallback((invoice: Invoice) => {
    setSelectedInvoice((prev) => (prev?.id === invoice.id ? null : invoice));
    setSelectedCreditNotes([]);
  }, []);

  const handleCreditNoteSelect = useCallback((creditNote: Invoice) => {
    setSelectedCreditNotes((prev) =>
      prev.some((note) => note.id === creditNote.id)
        ? prev.filter((note) => note.id !== creditNote.id)
        : [...prev, creditNote]
    );
  }, []);

  const receivedInvoices = invoices.filter(
    (invoice) => invoice.type === "received"
  );
  const creditNotes = invoices.filter(
    (invoice) =>
      invoice.type === "credit_note" &&
      invoice.reference === selectedInvoice?.id
  );

  const handleAssign = () => {
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setSelectedInvoice(null);
    setSelectedCreditNotes([]);
  };

  const totalCreditAmount = selectedCreditNotes.reduce((sum, note) => {
    return (
      sum + convertAmount(note.amount, note.currency, selectedInvoice!.currency)
    );
  }, 0);

  const newInvoiceAmount = selectedInvoice
    ? selectedInvoice.amount - totalCreditAmount
    : 0;

  const getInvoiceNumber = (creditNote: Invoice) => {
    return (
      receivedInvoices.findIndex((inv) => inv.id === creditNote.reference) + 1
    );
  };

  if (loading) return <div className="text-center py-10">Cargando...</div>;

  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-50 shadow-lg">
        <CardHeader className="bg-blue-100">
          <CardTitle className="text-2xl font-bold text-blue-800">
            Asignación de Facturas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ReceivedInvoicesTable
            invoices={receivedInvoices}
            selectedInvoice={selectedInvoice}
            onSelectInvoice={handleInvoiceSelect}
          />

          {selectedInvoice && (
            <div className="mt-8 transition-all duration-300 ease-in-out">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                Seleccionar Notas de Crédito
              </h3>

              <CreditNotesTable
                creditNotes={creditNotes}
                selectedCreditNotes={selectedCreditNotes}
                onSelectCreditNote={handleCreditNoteSelect}
                getInvoiceNumber={getInvoiceNumber}
              />

              {selectedCreditNotes.length > 0 && (
                <Summary
                  selectedInvoice={selectedInvoice}
                  selectedCreditNotes={selectedCreditNotes}
                  totalCreditAmount={totalCreditAmount}
                  newInvoiceAmount={newInvoiceAmount}
                />
              )}

              <Button
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
                onClick={handleAssign}
                disabled={selectedCreditNotes.length === 0}
              >
                Asignar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <SuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        selectedInvoice={selectedInvoice}
        newInvoiceAmount={newInvoiceAmount}
        handleCloseModal={handleCloseModal}
        formatCurrency={formatCurrency}
      />
    </div>
  );
}
