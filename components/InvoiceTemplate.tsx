import React, { forwardRef } from 'react';
import { Invoice, BusinessProfile, GstType } from '../types';
import { formatCurrency } from '../utils/gstUtils';

interface Props {
  invoice: Invoice;
  business: BusinessProfile;
}

const InvoiceTemplate = forwardRef<HTMLDivElement, Props>(({ invoice, business }, ref) => {
  const isIgst = invoice.gstType === GstType.IGST;

  return (
    <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto text-sm print:w-full print:max-w-none text-slate-800">
      {/* Header */}
      <div className="flex justify-between items-start border-b pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700 uppercase mb-2">{business.name}</h1>
          <p className="whitespace-pre-line text-gray-600">
            {business.address}, {business.city}<br/>
            {business.state} - {business.pincode}<br/>
            Phone: {business.phone}<br/>
            Email: {business.email}
          </p>
          <p className="mt-2 font-semibold text-gray-800">GSTIN: {business.gstin}</p>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-gray-200 uppercase tracking-widest">Invoice</h2>
          <div className="mt-4 space-y-1">
             <p><span className="text-gray-500 w-24 inline-block">Invoice No:</span> <span className="font-bold">{invoice.invoiceNumber}</span></p>
             <p><span className="text-gray-500 w-24 inline-block">Date:</span> <span>{invoice.date}</span></p>
             <p><span className="text-gray-500 w-24 inline-block">Due Date:</span> <span>{invoice.dueDate}</span></p>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-gray-500 uppercase text-xs font-bold mb-2">Bill To</h3>
        <div className="font-bold text-lg">{invoice.customerName}</div>
        <p className="text-gray-600 whitespace-pre-line">{invoice.customerState}</p>
        <p className="text-gray-600">GSTIN: {invoice.customerGstin || 'N/A'}</p>
      </div>

      {/* Items Table */}
      <table className="w-full mb-8">
        <thead>
          <tr className="bg-blue-600 text-white text-left text-xs uppercase tracking-wider">
            <th className="p-3 rounded-tl-lg">Item Description</th>
            <th className="p-3 text-center">HSN/SAC</th>
            <th className="p-3 text-right">Rate</th>
            <th className="p-3 text-right">Qty</th>
            <th className="p-3 text-right">Disc %</th>
            <th className="p-3 text-right">Taxable</th>
            <th className="p-3 text-right rounded-tr-lg">Total</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {invoice.items.map((item, idx) => (
            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-500">GST @ {item.gstRate}%</div>
              </td>
              <td className="p-3 text-center text-gray-500">{item.hsnCode}</td>
              <td className="p-3 text-right">{formatCurrency(item.price)}</td>
              <td className="p-3 text-right">{item.quantity} {item.unit}</td>
              <td className="p-3 text-right text-red-500">{item.discount > 0 ? `${item.discount}%` : '-'}</td>
              <td className="p-3 text-right">{formatCurrency(item.taxableAmount)}</td>
              <td className="p-3 text-right font-medium">{formatCurrency(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals & Tax Breakup */}
      <div className="flex justify-end mb-8">
        <div className="w-1/2">
           <div className="space-y-2">
             <div className="flex justify-between text-gray-600">
               <span>Taxable Amount</span>
               <span>{formatCurrency(invoice.subTotal)}</span>
             </div>
             {isIgst ? (
               <div className="flex justify-between text-gray-600">
                 <span>IGST Total</span>
                 <span>{formatCurrency(invoice.totalGst)}</span>
               </div>
             ) : (
               <>
                <div className="flex justify-between text-gray-600">
                 <span>CGST Total</span>
                 <span>{formatCurrency(invoice.totalGst / 2)}</span>
               </div>
               <div className="flex justify-between text-gray-600">
                 <span>SGST Total</span>
                 <span>{formatCurrency(invoice.totalGst / 2)}</span>
               </div>
               </>
             )}
             {invoice.totalDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Total Discount</span>
                  <span>-{formatCurrency(invoice.totalDiscount)}</span>
                </div>
             )}
             <div className="flex justify-between text-xl font-bold text-blue-900 border-t pt-2 mt-2">
               <span>Grand Total</span>
               <span>{formatCurrency(invoice.grandTotal)}</span>
             </div>
           </div>
        </div>
      </div>

      {/* Footer / Bank / Terms */}
      <div className="grid grid-cols-2 gap-8 border-t pt-8">
        <div>
          <h4 className="font-bold text-gray-700 mb-2 text-xs uppercase">Bank Details</h4>
          <p className="text-gray-600">
            Bank: {business.bankName || 'N/A'}<br/>
            A/c No: {business.accountNumber || 'N/A'}<br/>
            IFSC: {business.ifsc || 'N/A'}
          </p>
          
          <h4 className="font-bold text-gray-700 mt-4 mb-2 text-xs uppercase">Terms & Conditions</h4>
          <p className="text-xs text-gray-500 text-justify">{business.terms}</p>
        </div>
        <div className="text-right flex flex-col justify-between items-end">
          <div className="h-20 w-40 border-b border-gray-400 mb-2"></div>
          <p className="font-bold text-gray-700">{business.name}</p>
          <p className="text-xs text-gray-500">Authorized Signatory</p>
        </div>
      </div>
      
      <div className="mt-12 text-center text-xs text-gray-400">
        This is a computer generated invoice.
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';
export default InvoiceTemplate;