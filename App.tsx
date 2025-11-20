import React, { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import { Dashboard } from './components/Dashboard';
import { InvoiceList } from './components/InvoiceList';
import { CreateInvoice } from './components/CreateInvoice';
import { Settings } from './components/Settings';
import { LayoutDashboard, FileText, PlusCircle, Settings as SettingsIcon, Users, Package, Menu, X } from 'lucide-react';
import { useStore } from './context/StoreContext';
import { INDIAN_STATES } from './types';
import { generateId } from './utils/gstUtils';

// Quick inline components for Customer/Product management to keep file count low but functional
const CustomerManager = () => {
  const { customers, addCustomer, deleteCustomer } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [newCus, setNewCus] = useState({ name: '', phone: '', state: 'Maharashtra', companyName: '', gstin: '', address: '' });

  const handleAdd = () => {
    addCustomer({ ...newCus, id: generateId() });
    setShowForm(false);
    setNewCus({ name: '', phone: '', state: 'Maharashtra', companyName: '', gstin: '', address: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          {showForm ? 'Cancel' : <><PlusCircle size={18} /> Add Customer</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Full Name" className="border p-2 rounded" value={newCus.name} onChange={e => setNewCus({...newCus, name: e.target.value})} />
          <input placeholder="Company Name" className="border p-2 rounded" value={newCus.companyName} onChange={e => setNewCus({...newCus, companyName: e.target.value})} />
          <input placeholder="GSTIN" className="border p-2 rounded uppercase" value={newCus.gstin} onChange={e => setNewCus({...newCus, gstin: e.target.value})} />
          <input placeholder="Phone" className="border p-2 rounded" value={newCus.phone} onChange={e => setNewCus({...newCus, phone: e.target.value})} />
          <select className="border p-2 rounded" value={newCus.state} onChange={e => setNewCus({...newCus, state: e.target.value})}>
            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input placeholder="Address" className="border p-2 rounded" value={newCus.address} onChange={e => setNewCus({...newCus, address: e.target.value})} />
          <div className="md:col-span-2">
            <button onClick={handleAdd} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Save Customer</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500">
            <tr><th className="p-4">Name</th><th className="p-4">Company</th><th className="p-4">GSTIN</th><th className="p-4">State</th><th className="p-4">Action</th></tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="p-4">{c.name}</td>
                <td className="p-4">{c.companyName}</td>
                <td className="p-4">{c.gstin || '-'}</td>
                <td className="p-4">{c.state}</td>
                <td className="p-4"><button onClick={() => deleteCustomer(c.id)} className="text-red-500">Delete</button></td>
              </tr>
            ))}
             {customers.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-gray-400">No customers added.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProductManager = () => {
  const { products, addProduct, deleteProduct } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [newProd, setNewProd] = useState({ name: '', hsnCode: '', price: 0, gstRate: 18, unit: 'pc' });

  const handleAdd = () => {
    addProduct({ ...newProd, id: generateId() });
    setShowForm(false);
    setNewProd({ name: '', hsnCode: '', price: 0, gstRate: 18, unit: 'pc' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Products / Services</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          {showForm ? 'Cancel' : <><PlusCircle size={18} /> Add Product</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Product Name" className="border p-2 rounded md:col-span-2" value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} />
          <input placeholder="HSN/SAC Code" className="border p-2 rounded" value={newProd.hsnCode} onChange={e => setNewProd({...newProd, hsnCode: e.target.value})} />
          <input type="number" placeholder="Price" className="border p-2 rounded" value={newProd.price} onChange={e => setNewProd({...newProd, price: Number(e.target.value)})} />
          <select className="border p-2 rounded" value={newProd.gstRate} onChange={e => setNewProd({...newProd, gstRate: Number(e.target.value)})}>
            {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>GST {r}%</option>)}
          </select>
          <input placeholder="Unit (e.g. pc, kg)" className="border p-2 rounded" value={newProd.unit} onChange={e => setNewProd({...newProd, unit: e.target.value})} />
          <div className="md:col-span-2">
            <button onClick={handleAdd} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Save Product</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500">
            <tr><th className="p-4">Name</th><th className="p-4">HSN</th><th className="p-4">Price</th><th className="p-4">GST %</th><th className="p-4">Action</th></tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-4">{p.name}</td>
                <td className="p-4">{p.hsnCode}</td>
                <td className="p-4">₹{p.price}</td>
                <td className="p-4">{p.gstRate}%</td>
                <td className="p-4"><button onClick={() => deleteProduct(p.id)} className="text-red-500">Delete</button></td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-gray-400">No products added.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main App Layout
const AppContent = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'invoices' | 'create' | 'customers' | 'products' | 'settings'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavItem = ({ view, icon: Icon, label }: any) => (
    <button 
      onClick={() => { setActiveView(view); setMobileMenuOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        activeView === view ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} no-print`}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-xl">
             <FileText size={28} /> VyaparPro
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-gray-500">
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem view="create" icon={PlusCircle} label="Create Invoice" />
          <NavItem view="invoices" icon={FileText} label="Invoices" />
          <NavItem view="customers" icon={Users} label="Customers" />
          <NavItem view="products" icon={Package} label="Products" />
          <NavItem view="settings" icon={SettingsIcon} label="Settings" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
         {/* Mobile Header */}
         <div className="md:hidden bg-white p-4 border-b border-gray-200 flex items-center justify-between no-print">
            <h1 className="font-bold text-lg text-gray-800">VyaparPro</h1>
            <button onClick={() => setMobileMenuOpen(true)} className="text-gray-600">
              <Menu size={24} />
            </button>
         </div>

         <main className="flex-1 p-4 md:p-8 overflow-auto">
           {activeView === 'dashboard' && <Dashboard />}
           {activeView === 'create' && <CreateInvoice onSave={() => setActiveView('invoices')} />}
           {activeView === 'invoices' && <InvoiceList />}
           {activeView === 'customers' && <CustomerManager />}
           {activeView === 'products' && <ProductManager />}
           {activeView === 'settings' && <Settings />}
         </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;