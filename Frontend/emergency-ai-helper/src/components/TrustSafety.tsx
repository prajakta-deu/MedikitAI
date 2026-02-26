import { Shield, Lock, Zap, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const trustPoints = [
  {
    icon: Zap,
    title: "AI-Assisted Guidance",
    description: "Advanced AI provides instant, accurate first-aid recommendations.",
  },
  {
    icon: Lock,
    title: "Privacy-First Design",
    description: "Your health data is never stored or shared. Complete confidentiality.",
  },
  {
    icon: Shield,
    title: "Emergency-Focused",
    description: "Built specifically for emergency situations with rapid response times.",
  },
];

const TrustSafety = () => {
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trust & Safety
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your safety is our priority. Our platform is designed with the highest 
            standards of security and medical accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {trustPoints.map((point, index) => (
            <Card
              key={index}
              className="border-border card-elevated hover:card-elevated-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <point.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {point.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {point.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start gap-4 p-5 bg-warning/5 border border-warning/20 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-foreground mb-1">
                Important Disclaimer
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This AI assistant provides general first-aid guidance only and is not a substitute 
                for professional medical advice, diagnosis, or treatment. In case of serious 
                emergencies, always call your local emergency services immediately. The information 
                provided should be used as a supplement to, not a replacement for, professional 
                medical care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSafety;
