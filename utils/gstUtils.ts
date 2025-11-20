import { InvoiceItem, Product, GstType } from '../types';

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

export const calculateItemTotal = (
  product: Product,
  quantity: number,
  discountPercent: number
): InvoiceItem => {
  const basePrice = product.price * quantity;
  const discountAmount = basePrice * (discountPercent / 100);
  const taxableAmount = basePrice - discountAmount;
  const taxAmount = taxableAmount * (product.gstRate / 100);
  
  return {
    ...product,
    quantity,
    discount: discountPercent,
    taxableAmount,
    taxAmount,
    total: taxableAmount + taxAmount,
  };
};

export const determineGstType = (businessState: string, customerState: string): GstType => {
  if (!businessState || !customerState) return GstType.CGST_SGST;
  return businessState.toLowerCase() === customerState.toLowerCase()
    ? GstType.CGST_SGST
    : GstType.IGST;
};