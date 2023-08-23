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

export type MercadoPagoMerchantOrder = {
  id: string;
  status: string;
  order_status: string;
  external_reference: string;
  total_amount: number;
  paid_amount: number;
  items: MercadoPagoItem[];
  // Safety check in case Mp adds new fields
  [key: string]: any;
};

export type MercadoPagoPayment = {
  collection: {
    id: string;
    date_approved: string;
    money_release_date: string;
    merchant_order_id: string;
    total_paid_amount: number;
    net_received_amount: number;
    paymentStatus: string;
    paymentStatusDetail: string;
    payment_type: string;
    payment_method_id: string;
    operation_type: string;
    // Safety check in case Mp adds new fields
    [key: string]: any;
  };
  // Safety check in case Mp adds new fields
  [key: string]: any;
};
