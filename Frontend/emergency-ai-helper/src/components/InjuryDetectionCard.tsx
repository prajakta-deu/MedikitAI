import { Flame, AlertTriangle, CheckCircle2, Activity, Heart, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnalysisData {
  injury_type: string;
  severity: string;
  confidence: number;
  firstAidSteps: string[];
  warnings: string[];
}

interface InjuryDetectionCardProps {
  visible: boolean;
  analysisData: AnalysisData | null;
}

const InjuryDetectionCard = ({ visible, analysisData }: InjuryDetectionCardProps) => {
  if (!visible || !analysisData) return null;

  // Get icon based on injury type
  const getInjuryIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("burn")) return Flame;
    if (lowerType.includes("cut") || lowerType.includes("wound")) return Zap;
    if (lowerType.includes("headache") || lowerType.includes("head")) return Activity;
    return Heart;
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    const lower = severity.toLowerCase();
    if (lower.includes("severe") || lower.includes("critical")) {
      return {
        bg: "bg-destructive/10",
        border: "border-destructive/20",
        text: "text-destructive",
      };
    }
    if (lower.includes("minor") || lower.includes("mild")) {
      return {
        bg: "bg-success/10",
        border: "border-success/20",
        text: "text-success",
      };
    }
    return {
      bg: "bg-warning/10",
      border: "border-warning/20",
      text: "text-warning",
    };
  };

  const InjuryIcon = getInjuryIcon(analysisData.injury_type);
  const severityColors = getSeverityColor(analysisData.severity);

  // Generate observations from first aid steps or create generic ones
  const observations = analysisData.firstAidSteps.slice(0, 3).map(step => {
    // Shorten each step to observation format
    const words = step.split(' ').slice(0, 5).join(' ');
    return words + (words.length < step.length ? '...' : '');
  });

  return (
    <Card className="card-elevated-lg border-border overflow-hidden animate-slide-up">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-warning" />
            </div>
            Injury Detection
          </CardTitle>
          <Badge className="bg-success/10 text-success border-success/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Analyzed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Injury Type */}
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
          <div className="w-12 h-12 rounded-xl bg-emergency/10 flex items-center justify-center">
            <InjuryIcon className="w-6 h-6 text-emergency" />
          </div>
          <div className="flex-1">
            <h4 className="font-display font-semibold text-foreground">
              {analysisData.injury_type}
            </h4>
            <p className="text-sm text-muted-foreground">AI-detected condition</p>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Confidence Level</span>
            <span className="font-semibold text-primary">{analysisData.confidence}%</span>
          </div>
          <div className="confidence-bar">
            <div 
              className="confidence-fill gradient-ai" 
              style={{ width: `${analysisData.confidence}%` }}
            />
          </div>
        </div>

        {/* Severity Indicator */}
        <div className={`flex items-center justify-between p-3 ${severityColors.bg} border ${severityColors.border} rounded-xl`}>
          <span className="text-sm font-medium text-foreground">Severity Level</span>
          <Badge variant="outline" className={`${severityColors.border} ${severityColors.text} ${severityColors.bg}`}>
            {analysisData.severity}
          </Badge>
        </div>

        {/* Key Observations */}
        {observations.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-muted-foreground">Key Analysis Points</h5>
            <ul className="space-y-1.5">
              {observations.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InjuryDetectionCard;