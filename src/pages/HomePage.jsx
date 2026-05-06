import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { 
  ArrowRight, 
  Truck, 
  Shield, 
  Headphones,
  Star,
  Flame,
  ChevronRight,
  ShoppingBag,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import AnimatedProductCard from '../components/product/AnimatedProductCard';

// High-quality Unsplash images for each category
const categoryImages = {
  kitchen: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
  bathroom: "https://images.unsplash.com/photo-1625940119840-585d3495dc94?w=800&q=80",
  mens: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80",
  womens: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
  kids: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80",
  electronics: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80"
};

// Your videos from Pixabay - ONLY videos, NO photos
const heroVideos = [
  {
    url: '/public/kitchen.mp4',
    title: 'Kitchen & Home Collection'
  },
  {
    url: '/public/kitchen2.mp4',
    title: 'Latest Arrivals'
  }
];

export default function HomePage() {
  const categories = useQuery(api.categories.getAll);
  const featured = useQuery(api.products.getAll, { isActive: true, limit: 8 });
  
  // Video state
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  // Auto-switch videos every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % heroVideos.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Handle video play/pause when video changes
  useEffect(() => {
  if (videoRef.current) {
    videoRef.current.play().catch(e => console.log('Play error:', e));
  }
}, [currentVideo]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      
      {/* REPLACE your entire hero section with this clean version (NO controls) */}

<section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
  {/* Video Background - NO CONTROLS */}
  <div className="absolute inset-0">
    <video
      ref={videoRef}
      src={heroVideos[currentVideo].url}
      autoPlay
      loop
      muted
      playsInline
      className="absolute top-0 left-0 w-full h-full object-cover"
    />
    {/* Dark overlay for text readability */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
  </div>

  {/* Floating decorative elements */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-float" />
    <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
  </div>

  

  {/* Hero Content - Centered */}
  <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <AnimatedSection direction="up" delay={0}>
      <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8">
        <Flame className="h-4 w-4 text-amber-400" />
        <span className="text-white/90 text-sm font-medium">Duka Bora la Nyumbani Kenya</span>
      </div>
    </AnimatedSection>

    <AnimatedSection direction="up" delay={100}>
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-red-200 mb-6 leading-tight">
        Smart<span className="text-fuchsia-600">Nest</span>
      </h1>
    </AnimatedSection>

    <AnimatedSection direction="up" delay={200}>
      <p className="text-xl md:text-2xl text-white/80 mb-4 max-w-2xl mx-auto leading-relaxed">
        Vifaa vya jikoni, mavazi ya mtindo, na elektroniki kwa bei nafuu
      </p>
    </AnimatedSection>

    <AnimatedSection direction="up" delay={300}>
      <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
        Air Fryer · Cooker · Blender · Mavazi · Viatu · Simu za rununu
      </p>
    </AnimatedSection>

    <AnimatedSection direction="up" delay={400}>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          to="/products" 
          className="inline-flex items-center justify-center px-8 py-4 bg-amber-700 text-white font-bold rounded-full hover:bg-blue-400 transition-all hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30"
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          Anza Ununuzi
        </Link>
        <Link 
          to="/category/kitchen" 
          className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/20 transition-all hover:scale-105"
        >
          Jikoni
          <ChevronRight className="ml-1 h-5 w-5" />
        </Link>
      </div>
    </AnimatedSection>

    {/* Trust badges */}
    <AnimatedSection direction="up" delay={600}>
      <div className="mt-12 flex flex-wrap justify-center gap-6 text-white/60 text-sm">
        <div className="flex items-center">
          <Truck className="h-4 w-4 mr-2" />
          Usafiri Bure
        </div>
        <div className="flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          Kulipa kwa Ulinzi
        </div>
        <div className="flex items-center">
          <Star className="h-4 w-4 mr-2 text-amber-400" />
          Bidhaa Bora
        </div>
      </div>
    </AnimatedSection>
  </div>

  {/* Scroll indicator */}
  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
    <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
      <div className="w-1.5 h-3 bg-white/60 rounded-full mt-2 animate-scroll-down" />
    </div>
  </div>
</section>

      {/* ==================== CATEGORY SHOWCASE ==================== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="up" delay={0}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Kategoria Zetu</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Chagua kutoka kwa mkusanyiko wetu wa bidhaa bora za nyumbani</p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Kitchen - Large Card */}
            <AnimatedSection direction="up" delay={0} className="md:col-span-2 lg:col-span-2">
              <Link to="/category/kitchen" className="group relative block h-80 rounded-2xl overflow-hidden">
                <img 
                  src={categoryImages.kitchen}
                  alt="Jikoni"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">POPULAR</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">Jikoni</h3>
                  <p className="text-white/80 mb-4">Air Fryer, Cooker, Blender, na zaidi</p>
                  <span className="inline-flex items-center text-emerald-400 font-medium group-hover:translate-x-2 transition-transform">
                    Angalia Bidhaa <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>
              </Link>
            </AnimatedSection>

            {/* Men's Clothing */}
            <AnimatedSection direction="up" delay={100}>
              <Link to="/category/mens-clothing" className="group relative block h-80 rounded-2xl overflow-hidden">
                <img 
                  src={categoryImages.mens}
                  alt="Mavazi ya Wanaume"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">Mavazi ya Wanaume</h3>
                  <p className="text-white/70 text-sm mb-3">Shati, Suti, Viatu</p>
                  <span className="inline-flex items-center text-emerald-400 text-sm font-medium group-hover:translate-x-2 transition-transform">
                    Chunguza <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </div>
              </Link>
            </AnimatedSection>

            {/* Women's Clothing */}
            <AnimatedSection direction="up" delay={0}>
              <Link to="/category/womens-clothing" className="group relative block h-80 rounded-2xl overflow-hidden">
                <img 
                  src={categoryImages.womens}
                  alt="Mavazi ya Wanawake"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">Mavazi ya Wanawake</h3>
                  <p className="text-white/70 text-sm mb-3">Dresses, Ankara, Viatu</p>
                  <span className="inline-flex items-center text-emerald-400 text-sm font-medium group-hover:translate-x-2 transition-transform">
                    Chunguza <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </div>
              </Link>
            </AnimatedSection>

            {/* Electronics */}
            <AnimatedSection direction="up" delay={150}>
              <Link to="/category/electronics" className="group relative block h-80 rounded-2xl overflow-hidden">
                <img 
                  src={categoryImages.electronics}
                  alt="Elektroniki"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">NEW</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">Elektroniki</h3>
                  <p className="text-white/70 text-sm mb-3">Simu, Laptop, Earbuds</p>
                  <span className="inline-flex items-center text-emerald-400 text-sm font-medium group-hover:translate-x-2 transition-transform">
                    Chunguza <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </div>
              </Link>
            </AnimatedSection>

            {/* Bathroom */}
            <AnimatedSection direction="up" delay={100} className="md:col-span-2">
              <Link to="/category/bathroom" className="group relative block h-80 rounded-2xl overflow-hidden">
                <img 
                  src={categoryImages.bathroom}
                  alt="Bafuni"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-3xl font-bold text-white mb-2">Bafuni</h3>
                  <p className="text-white/80 mb-4">Towels, Accessories, Storage</p>
                  <span className="inline-flex items-center text-emerald-400 font-medium group-hover:translate-x-2 transition-transform">
                    Angalia Zote <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>
              </Link>
            </AnimatedSection>

            {/* Kids */}
            <AnimatedSection direction="up" delay={200}>
              <Link to="/category/kids-clothing" className="group relative block h-80 rounded-2xl overflow-hidden">
                <img 
                  src={categoryImages.kids}
                  alt="Mavazi ya Watoto"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">Mavazi ya Watoto</h3>
                  <p className="text-white/70 text-sm mb-3">School wear, Casual, Shoes</p>
                  <span className="inline-flex items-center text-emerald-400 text-sm font-medium group-hover:translate-x-2 transition-transform">
                    Chunguza <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </div>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ==================== FEATURED PRODUCTS ==================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="up" delay={0}>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full mb-4">
                HANDPICKED
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Bidhaa Maarufu</h2>
              <p className="text-xl text-gray-600">Wateja wetu wanazipenda hizi</p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured?.map((product, index) => (
              <AnimatedProductCard 
                key={product._id} 
                product={product} 
                index={index}
              />
            ))}
          </div>

          <AnimatedSection direction="up" delay={0} className="text-center mt-12">
            <Link 
              to="/products" 
              className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-all hover:scale-105"
            >
              Angalia Bidhaa Zote
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ==================== PROMO BANNER ==================== */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80"
            alt="Shopping"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-emerald-900/80" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection direction="up" delay={0}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Punguzo la <span className="text-amber-400">25%</span> kwa Wanachama Wapya
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Jiunge na SmartNest leo upate punguzo maalum kwa ununuzi wako wa kwanza
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/products" 
                className="inline-flex items-center justify-center px-8 py-4 bg-amber-500 text-gray-900 font-bold rounded-full hover:bg-amber-400 transition-all hover:scale-105"
              >
                Nunua Sasa
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ==================== WHY CHOOSE US ==================== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="up" delay={0}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Kwa Nini SmartNest?</h2>
              <p className="text-xl text-gray-600">Tunatoa zaidi ya bidhaa — tunatoa uzoefu</p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection direction="up" delay={0}>
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Truck className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Usafiri wa Haraka</h3>
                <p className="text-gray-600">Tunafikisha bidhaa zako ndani ya masaa 24-48 Nairobi na miji jirani.</p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={150}>
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Kulipia kwa Ulinzi</h3>
                <p className="text-gray-600">Lipa kwa Stripe kwa usalama wa hali ya juu. Pesa zako ziko salama.</p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={300}>
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Headphones className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Msaada wa Wateja</h3>
                <p className="text-gray-600">Timu yetu ipo tayari kukusaidia siku 7 kwa wiki kupitia simu au email.</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}