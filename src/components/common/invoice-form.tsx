type FormValues = {
  invoice_number: string;
  due_date: string;
  bill_to: string;
  bill_address: string;
  email: string;
  phone: string;
  terbilang: string;
  signed_by_name: string;
  signed_by_title: string;
  withAttachment: boolean;
  withPaymentLink: boolean;
  company_id: { id: string; name: string };
  notes?: string;
  items: {
    description: string;
    amount: number;
    price: string;
  }[];
  participants: {
    name: string;
    module: string;
    test_date: string;
  }[];
  taxes: {
    id: number;
    name: string;
    percent: number;
    type: "plus" | "min";
  }[];
};

type ErrorForm = {
  invoice_number: [] | null;
  company_id: [] | null;
  due_date: [] | null;
  bill_to: [] | null;
  bill_address: [] | null;
  email: [] | null;
  phone: [] | null;
  terbilang: [] | null;
  signed_by_name: [] | null;
  signed_by_title: [] | null;
  withAttachment: [] | null;
  notes: [] | null;
  items: {
    description: [] | null;
    amount: [] | null;
    price: string[] | null;
  }[];
  participants: {
    name: [] | null;
    module: [] | null;
    test_date: [] | null;
  }[];
  taxes: {
    id: [] | null;
    name: [] | null;
    percent: [] | null;
    type: [] | null;
  }[];
};

const InvoiceForm = () => {};

export default InvoiceForm;
