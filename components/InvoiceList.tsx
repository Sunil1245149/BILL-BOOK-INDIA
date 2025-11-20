import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Eye, Trash2, Search, Printer } from 'lucide-react';
import { formatCurrency } from '../utils/gstUtils';
import InvoiceTemplate from './InvoiceTemplate';
import { Invoice } from '../types';

export const InvoiceList: React.FC = () => {
  const { invoices, deleteInvoice, businessProfile } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  const filtered = invoices.filter(inv => 
    inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  if (viewingInvoice) {
    return (
      <div>
        <div className="mb-6 flex justify-between items-center no-print">
          <button 
            onClick={() => setViewingInvoice(null)}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            ← Back to List
          </button>
          <button 
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Printer size={18} /> Print Invoice
          </button>
        </div>
        <InvoiceTemplate invoice={viewingInvoice} business={businessProfile} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Saved Invoices</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search invoices..." 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-4 font-medium">Invoice No</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">State</th>
              <th className="p-4 font-medium text-right">Amount</th>
              <th className="p-4 font-medium text-center">Status</th>
              <th className="p-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(inv => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-blue-600">{inv.invoiceNumber}</td>
                <td className="p-4">{inv.date}</td>
                <td className="p-4 font-medium">{inv.customerName}</td>
                <td className="p-4 text-gray-500">{inv.customerState}</td>
                <td className="p-4 text-right font-bold">{formatCurrency(inv.grandTotal)}</td>
                <td className="p-4 text-center">
                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      inv.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {inv.status}
                    </span>
                </td>
                <td className="p-4 flex justify-center gap-3">
                  <button onClick={() => setViewingInvoice(inv)} className="text-blue-500 hover:text-blue-700" title="View/Print">
                    <Eye size={18} />
                  </button>
                  <button onClick={() => deleteInvoice(inv.id)} className="text-red-400 hover:text-red-600" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
             {filtered.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-gray-400">No invoices found matching your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};