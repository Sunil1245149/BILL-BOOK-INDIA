import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { generateId, calculateItemTotal, determineGstType, formatCurrency } from '../utils/gstUtils';
import { Invoice, InvoiceItem, Product, GstType } from '../types';
import { Plus, Trash2, Save, Printer } from 'lucide-react';

interface Props {
  onSave: () => void;
}

export const CreateInvoice: React.FC<Props> = ({ onSave }) => {
  const { customers, products, businessProfile, addInvoice } = useStore();
  
  // Form State
  const [customerId, setCustomerId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Math.floor(Math.random() * 10000)}`);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [status, setStatus] = useState<'PAID'|'PENDING'>('PENDING');

  // Current Line Item State
  const [selectedProductId, setSelectedProductId] = useState('');
  const [qty, setQty] = useState(1);
  const [discount, setDiscount] = useState(0);

  const handleAddItem = () => {
    if (!selectedProductId) return;
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const newItem = calculateItemTotal(product, qty, discount);
    setItems([...items, newItem]);
    
    // Reset line item inputs
    setSelectedProductId('');
    setQty(1);
    setDiscount(0);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const calculateTotals = () => {
    const subTotal = items.reduce((sum, item) => sum + item.taxableAmount, 0);
    const totalGst = items.reduce((sum, item) => sum + item.taxAmount, 0);
    const totalDiscount = items.reduce((sum, item) => sum + (item.price * item.quantity * item.discount / 100), 0);
    const grandTotal = subTotal + totalGst;
    return { subTotal, totalGst, totalDiscount, grandTotal };
  };

  const handleSave = () => {
    if (!customerId || items.length === 0) {
      alert("Please select a customer and add at least one item.");
      return;
    }

    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    const totals = calculateTotals();
    const gstType = determineGstType(businessProfile.state, customer.state);

    const newInvoice: Invoice = {
      id: generateId(),
      invoiceNumber,
      date,
      dueDate,
      customerId,
      customerName: customer.name,
      customerGstin: customer.gstin || '',
      customerState: customer.state,
      items,
      ...totals,
      gstType,
      status,
    };

    addInvoice(newInvoice);
    onSave();
  };

  const totals = calculateTotals();

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">New GST Invoice</h2>
        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Save size={18} /> Save Invoice
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Invoice No</label>
            <input 
              type="text" 
              value={invoiceNumber} 
              onChange={e => setInvoiceNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none uppercase"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Customer</label>
            <select 
              value={customerId}
              onChange={e => setCustomerId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Customer</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.companyName})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Invoice Date</label>
            <input 
              type="date" 
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-600 mb-1">Payment Status</label>
             <select 
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              className="w-full border border-gray-300 rounded-lg p-2 outline-none"
             >
               <option value="PENDING">Pending</option>
               <option value="PAID">Paid</option>
             </select>
          </div>
        </div>
        
        <div className="space-y-4">
           <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Due Date</label>
            <input 
              type="date" 
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Add Items Section */}
      <div className="p-6 bg-gray-50 border-y border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase">Add Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label className="block text-xs font-medium text-gray-500 mb-1">Product</label>
            <select 
              value={selectedProductId}
              onChange={e => setSelectedProductId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none"
            >
              <option value="">Select Product...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Qty</label>
            <input 
              type="number" 
              min="1"
              value={qty}
              onChange={e => setQty(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Disc %</label>
            <input 
              type="number" 
              min="0"
              max="100"
              value={discount}
              onChange={e => setDiscount(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none"
            />
          </div>
          <div className="md:col-span-3">
            <button 
              onClick={handleAddItem}
              className="w-full bg-indigo-600 text-white p-2 rounded-lg text-sm hover:bg-indigo-700 flex justify-center items-center gap-2"
            >
              <Plus size={16} /> Add to Bill
            </button>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-white text-gray-500 border-b">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4 text-right">Price</th>
              <th className="p-4 text-right">Qty</th>
              <th className="p-4 text-right">GST %</th>
              <th className="p-4 text-right">Discount</th>
              <th className="p-4 text-right">Taxable</th>
              <th className="p-4 text-right">Total</th>
              <th className="p-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item, idx) => (
              <tr key={idx}>
                <td className="p-4 font-medium">{item.name}</td>
                <td className="p-4 text-right">{formatCurrency(item.price)}</td>
                <td className="p-4 text-right">{item.quantity} {item.unit}</td>
                <td className="p-4 text-right">{item.gstRate}%</td>
                <td className="p-4 text-right">{item.discount}%</td>
                <td className="p-4 text-right">{formatCurrency(item.taxableAmount)}</td>
                <td className="p-4 text-right font-bold">{formatCurrency(item.total)}</td>
                <td className="p-4 text-right">
                  <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={8} className="p-8 text-center text-gray-400">No items added yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="p-6 bg-gray-50 flex justify-end">
        <div className="w-full md:w-1/3 space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal (Taxable)</span>
            <span>{formatCurrency(totals.subTotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Total GST Tax</span>
            <span>{formatCurrency(totals.totalGst)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-blue-900 pt-4 border-t border-gray-200">
            <span>Grand Total</span>
            <span>{formatCurrency(totals.grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};