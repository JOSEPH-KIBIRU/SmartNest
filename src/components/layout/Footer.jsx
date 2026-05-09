import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Store className="h-8 w-8 text-emerald-500" />
              <span className="text-xl font-bold text-white">SmartNest</span>
            </Link>
            <p className="text-sm text-gray-400">
              Duka lako la kuaminika kwa mahitaji yote ya nyumbani. Bidhaa bora kwa bei nafuu.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Kategoria</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/category/kitchen" className="hover:text-emerald-400">Jikoni</Link></li>
              <li><Link to="/category/bathroom" className="hover:text-emerald-400">Bafuni</Link></li>
              <li><Link to="/category/mens-clothing" className="hover:text-emerald-400">Mavazi ya Wanaume</Link></li>
              <li><Link to="/category/womens-clothing" className="hover:text-emerald-400">Mavazi ya Wanawake</Link></li>
              <li><Link to="/category/electronics" className="hover:text-emerald-400">Elektroniki</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Msaada</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/orders" className="hover:text-emerald-400">Maagizo Yangu</Link></li>
              <li><span className="hover:text-emerald-400 cursor-pointer">Mbinu za Kulipa</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer">Maswali Yanayoulizwa Mara kwa Mara</span></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Wasiliana Nasi</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center"><Phone className="h-4 w-4 mr-2 text-emerald-500" /> +254 738 119 756</li>
              <li className="flex items-center"><Mail className="h-4 w-4 mr-2 text-emerald-500" /> support@smartnest.co.ke</li>
              <li className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-emerald-500" /> Nairobi, Kenya</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center text-gray-500">
          <p>© {new Date().getFullYear()} SmartNest. Haki zote zimehifadhiwa.</p>
        </div>
      </div>
    </footer>
  );
}