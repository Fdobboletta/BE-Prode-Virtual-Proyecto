type MercadoPagoItem = {
  id: string;
  category_id: string;
  currency_id: string;
  description: string;
  picture_url: string | null;
  title: string;
  quantity: number;
  unit_price: number;
};

export type MercadoPagoPayment = {
  id: string;
  date_approved: string;
  money_release_date: string;
  total_paid_amount: number;
  net_received_amount: number;
  status: string;
  status_detail: string;
  payment_type_id: string;
  payment_method_id: string;
  operation_type: string;
  metadata: { playerId: string; roomId: string };
  // Safety check in case Mp adds new fields
  [key: string]: any;
};
