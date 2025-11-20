import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/gstUtils';
import { TrendingUp, Users, FileText, Package } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { invoices, customers, products } = useStore();

  const totalRevenue = invoices.reduce((acc, curr) => acc + curr.grandTotal, 0);
  const pendingInvoices = invoices.filter(i => i.status === 'PENDING').length;

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(totalRevenue)} 
          icon={TrendingUp} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Total Invoices" 
          value={invoices.length} 
          icon={FileText} 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Customers" 
          value={customers.length} 
          icon={Users} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Products" 
          value={products.length} 
          icon={Package} 
          color="bg-orange-500" 
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Recent Invoices</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4 font-medium">Invoice No</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.slice(0, 5).map(invoice => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-blue-600">{invoice.invoiceNumber}</td>
                  <td className="p-4">{invoice.customerName}</td>
                  <td className="p-4">{invoice.date}</td>
                  <td className="p-4">{formatCurrency(invoice.grandTotal)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      invoice.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                 <tr><td colSpan={5} className="p-6 text-center text-gray-400">No invoices found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};