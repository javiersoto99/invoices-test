"use client";

import { useState, useCallback } from "react";
import { useInvoices } from "@/hooks/useInvoices";
import type { Invoice } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Summary from "@/components/InvoiceAssignment/Summary";
import { SuccessModal } from "@/components/InvoiceAssignment/SuccessModal";

import { formatCurrency } from "@/lib/utils";

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

  const totalCreditAmount = selectedCreditNotes.reduce(
    (sum, note) => sum + note.amount,
    0
  );
  const newInvoiceAmount = selectedInvoice
    ? selectedInvoice.amount - totalCreditAmount
    : 0;

  const getInvoiceNumber = (creditNote: Invoice) => {
    return (
      receivedInvoices.findIndex((inv) => inv.id === creditNote.reference) + 1
    );
  };

  const renderReceivedInvoices = () => (
    <TableBody>
      {receivedInvoices.map((invoice, index) => (
        <TableRow
          key={invoice.id}
          className={`cursor-pointer transition-colors ${
            selectedInvoice?.id === invoice.id
              ? "bg-blue-200"
              : "hover:bg-blue-100"
          }`}
          onClick={() => handleInvoiceSelect(invoice)}
        >
          <TableCell>{index + 1}</TableCell>
          <TableCell>{invoice.organization_id}</TableCell>
          <TableCell>
            {formatCurrency(invoice.amount, invoice.currency)}
          </TableCell>
          <TableCell>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Recibida
            </Badge>
          </TableCell>
          <TableCell className="text-center">
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-blue-400 rounded-full flex items-center justify-center">
                {selectedInvoice?.id === invoice.id && (
                  <div className="w-3 h-3 bg-blue-400 rounded-full" />
                )}
              </div>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );

  const renderCreditNotes = () => (
    <TableBody>
      {creditNotes.map((creditNote, index) => (
        <TableRow
          key={creditNote.id}
          className={`cursor-pointer transition-colors ${
            selectedCreditNotes.some((note) => note.id === creditNote.id)
              ? "bg-blue-200"
              : "hover:bg-blue-100"
          }`}
          onClick={() => handleCreditNoteSelect(creditNote)}
        >
          <TableCell>{index + 1}</TableCell>
          <TableCell>{creditNote.organization_id}</TableCell>
          <TableCell>
            {formatCurrency(creditNote.amount, creditNote.currency)}
          </TableCell>
          <TableCell className="text-blue-600">
            # {getInvoiceNumber(creditNote)}
          </TableCell>
          <TableCell className="text-center">
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-blue-400 rounded-full flex items-center justify-center">
                {selectedCreditNotes.some(
                  (note) => note.id === creditNote.id
                ) && <div className="w-3 h-3 bg-blue-400 rounded-full" />}
              </div>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );

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
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-50">
                <TableHead className="w-12 text-blue-700">#</TableHead>
                <TableHead className="text-blue-700">Organización</TableHead>
                <TableHead className="text-blue-700">Monto</TableHead>
                <TableHead className="text-blue-700">Tipo</TableHead>
                <TableHead className="w-20 text-blue-700">
                  Seleccionado
                </TableHead>
              </TableRow>
            </TableHeader>
            {renderReceivedInvoices()}
          </Table>

          {selectedInvoice && (
            <div className="mt-8 transition-all duration-300 ease-in-out">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                Seleccionar Notas de Crédito
              </h3>
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-50">
                    <TableHead className="w-12 text-blue-700">#</TableHead>
                    <TableHead className="text-blue-700">
                      Organización
                    </TableHead>
                    <TableHead className="text-blue-700">Monto</TableHead>
                    <TableHead className="text-blue-700">
                      Factura Asociada
                    </TableHead>
                    <TableHead className="w-20 text-blue-700">
                      Seleccionado
                    </TableHead>
                  </TableRow>
                </TableHeader>
                {renderCreditNotes()}
              </Table>

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
        formatCurrency={formatCurrency}
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
}
