import React from 'react';
import { Camera, ArrowRight } from 'lucide-react';

interface LandingScreenProps {
  onEnterSite: () => void;
}

export function LandingScreen({ onEnterSite }: LandingScreenProps) {
  const handleButtonClick = () => {
    console.log('🚀 ENTER SITE BUTTON CLICKED!');
    console.log('onEnterSite function:', onEnterSite);
    try {
      onEnterSite();
      console.log('✅ onEnterSite() called successfully');
    } catch (error) {
      console.error('❌ Error calling onEnterSite:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 200, 255, 0.3) 0%, transparent 50%)
          `
        }}></div>
      </div>

      {/* Logo and App Name */}
      <div className="mb-8 text-center z-10 relative">
        <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
          <Camera className="h-10 w-10 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground">Happenings</h2>
      </div>

      {/* Main Message */}
      <div className="text-center mb-12 space-y-6 max-w-2xl z-10 relative">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
          <span className="block text-foreground">You are</span>
          <span className="block text-primary">documenting</span>
          <span className="block text-foreground">real life</span>
        </h1>
        
        <div className="text-xl sm:text-2xl text-muted-foreground font-medium">
          Thank you
        </div>
        
        <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Every moment you capture contributes to the collective story of our creative community. 
          Your lens sees what others might miss.
        </p>
      </div>

      {/* Enter Site Button - High z-index and explicit pointer events */}
      <div className="z-20 relative">
        <button
          onClick={handleButtonClick}
          className="inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 font-medium transition-all duration-200 hover:scale-105 shadow-lg group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer z-20 relative"
          type="button"
          style={{ pointerEvents: 'auto' }}
        >
          <span>Enter Site</span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Debug info - remove this later */}
      <div className="mt-4 text-xs text-muted-foreground z-10 relative">
        <p>Debug: Button should be clickable above</p>
        <p>Check browser console for click events</p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center text-sm text-muted-foreground pointer-events-none">
        <p>Ready to capture your next happening?</p>
      </div>

      {/* Floating Elements - make sure they don't interfere */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-pulse opacity-60 pointer-events-none"></div>
      <div className="absolute top-40 right-16 w-1 h-1 bg-muted-foreground rounded-full animate-pulse opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-40 right-12 w-1 h-1 bg-muted-foreground rounded-full animate-pulse opacity-50 pointer-events-none"></div>
    </div>
  );
}