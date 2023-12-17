export type InvoiceItemType = {
  id: number;
  invoice_id: number;
  product_id: number | null;
  price: number;
  total_price: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  notes: string | null;
  description: string;
  amount: number;
  product_detail: string | null;
  assessment_participant_id: number | null;
};

export type TaxType = {
  id: number;
  name: string;
  type: "plus" | "min";
  total: number;
  percent: number;
};

export type AttachmentType = {
  name: string;
  module: string;
  test_date: string;
};

export type XenditPaymentType = {
  id: number;
  payment_id: string;
  external_id: string;
  status: string;
  invoice_id: number;
  expiry_date: string;
  invoice_url: string;
  notes: null | string;
  created_at: string;
  updated_at: string;
  callback: null | string;
};

export type InvoiceType = {
  id: number;
  invoice_number: string;
  due_date: string;
  company: { id: string; name: string };
  payer_name: string;
  payer_email: string;
  payer_phone: string;
  payer_address: string;
  payer_company: string;
  notes: string;
  status: "UNPAID" | "PAID" | "CANCELLED"; // Update with possible values
  paid_at: string | null;
  items: InvoiceItemType[];
  taxes: TaxType[];
  total_tax: number;
  sub_total: number;
  discount: number;
  grand_total: number;
  terbilang: string;
  signed_by: { name: string; title: string };
  attachment: AttachmentType[];
  xenditPayment: XenditPaymentType;
  transfer_proof: string | null;
  pph_proof: string | null;
  created_at: string;
  updated_at: string;
};
