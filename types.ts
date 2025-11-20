export enum GstType {
  CGST_SGST = 'CGST_SGST',
  IGST = 'IGST',
}

export interface BusinessProfile {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin: string;
  phone: string;
  email: string;
  logoUrl?: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  terms?: string;
}

export interface Customer {
  id: string;
  name: string;
  companyName?: string;
  gstin?: string;
  phone: string;
  email?: string;
  address: string;
  state: string;
}

export interface Product {
  id: string;
  name: string;
  hsnCode: string;
  price: number;
  gstRate: number; // Percentage (e.g., 18)
  unit: string; // e.g., 'pc', 'kg', 'ltr'
}

export interface InvoiceItem extends Product {
  quantity: number;
  discount: number; // Percentage
  taxableAmount: number;
  taxAmount: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerId: string;
  customerName: string; // Snapshot in case customer is deleted
  customerGstin: string;
  customerState: string;
  items: InvoiceItem[];
  subTotal: number;
  totalGst: number;
  totalDiscount: number;
  grandTotal: number;
  gstType: GstType;
  status: 'PAID' | 'PENDING' | 'DRAFT';
  notes?: string;
}

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry"
];