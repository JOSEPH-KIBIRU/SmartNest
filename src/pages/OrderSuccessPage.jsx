import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';

export default function OrderSuccessPage() {
  const { state } = useLocation();
  const orderId = state?.orderId;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Asante kwa Ununuzi Wako!</h1>
      <p className="text-gray-600 mb-2">Agizo lako limepokelewa kwa mafanikio.</p>
      {orderId && <p className="text-sm text-gray-500 mb-8">Namba ya agizo: #{orderId.slice(-8)}</p>}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/orders" className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"><Package className="mr-2 h-5 w-5" /> Angalia Maagizo</Link>
        <Link to="/products" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50">Endelea Kununua</Link>
      </div>
    </div>
  );
}