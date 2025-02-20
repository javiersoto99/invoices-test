import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Invoice } from "@/shared/types";
import { formatCurrency } from "@/lib/utils";

interface ReceivedInvoicesTableProps {
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  onSelectInvoice: (invoice: Invoice) => void;
}

export function ReceivedInvoicesTable({
  invoices,
  selectedInvoice,
  onSelectInvoice,
}: ReceivedInvoicesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-blue-50">
          <TableHead className="w-12 text-blue-700">#</TableHead>
          <TableHead className="text-blue-700">Organización</TableHead>
          <TableHead className="text-blue-700">Monto</TableHead>
          <TableHead className="text-blue-700">Tipo</TableHead>
          <TableHead className="w-20 text-blue-700">Seleccionado</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {invoices.map((invoice, index) => (
          <TableRow
            key={invoice.id}
            className={`cursor-pointer transition-colors ${
              selectedInvoice?.id === invoice.id
                ? "bg-blue-200"
                : "hover:bg-blue-100"
            }`}
            onClick={() => onSelectInvoice(invoice)}
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
    </Table>
  );
}
