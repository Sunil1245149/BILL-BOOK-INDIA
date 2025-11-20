import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { INDIAN_STATES } from '../types';
import { Save } from 'lucide-react';

export const Settings: React.FC = () => {
  const { businessProfile, updateBusinessProfile } = useStore();
  const [formData, setFormData] = useState(businessProfile);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Business Settings</h2>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        {saved && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm mb-4">
            Settings saved successfully!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <input name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded outline-none focus:border-blue-500" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN Number</label>
            <input name="gstin" value={formData.gstin} onChange={handleChange} className="w-full border p-2 rounded outline-none focus:border-blue-500 uppercase" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <select name="state" value={formData.state} onChange={handleChange} className="w-full border p-2 rounded outline-none focus:border-blue-500">
              {INDIAN_STATES.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input name="address" value={formData.address} onChange={handleChange} className="w-full border p-2 rounded outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input name="city" value={formData.city} onChange={handleChange} className="w-full border p-2 rounded outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
            <input name="pincode" value={formData.pincode} onChange={handleChange} className="w-full border p-2 rounded outline-none focus:border-blue-500" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input name="phone" value={formData.phone} onChange={handleChange} className="w-full border p-2 rounded outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded outline-none focus:border-blue-500" />
          </div>
        </div>

        <hr className="border-gray-100" />
        <h3 className="font-bold text-gray-700">Bank Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
            <input name="bankName" value={formData.bankName || ''} onChange={handleChange} className="w-full border p-2 rounded outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <input name="accountNumber" value={formData.accountNumber || ''} onChange={handleChange} className="w-full border p-2 rounded outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
            <input name="ifsc" value={formData.ifsc || ''} onChange={handleChange} className="w-full border p-2 rounded outline-none focus:border-blue-500 uppercase" />
          </div>
        </div>

        <hr className="border-gray-100" />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
          <textarea name="terms" value={formData.terms || ''} onChange={handleChange} rows={3} className="w-full border p-2 rounded outline-none focus:border-blue-500" />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Save size={18} /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};