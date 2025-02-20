import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Invoice } from "@/shared/types";

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedInvoice: Invoice | null;
  newInvoiceAmount: number;
  formatCurrency: (amount: number, currency: string) => string;
  handleCloseModal: () => void;
}

export function SuccessModal({
  open,
  onOpenChange,
  selectedInvoice,
  newInvoiceAmount,
  formatCurrency,
  handleCloseModal,
}: SuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-800">
            Asignación Exitosa
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-blue-600">
            La factura se ha asignado correctamente con las notas de crédito
            seleccionadas.
          </p>
          <p className="mt-2 font-semibold text-blue-800">
            Nuevo monto de factura:{" "}
            {selectedInvoice &&
              formatCurrency(newInvoiceAmount, selectedInvoice.currency)}
          </p>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button
            onClick={handleCloseModal}
            className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
          >
            Continuar Asignando
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
