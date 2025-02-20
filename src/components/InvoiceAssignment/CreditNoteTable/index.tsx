import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Invoice } from "@/shared/types";
import { formatCurrency } from "@/lib/utils";

interface CreditNotesTableProps {
  creditNotes: Invoice[];
  selectedCreditNotes: Invoice[];
  onSelectCreditNote: (creditNote: Invoice) => void;
  getInvoiceNumber: (creditNote: Invoice) => number;
}

export function CreditNotesTable({
  creditNotes,
  selectedCreditNotes,
  onSelectCreditNote,
  getInvoiceNumber,
}: CreditNotesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-blue-50">
          <TableHead className="w-12 text-blue-700">#</TableHead>
          <TableHead className="text-blue-700">Organización</TableHead>
          <TableHead className="text-blue-700">Monto</TableHead>
          <TableHead className="text-blue-700">Factura Asociada</TableHead>
          <TableHead className="w-20 text-blue-700">Seleccionado</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {creditNotes.map((creditNote, index) => {
          const isSelected = selectedCreditNotes.some(
            (note) => note.id === creditNote.id
          );
          return (
            <TableRow
              key={creditNote.id}
              className={`cursor-pointer transition-colors ${
                isSelected ? "bg-blue-200" : "hover:bg-blue-100"
              }`}
              onClick={() => onSelectCreditNote(creditNote)}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{creditNote.organization_id}</TableCell>
              <TableCell>
                {formatCurrency(creditNote.amount, creditNote.currency)}
              </TableCell>
              <TableCell className="text-blue-600">
                #{getInvoiceNumber(creditNote)}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-blue-400 rounded-full flex items-center justify-center">
                    {isSelected && (
                      <div className="w-3 h-3 bg-blue-400 rounded-full" />
                    )}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
