import { Heart, Shield, Zap, MapPin, MessageSquare, Info, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="relative overflow-hidden gradient-hero">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-ai-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 py-8 lg:py-12">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-ai flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">MedAI</span>
          </div>
          
          {/* Navigation Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            <button 
              onClick={() => scrollToSection('chat-section')}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              AI Assistant
            </button>
            <button 
              onClick={() => scrollToSection('hospitals-section')}
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1.5 rounded-full"
            >
              <MapPin className="w-4 h-4" />
              Hospitals
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <Info className="w-4 h-4" />
              How It Works
            </button>
          </div>
          
          <Badge 
            variant="outline" 
            className="border-emergency/30 bg-emergency-soft text-emergency font-medium px-3 py-1.5 emergency-pulse"
          >
            <span className="w-2 h-2 bg-emergency rounded-full mr-2 animate-pulse" />
            24/7 Emergency Support
          </Badge>
        </nav>

        {/* Hero Content */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-accent/60 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-accent-foreground">AI-Powered Emergency Assistance</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight">
            AI-Powered{" "}
            <span className="text-primary">Emergency</span>{" "}
            Health Assistant
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Instant first-aid guidance & hospital support powered by AI. 
            Get help when every second counts.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Privacy-First</span>
            </div>
            <div className="w-1 h-1 bg-border rounded-full" />
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>Instant Response</span>
            </div>
            <div className="w-1 h-1 bg-border rounded-full" />
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              <span>Medical-Grade AI</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
