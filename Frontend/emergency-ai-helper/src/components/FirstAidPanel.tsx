import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnalysisData {
  injury_type: string;
  severity: string;
  confidence: number;
  firstAidSteps: string[];
  warnings: string[];
}

interface FirstAidPanelProps {
  visible: boolean;
  analysisData: AnalysisData | null;
}

const FirstAidPanel = ({ visible, analysisData }: FirstAidPanelProps) => {
  if (!visible || !analysisData) return null;

  // Create structured steps from AI response
  const structuredSteps = analysisData.firstAidSteps.map((step, index) => {
    // Detect if step is critical based on keywords
    const isCritical =
      step.toLowerCase().includes("immediately") ||
      step.toLowerCase().includes("urgent") ||
      step.toLowerCase().includes("emergency") ||
      step.toLowerCase().includes("seek medical") ||
      index === 0; // First step is often most critical

    return {
      step: index + 1,
      title: `Step ${index + 1}`,
      description: step,
      critical: isCritical,
    };
  });

  // Ensure we have at least some warnings
  const displayWarnings =
    analysisData.warnings.length > 0
      ? analysisData.warnings
      : [
          "Follow all instructions carefully",
          "Seek professional medical help if symptoms worsen",
          "Do not delay emergency care if needed",
        ];

  return (
    <Card
      className="card-elevated-lg border-border overflow-hidden animate-slide-up"
      style={{ animationDelay: "0.1s" }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-success" />
            </div>
            First Aid Guidance
          </CardTitle>
          <Badge className="bg-primary/10 text-primary border-primary/20">
            {structuredSteps.length} Steps
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Steps */}
        <div className="space-y-3">
          {structuredSteps.map((item) => (
            <div
              key={item.step}
              className={`relative flex gap-4 p-4 rounded-xl transition-colors ${
                item.critical
                  ? "bg-emergency-soft border border-emergency/20"
                  : "bg-muted/50"
              }`}
            >
              {/* Step Number */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-display font-bold text-sm ${
                  item.critical
                    ? "bg-emergency text-emergency-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {item.step}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h4 className="font-semibold text-foreground">
                    {item.title}
                  </h4>
                  {item.critical && (
                    <Badge
                      variant="outline"
                      className="border-emergency/50 text-emergency text-xs"
                    >
                      Important
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Warnings */}
        {displayWarnings.length > 0 && (
          <div className="p-4 bg-warning/5 border border-warning/20 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-warning font-medium">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Important Warnings</span>
            </div>
            <ul className="space-y-1.5">
              {displayWarnings.map((warning, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <span className="text-warning mt-0.5">•</span>
                  <span className="flex-1">{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Disclaimer */}
        <div className="p-3 bg-muted/30 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground text-center">
            This guidance is AI-generated. Always consult healthcare
            professionals for serious conditions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FirstAidPanel;
