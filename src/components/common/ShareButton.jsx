import React, { useState } from 'react';
import { Share2, Facebook, Twitter, MessageCircle, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ShareButton({ product }) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const shareUrl = window.location.href;
  const shareText = `Angalia ${product.name} kwa KSh ${product.price.toLocaleString()} kwenye SmartNest!`;
  
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
  };
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link imenakiliwa!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Imeshindwa kunakili link');
    }
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
      >
        <Share2 className="h-4 w-4" />
        <span className="text-sm">Shiriki</span>
      </button>
      
      {showMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 z-20 overflow-hidden">
            <div className="p-1">
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm"
              >
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                Nakili Link
              </button>
              <button
                onClick={() => window.open(shareLinks.facebook, '_blank')}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm"
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                Facebook
              </button>
              <button
                onClick={() => window.open(shareLinks.twitter, '_blank')}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm"
              >
                <Twitter className="h-4 w-4 text-sky-500" />
                Twitter
              </button>
              <button
                onClick={() => window.open(shareLinks.whatsapp, '_blank')}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm"
              >
                <MessageCircle className="h-4 w-4 text-green-600" />
                WhatsApp
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}