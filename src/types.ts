export type MercadoPagoPayment = {
  id: string;
  date_approved: string;
  money_release_date: string;
  transaction_details: {
    total_paid_amount: number;
    net_received_amount: number;
    [key: string]: any;
  };
  status: string;
  status_detail: string;
  payment_type_id: string;
  payment_method_id: string;
  operation_type: string;
  metadata: { player_id: string; room_id: string };
  // Safety check in case Mp adds new fields
  [key: string]: any;
};
