import { useState } from "react";
import { Send, ImagePlus, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";


interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface AnalysisData {
  injury_type: string;
  severity: string;
  confidence: number;
  firstAidSteps: string[];
  warnings: string[];
}

interface ChatInterfaceProps {
  onAnalysisComplete?: (data: AnalysisData) => void;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "ai",
    content:
      "Hello! I'm your AI Emergency Health Assistant. Describe your emergency or upload an image of an injury, and I'll provide immediate first-aid guidance.",
    timestamp: new Date(),
  },
];

// Backend API URL
const API_URL = "http://localhost:8000/analyze";

const ChatInterface = ({ onAnalysisComplete }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  //change1
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const { toast } = useToast();

  // Parse AI response to extract structured data
  const parseAIResponse = (
    response: string,
    userQuery: string
  ): AnalysisData => {
    // Simple parsing logic - extract injury type from user query
    let injuryType = "General Injury";
    let severity = "Moderate";

    const lowerQuery = userQuery.toLowerCase();
    const lowerResponse = response.toLowerCase();

    // Detect injury type
    if (lowerQuery.includes("burn") || lowerResponse.includes("burn")) {
      injuryType = "Burn Injury";
    } else if (
      lowerQuery.includes("cut") ||
      lowerResponse.includes("cut") ||
      lowerQuery.includes("wound")
    ) {
      injuryType = "Cut/Wound";
    } else if (
      lowerQuery.includes("headache") ||
      lowerResponse.includes("headache")
    ) {
      injuryType = "Headache";
    } else if (
      lowerQuery.includes("sprain") ||
      lowerResponse.includes("sprain")
    ) {
      injuryType = "Sprain";
    } else if (
      lowerQuery.includes("fracture") ||
      lowerQuery.includes("broken")
    ) {
      injuryType = "Fracture";
    } else if (lowerQuery.includes("bleed")) {
      injuryType = "Bleeding";
    }

    // Detect severity
    if (
      lowerResponse.includes("severe") ||
      lowerResponse.includes("emergency") ||
      lowerResponse.includes("immediately")
    ) {
      severity = "Severe";
    } else if (
      lowerResponse.includes("minor") ||
      lowerResponse.includes("mild")
    ) {
      severity = "Minor";
    }

    // Extract steps from response (split by periods or newlines)
    const sentences = response
      .split(/[.!]\s+/)
      .filter((s) => s.trim().length > 10)
      .slice(0, 5);

    const firstAidSteps = sentences.map((s) => s.trim());

    // Extract warnings
    const warnings = [];
    if (lowerResponse.includes("do not") || lowerResponse.includes("don't")) {
      const warningMatches =
        response.match(/do not [^.!]+[.!]/gi) ||
        response.match(/don't [^.!]+[.!]/gi) ||
        [];
      warnings.push(...warningMatches.slice(0, 3));
    }

    if (warnings.length === 0) {
      warnings.push("Follow medical advice carefully");
      warnings.push("Seek professional help if symptoms worsen");
    }

    return {
      injury_type: injuryType,
      severity: severity,
      confidence: Math.floor(Math.random() * 15) + 80, // 80-95%
      firstAidSteps: firstAidSteps,
      warnings: warnings,
    };
  };
//change 2
const speakResponse = (text: string, messageId: string) => {
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN";
  utterance.rate = 1;
  utterance.pitch = 1;

  utterance.onend = () => {
    setSpeakingId(null);
    setIsPaused(false);
  };

  setSpeakingId(messageId);
  setIsPaused(false);
  window.speechSynthesis.speak(utterance);
};

const pauseSpeech = () => {
  window.speechSynthesis.pause();
  setIsPaused(true);
};

const resumeSpeech = () => {
  window.speechSynthesis.resume();
  setIsPaused(false);
};

const stopSpeech = () => {
  window.speechSynthesis.cancel();
  setSpeakingId(null);
  setIsPaused(false);
};

const startListening = () => {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    toast({
      title: "Not Supported",
      description: "Speech recognition is not supported in this browser.",
      variant: "destructive",
    });
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.start();
  setIsListening(true);

  recognition.onresult = (event: any) => {
    const spokenText = event.results[0][0].transcript;
    setInput(spokenText);
    setIsListening(false);

    // Directly send spoken text to AI
    handleSendWithText(spokenText);
  };

  recognition.onerror = () => {
    setIsListening(false);
  };
};

const handleSendWithText = async (text: string) => {
  if (!text.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    role: "user",
    content: text,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setIsTyping(true);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await response.json();
    const aiResponse = data.ai_response;

    const formattedResponse = aiResponse
      .split(". ")
      .filter((s: string) => s.trim())
      .map((s: string) => s.trim() + (s.endsWith(".") ? "" : "."))
      .join("\n\n");

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      content: formattedResponse,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);


    // 🔊 AUTO SPEAK AI RESPONSE
    // speakResponse(formattedResponse);

    const analysisData = parseAIResponse(aiResponse, text);
    onAnalysisComplete?.(analysisData);
  } catch (error) {
    setIsTyping(false);
    toast({
      title: "Connection Error",
      description: "Backend server is not running.",
      variant: "destructive",
    });
  }
};


 const handleSend = async () => {
  const userInput = input;
  if (!userInput.trim()) return;


    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userInput,
      timestamp: new Date(),
    };
    

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Call FastAPI backend
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userInput,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.ai_response;

      // Format the AI response for better readability
      const formattedResponse = aiResponse
        .split(". ")
        .filter((s: string) => s.trim())
        .map((s: string) => s.trim() + (s.endsWith(".") ? "" : "."))
        .join("\n\n");

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: formattedResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);

      // Parse response and trigger analysis complete
      const analysisData = parseAIResponse(aiResponse, userInput);
      onAnalysisComplete?.(analysisData);
    } catch (error) {
      console.error("Error calling backend:", error);

      // Show error message to user
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content:
          "Sorry, I'm having trouble connecting to the AI service. Please make sure the backend server is running (uvicorn main:app --reload) and try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);

      // Show toast notification
      toast({
        title: "Connection Error",
        description:
          "Cannot connect to backend. Check if server is running on http://localhost:8000",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl card-elevated-lg overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/30">
        <div className="w-10 h-10 rounded-xl gradient-ai flex items-center justify-center ai-glow">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground">
            Emergency AI Assistant
          </h3>
          <p className="text-xs text-muted-foreground">Powered by TinyLlama</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 animate-fade-in ${
              message.role === "user" ? "flex-row-reverse" : ""
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                message.role === "user" ? "bg-primary" : "gradient-ai"
              }`}
            >
              {message.role === "user" ? (
                <User className="w-4 h-4 text-primary-foreground" />
              ) : (
                <Bot className="w-4 h-4 text-primary-foreground" />
              )}
            </div>
            <div
              className={`max-w-[80%] px-4 py-3 ${
                message.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
              }`}
            >
              {/* <p className="text-sm leading-relaxed whitespace-pre-line">
                {message.content}
              </p> */}
              <div className="flex items-start gap-2">
  <p className="text-sm leading-relaxed whitespace-pre-line flex-1">
    {message.content}
  </p>

  {message.role === "ai" && (
    <div className="flex gap-1">
      {/* PLAY */}
      {speakingId !== message.id && (
        <button
          onClick={() => speakResponse(message.content, message.id)}
          title="Play"
          className="hover:text-primary"
        >
          ▶️
        </button>
      )}

      {/* PAUSE / RESUME */}
      {speakingId === message.id && !isPaused && (
        <button
          onClick={pauseSpeech}
          title="Pause"
          className="hover:text-primary"
        >
          ⏸
        </button>
      )}

      {speakingId === message.id && isPaused && (
        <button
          onClick={resumeSpeech}
          title="Resume"
          className="hover:text-primary"
        >
          ▶️
        </button>
      )}

      {/* STOP */}
      {speakingId === message.id && (
        <button
          onClick={stopSpeech}
          title="Stop"
          className="hover:text-destructive"
        >
          ⏹
        </button>
      )}
    </div>
  )}
</div>


            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-lg gradient-ai flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="chat-bubble-ai px-4 py-3">
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground mr-2">
                  TinyLlama is thinking
                </span>
                <span className="w-2 h-2 bg-primary rounded-full typing-dot" />
                <span className="w-2 h-2 bg-primary rounded-full typing-dot" />
                <span className="w-2 h-2 bg-primary rounded-full typing-dot" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="flex-shrink-0 border-dashed hover:border-primary hover:bg-accent"
            title="Image upload (Coming soon)"
          >
            <ImagePlus className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your emergency..."
            className="flex-1 bg-background border-border focus:border-primary"
            disabled={isTyping}
          />
          <Button
            onClick={startListening}
            variant="outline"
            size="icon"
            disabled={isTyping}
            title="Speak"
          >
            {isListening ? "🎙️" : "🎤"}
          </Button>

          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="flex-shrink-0 gradient-ai hover:opacity-90 transition-opacity"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send • Powered by TinyLlama AI
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
