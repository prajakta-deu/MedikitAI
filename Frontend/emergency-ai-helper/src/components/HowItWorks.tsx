import { MessageSquare, Brain, Heart, MapPin } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Describe Emergency",
    description: "Type or upload an image of your injury or emergency situation.",
    color: "primary",
  },
  {
    icon: Brain,
    title: "AI Analyzes",
    description: "Our AI instantly processes your input to identify the condition.",
    color: "ai-primary",
  },
  {
    icon: Heart,
    title: "Get First Aid",
    description: "Receive step-by-step guidance tailored to your situation.",
    color: "success",
  },
  {
    icon: MapPin,
    title: "Find Hospitals",
    description: "Locate nearby emergency facilities with directions.",
    color: "warning",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get emergency assistance in four simple steps. Our AI-powered system 
            provides instant guidance when you need it most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-border via-primary/30 to-border" />
              )}

              <div className="relative bg-card rounded-2xl p-6 card-elevated hover:card-elevated-lg transition-all duration-300 group-hover:-translate-y-1">
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground font-display font-bold text-sm flex items-center justify-center">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl gradient-ai flex items-center justify-center mb-4 ai-glow group-hover:ai-glow-strong transition-shadow">
                  <step.icon className="w-7 h-7 text-primary-foreground" />
                </div>

                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
