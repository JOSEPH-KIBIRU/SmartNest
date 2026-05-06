import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CloudinaryUpload from '../../components/upload/CloudinaryUpload';

// Stable spinner component - never swaps, just changes opacity
function Spinner({ className = '' }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

export default function ProductsManagePage() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const products = useQuery(api.products.getAll, { limit: 200 });
  const categories = useQuery(api.categories.getAll);
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const deleteProduct = useMutation(api.products.remove);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    categoryId: '',
    inventory: '',
    lowStockThreshold: '5',
    images: [],
    attributes: {},
    tags: [],
    isActive: true
  });

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner className="h-8 w-8 text-emerald-600" />
    </div>
  );
  
  if (!isAdmin) return <Navigate to="/" replace />;

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      compareAtPrice: '',
      categoryId: '',
      inventory: '',
      lowStockThreshold: '5',
      images: [],
      attributes: {},
      tags: [],
      isActive: true
    });
    setEditingProduct(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      compareAtPrice: product.compareAtPrice?.toString() || '',
      categoryId: product.categoryId,
      inventory: product.inventory.toString(),
      lowStockThreshold: (product.lowStockThreshold || 5).toString(),
      images: product.images || [],
      attributes: product.attributes || {},
      tags: product.tags || [],
      isActive: product.isActive
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        categoryId: formData.categoryId,
        images: formData.images,
        inventory: Number(formData.inventory),
        isActive: formData.isActive,
      };

      if (formData.compareAtPrice) payload.compareAtPrice = Number(formData.compareAtPrice);
      if (formData.lowStockThreshold) payload.lowStockThreshold = Number(formData.lowStockThreshold);
      if (Object.keys(formData.attributes).length > 0) payload.attributes = formData.attributes;
      if (formData.tags.length > 0) payload.tags = formData.tags;

      if (editingProduct) {
        await updateProduct({ id: editingProduct._id, ...payload });
      } else {
        await createProduct(payload);
      }
      
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      alert('Hitilafu: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (product) => {
    if (!confirm(`Una uhakika unataka kufuta "${product.name}"?`)) return;
    
    try {
      await deleteProduct({ id: product._id });
    } catch (err) {
      alert('Hitilafu kufuta: ' + err.message);
    }
  };

  const addAttribute = () => {
    const key = prompt('Jina la sifa (mfano: sizes, material, voltage):');
    if (!key) return;
    const value = prompt('Thamani (mfano: S,M,L au Aluminum):');
    if (!value) return;
    
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [key]: value.includes(',') ? value.split(',').map(s => s.trim()) : value
      }
    }));
  };

  const removeAttribute = (key) => {
    setFormData(prev => {
      const newAttrs = { ...prev.attributes };
      delete newAttrs[key];
      return { ...prev, attributes: newAttrs };
    });
  };

  const addTag = () => {
    const tag = prompt('Jina la tag:');
    if (!tag) return;
    setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
  };

  const removeTag = (tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <Link to="/admin" className="text-sm text-gray-500 hover:text-gray-700 flex items-center mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Rudi kwa Dashibodi
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Simamia Bidhaa</h1>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" /> Ongeza Bidhaa Mpya
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tafuta bidhaa..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Picha</th>
                <th className="px-4 py-3">Bidhaa</th>
                <th className="px-4 py-3">Kategoria</th>
                <th className="px-4 py-3">Bei</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Hali</th>
                <th className="px-4 py-3 text-right">Vitendo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Hakuna bidhaa zilizopatikana
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => {
                  const category = categories?.find(c => c._id === p.categoryId);
                  const isLow = p.inventory <= (p.lowStockThreshold || 5);
                  
                  return (
                    <tr key={p._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <img 
                          src={p.images?.[0] || '/placeholder.jpg'} 
                          alt={p.name} 
                          className="h-12 w-12 object-cover rounded-lg"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{p.name}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{p.description}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {category?.nameSwahili || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">KSh {p.price.toLocaleString()}</p>
                          {p.compareAtPrice && (
                            <p className="text-xs text-gray-400 line-through">
                              KSh {p.compareAtPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-bold ${isLow ? 'text-red-600' : 'text-gray-900'}`}>
                          {p.inventory}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          p.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {p.isActive ? 'Hai' : 'Imezimwa'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => openEditModal(p)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Hariri"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(p)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Futa"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => !isSubmitting && setIsModalOpen(false)} />
            
            <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingProduct ? 'Hariri Bidhaa' : 'Ongeza Bidhaa Mpya'}
                </h2>
                <button 
                  onClick={() => !isSubmitting && setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Taarifa za Msingi</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jina la Bidhaa *</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="mfano: Blender ya Jikoni"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maelezo *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Eleza bidhaa hii..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bei (KSh) *</label>
                      <input
                        required
                        type="number"
                        min="0"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="25000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bei ya Zamani (KSh)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.compareAtPrice}
                        onChange={e => setFormData({...formData, compareAtPrice: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="30000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                      <input
                        required
                        type="number"
                        min="0"
                        value={formData.inventory}
                        onChange={e => setFormData({...formData, inventory: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kiwango cha Chini</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.lowStockThreshold}
                        onChange={e => setFormData({...formData, lowStockThreshold: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategoria *</label>
                    <select
                      required
                      value={formData.categoryId}
                      onChange={e => setFormData({...formData, categoryId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="">Chagua kategoria</option>
                      {categories?.map(c => (
                        <option key={c._id} value={c._id}>{c.nameSwahili} ({c.name})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Picha za Bidhaa</label>
                  <CloudinaryUpload
                    onUpload={(urls) => setFormData({...formData, images: urls})}
                    multiple={true}
                  />
                  {formData.images.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {formData.images.map((url, idx) => (
                        <div key={idx} className="relative group">
                          <img src={url} alt="" className="h-20 w-full object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== idx)
                            }))}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Attributes */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Sifa Zaidi (Attributes)</label>
                    <button
                      type="button"
                      onClick={addAttribute}
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      + Ongeza Sifa
                    </button>
                  </div>
                  {Object.keys(formData.attributes).length === 0 ? (
                    <p className="text-sm text-gray-400">Hakuna sifa zaidi</p>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(formData.attributes).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                          <div>
                            <span className="font-medium text-gray-700">{key}: </span>
                            <span className="text-gray-600">
                              {Array.isArray(value) ? value.join(', ') : value}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttribute(key)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Tags</label>
                    <button
                      type="button"
                      onClick={addTag}
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      + Ongeza Tag
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 p-0.5 hover:bg-emerald-200 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Bidhaa iko hai (inaweza kuonekana na wateja)
                  </label>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner className="h-4 w-4 mr-2" />
                        Inahifadhi...
                      </>
                    ) : (
                      <>
                        {editingProduct ? 'Hifadhi Mabadiliko' : 'Ongeza Bidhaa'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}