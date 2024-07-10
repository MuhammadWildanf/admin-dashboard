export type VoucherType = {
    id: number;
    description: string;
    image: string;
    amount: string;
    discount_type: "percentage" | "fixed";
    expiry_date: string;
    user_type: "user" | "psikolog"; 
    max_discount: string;
    min_purchase: string;
    terms_conditions: string;
    for: string; 
    created_at: string;
    updated_at: string;
    usage_limit: number | null;
    claim_type: "single" | "multiple";
    usage_count: number;
    code: string;
  };
  