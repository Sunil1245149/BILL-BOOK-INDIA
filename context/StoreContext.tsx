import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BusinessProfile, Customer, Invoice, Product } from '../types';

interface StoreContextType {
  businessProfile: BusinessProfile;
  updateBusinessProfile: (profile: BusinessProfile) => void;
  
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  
  products: Product[];
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
}

const defaultBusinessProfile: BusinessProfile = {
  name: "My Business Name",
  address: "123, Business Street",
  city: "Mumbai",
  state: "Maharashtra",
  pincode: "400001",
  gstin: "27ABCDE1234F1Z5",
  phone: "9876543210",
  email: "billing@example.com",
  terms: "Goods once sold will not be taken back. Subject to local jurisdiction.",
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or defaults
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(() => {
    const saved = localStorage.getItem('businessProfile');
    return saved ? JSON.parse(saved) : defaultBusinessProfile;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('customers');
    return saved ? JSON.parse(saved) : [];
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('invoices');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('businessProfile', JSON.stringify(businessProfile));
  }, [businessProfile]);

  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  // Actions
  const updateBusinessProfile = (profile: BusinessProfile) => setBusinessProfile(profile);
  
  const addCustomer = (customer: Customer) => setCustomers(prev => [...prev, customer]);
  const deleteCustomer = (id: string) => setCustomers(prev => prev.filter(c => c.id !== id));
  
  const addProduct = (product: Product) => setProducts(prev => [...prev, product]);
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));
  
  const addInvoice = (invoice: Invoice) => setInvoices(prev => [invoice, ...prev]);
  const deleteInvoice = (id: string) => setInvoices(prev => prev.filter(i => i.id !== id));

  return (
    <StoreContext.Provider value={{
      businessProfile, updateBusinessProfile,
      customers, addCustomer, deleteCustomer,
      products, addProduct, deleteProduct,
      invoices, addInvoice, deleteInvoice
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};