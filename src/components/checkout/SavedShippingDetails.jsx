import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle, Edit2, Save, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SavedShippingDetails({ onSelect, selectedAddress, formData, updateFormData }) {
  const { isAuthenticated, user, auth0User } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localForm, setLocalForm] = useState({});
  
  // Get user data including shipping details
  const userData = useQuery(api.auth.getUser, 
    isAuthenticated && auth0User?.sub ? { auth0Id: auth0User.sub } : 'skip'
  );
  
  const updateUserShipping = useMutation(api.auth.updateUserShipping);
  
  // Load saved shipping details when user data is available
  useEffect(() => {
    if (userData && isAuthenticated) {
      const savedDetails = {
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        region: userData.region || '',
        postalCode: userData.postalCode || '',
      };
      setLocalForm(savedDetails);
      
      // Auto-fill form if no existing form data
      if (!formData?.phone && savedDetails.phone) {
        updateFormData(savedDetails);
      }
    }
  }, [userData, isAuthenticated]);
  
  const handleSaveShipping = async () => {
    if (!isAuthenticated) {
      toast.error('Tafadhali ingia ili kuhifadhi anwani yako');
      return;
    }
    
    setSaving(true);
    try {
      await updateUserShipping({
        auth0Id: auth0User?.sub,
        phone: localForm.phone,
        address: localForm.address,
        city: localForm.city,
        region: localForm.region,
        postalCode: localForm.postalCode,
      });
      
      // Update the main form
      updateFormData(localForm);
      setIsEditing(false);
      toast.success('Anwani imehifadhiwa!');
    } catch (error) {
      toast.error('Imeshindwa kuhifadhi anwani');
    } finally {
      setSaving(false);
    }
  };
  
  const handleUseSaved = () => {
    updateFormData(localForm);
    if (onSelect) onSelect(localForm);
    toast.success('Anwani imejazwa kiotomatiki');
  };
  
  if (!isAuthenticated) {
    return null; // Don't show for guests
  }
  
  const hasSavedAddress = userData?.address || userData?.city || userData?.phone;
  
  return (
    <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-blue-800">Anwani Yangu Iliyohifadhiwa</h3>
        </div>
        {!isEditing && hasSavedAddress && (
          <button
            onClick={handleUseSaved}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Tumia Anwani Hii
          </button>
        )}
      </div>
      
      {isEditing ? (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Simu *</label>
              <input
                type="tel"
                value={localForm.phone}
                onChange={(e) => setLocalForm({...localForm, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="0712345678"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Mtaa/Anwani *</label>
              <input
                type="text"
                value={localForm.address}
                onChange={(e) => setLocalForm({...localForm, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Mtaa, Nyumba Namba"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Jiji *</label>
              <input
                type="text"
                value={localForm.city}
                onChange={(e) => setLocalForm({...localForm, city: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Nairobi"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Kaunti *</label>
              <input
                type="text"
                value={localForm.region}
                onChange={(e) => setLocalForm({...localForm, region: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Nairobi County"
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSaveShipping}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              {saving ? 'Inahifadhi...' : <>
                <Save className="h-4 w-4" />
                Hifadhi Anwani
              </>}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setLocalForm({
                  phone: userData?.phone || '',
                  address: userData?.address || '',
                  city: userData?.city || '',
                  region: userData?.region || '',
                });
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
            >
              Ghairi
            </button>
          </div>
        </div>
      ) : hasSavedAddress ? (
        <div className="space-y-2">
          <div className="text-sm text-gray-700">
            <p className="font-medium">{userData?.name}</p>
            <p>{userData?.phone}</p>
            <p>{userData?.address}</p>
            <p>{userData?.city}, {userData?.region}</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <Edit2 className="h-3 w-3" />
            Hariri Anwani
          </button>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-600 mb-2">Hujahifadhi anwani yako bado</p>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Ongeza Anwani Yako
          </button>
        </div>
      )}
    </div>
  );
}