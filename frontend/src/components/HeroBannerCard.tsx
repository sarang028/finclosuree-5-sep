import React from 'react';

export const HeroBannerCard: React.FC = () => {
  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xs border border-slate-200/80 h-full min-h-[220px] flex flex-col justify-end p-6 bg-slate-900 group">
      {/* Real photographic imagery matching reference screen */}
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
        alt="From Uncertainty to Closure"
        className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
      />

      {/* Subtle Gradient Overlay for visual storytelling and readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

      {/* Overlay Content */}
      <div className="relative z-10 text-center space-y-1 py-2">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
          From Uncertainty to Closure
        </h2>
        <p className="text-xs sm:text-sm font-medium text-slate-200 drop-shadow-xs">
          Because every family deserves clarity.
        </p>

        {/* Carousel indicator dots matching reference */}
        <div className="flex items-center justify-center space-x-1.5 pt-3">
          <span className="w-5 h-1.5 rounded-full bg-white" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
        </div>
      </div>
    </div>
  );
};
