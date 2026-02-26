import { useState } from "react";
import { MapPin } from "lucide-react";
import Hero from "@/components/Hero";
import ChatInterface from "@/components/ChatInterface";
import InjuryDetectionCard from "@/components/InjuryDetectionCard";
import FirstAidPanel from "@/components/FirstAidPanel";
import HospitalSection from "@/components/HospitalSection";
import HowItWorks from "@/components/HowItWorks";
import TrustSafety from "@/components/TrustSafety";
import Footer from "@/components/Footer";
import DynamicBackground from "@/components/DynamicBackground";

interface AnalysisData {
  injury_type: string;
  severity: string;
  confidence: number;
  firstAidSteps: string[];
  warnings: string[];
}

const Index = () => {
  const [showResults, setShowResults] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const handleAnalysisComplete = (data: AnalysisData) => {
    setAnalysisData(data);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <DynamicBackground />
      <div className="relative z-10">
        <Hero />

        {/* Main Chat + Results Section */}
        <section id="chat-section" className="py-8 lg:py-12">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Chat Interface - Takes 3 columns on large screens */}
              <div className="lg:col-span-3">
                <div className="h-[600px]">
                  <ChatInterface onAnalysisComplete={handleAnalysisComplete} />
                </div>
              </div>

              {/* Results Panels - Takes 2 columns on large screens */}
              <div className="lg:col-span-2 space-y-6">
                {!showResults ? (
                  <div className="h-[600px] flex items-center justify-center bg-card rounded-2xl card-elevated border border-dashed border-border">
                    <div className="text-center p-8">
                      <div className="w-16 h-16 rounded-2xl gradient-ai flex items-center justify-center mx-auto mb-4 animate-float">
                        <svg
                          className="w-8 h-8 text-primary-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                        AI Analysis Results
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        Describe your emergency in the chat, and analysis
                        results will appear here automatically.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <InjuryDetectionCard
                      visible={showResults}
                      analysisData={analysisData}
                    />
                    <FirstAidPanel
                      visible={showResults}
                      analysisData={analysisData}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Dedicated Hospitals Section */}
        <section id="hospitals-section" className="py-12 lg:py-16 bg-accent/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Emergency Care
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Nearby Hospitals
              </h2>
              <p className="text-muted-foreground text-lg">
                Hospitals near your current location for emergency care. Find
                directions and contact information instantly.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <HospitalSection visible={true} />
            </div>
          </div>
        </section>

        <HowItWorks />
        <TrustSafety />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
