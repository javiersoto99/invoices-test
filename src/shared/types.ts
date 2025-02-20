export interface Invoice {
  id: string;
  amount: number;
  organization_id: string;
  currency: string;
  type: "received" | "credit_note";
  reference?: string;
}
