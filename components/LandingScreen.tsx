import React from 'react';
import { Camera, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

interface LandingScreenProps {
  onEnterSite: () => void;
}

export function LandingScreen({ onEnterSite }: LandingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 200, 255, 0.3) 0%, transparent 50%)
          `
        }}></div>
      </div>

      {/* Logo and App Name */}
      <div className="mb-8 text-center">
        <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
          <Camera className="h-10 w-10 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground">Happenings</h2>
      </div>

      {/* Main Message */}
      <div className="text-center mb-12 space-y-6 max-w-2xl">
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

      {/* Enter Site Button */}
      <Button
        onClick={onEnterSite}
        size="lg"
        className="text-lg px-8 py-6 h-auto group hover:scale-105 transition-all duration-200 shadow-lg"
      >
        <span className="mr-3">Enter Site</span>
        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </Button>

      {/* Footer */}
      <div className="absolute bottom-8 text-center text-sm text-muted-foreground">
        <p>Ready to capture your next happening?</p>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-40 right-16 w-1 h-1 bg-muted-foreground rounded-full animate-pulse opacity-40"></div>
      <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse"></div>
      <div className="absolute bottom-40 right-12 w-1 h-1 bg-muted-foreground rounded-full animate-pulse opacity-50"></div>
    </div>
  );
}