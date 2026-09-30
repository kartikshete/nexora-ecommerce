import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Clock } from 'lucide-react';

export const DealBanner = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-zinc-950 text-white p-8 sm:p-12 border border-zinc-800 shadow-2xl my-12">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Deal Text */}
        <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-rose-400" />
            <span>Limited Flash Drop</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Exclusive Midnight Edition Drop — Up to <span className="text-rose-400">40% OFF</span>
          </h2>

          <p className="text-gray-400 text-sm max-w-xl mx-auto lg:mx-0">
            Get instant savings on premium studio headphones, carbon running footwear, and luxury mechanical keyboards. Deal expires when timer hits zero.
          </p>

          {/* Countdown Clock */}
          <div className="pt-2 flex items-center justify-center lg:justify-start space-x-3">
            <div className="flex items-center space-x-1 text-xs text-gray-400 mr-2">
              <Clock className="w-4 h-4 text-rose-400" />
              <span>Ends in:</span>
            </div>
            
            <div className="flex items-center space-x-2 font-mono font-bold text-sm">
              <div className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white shadow-inner">
                {String(timeLeft.hours).padStart(2, '0')} <span className="text-[10px] text-gray-500 block text-center font-sans">HRS</span>
              </div>
              <span className="text-gray-600">:</span>
              <div className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white shadow-inner">
                {String(timeLeft.minutes).padStart(2, '0')} <span className="text-[10px] text-gray-500 block text-center font-sans">MIN</span>
              </div>
              <span className="text-gray-600">:</span>
              <div className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white shadow-inner text-rose-400">
                {String(timeLeft.seconds).padStart(2, '0')} <span className="text-[10px] text-gray-500 block text-center font-sans">SEC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right CTA */}
        <div className="lg:col-span-4 flex justify-center lg:justify-end">
          <Link
            to="/products?filter=deals"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-zinc-950 font-extrabold text-sm hover:bg-gray-100 transition-all transform hover:-translate-y-0.5 shadow-xl"
          >
            <span>Claim Offer Now</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default DealBanner;
