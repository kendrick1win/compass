"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, ChevronDown } from "lucide-react";

interface AIPromptsProps {
  chineseCharacters?: string;
  title?: string;
  description?: string;
  className?: string;
  embedded?: boolean;
}

export function AIPrompts({ 
  chineseCharacters, 
  title = "Sample prompts you can use:",
  description = "Copy your chart and ask ChatGPT, DeepSeek, or other AI tools for more insights about your BaZi reading!",
  className = "",
  embedded = false
}: AIPromptsProps) {
  const [copied, setCopied] = useState(false);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [showPrompts, setShowPrompts] = useState(false);

  // Sample prompts for AI tools
  const samplePrompts = [
    {
      id: "career",
      title: "Career Guidance",
      prompt: "Based on this BaZi chart, what career paths would be most suitable for me? What are my strengths and potential challenges in the workplace?"
    },
    {
      id: "relationships",
      title: "Relationships & Compatibility",
      prompt: "What does this BaZi chart reveal about my personality in relationships? What type of partner would be most compatible with me?"
    },
    {
      id: "health",
      title: "Health & Wellness",
      prompt: "What health aspects should I pay attention to based on this BaZi chart? Are there any specific elements I should balance?"
    },
    {
      id: "timing",
      title: "Timing & Luck",
      prompt: "What are the best times for important decisions based on this BaZi chart? When should I be more cautious?"
    },
    {
      id: "general",
      title: "General Analysis",
      prompt: "Please provide a comprehensive analysis of this BaZi chart. What are the key characteristics and life themes for this person?"
    }
  ];

  // Function to copy chart text
  const copyChartText = async () => {
    if (!chineseCharacters) return;
    
    try {
      await navigator.clipboard.writeText(chineseCharacters);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  // Function to copy selected prompt
  const copyPrompt = async (promptText: string, promptId: string) => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedPromptId(promptId);
      setTimeout(() => setCopiedPromptId(null), 2000);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
  };

  return (
    <>
      {!embedded ? (
        <Card className={`border-primary/20 ${className}`}>
          <CardHeader className="bg-primary/3 text-center">
            <CardTitle className="text-xl font-semibold">
              Get More Insights
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              You can use AI tools to ask more about your BaZi chart
            </p>
            <p className="text-sm text-muted-foreground">
              Just click Copy Chart and use one of our sample prompts to get started!
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {chineseCharacters && (
                <div className="flex flex-col items-center space-y-3">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyChartText}
                      className="flex items-center space-x-2"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 text-green-600" />
                          <span>Chart Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>Copy Chart</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    {description}
                  </p>
                </div>
              )}
              
              {/* Sample prompts section */}
              <div className="w-full max-w-md mx-auto space-y-3">
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground mb-2">
                    {title}
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPrompts(!showPrompts)}
                    className="flex items-center justify-between"
                  >
                    <span>View Sample Prompts</span>
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform duration-200 ${
                        showPrompts ? 'rotate-180' : ''
                      }`} 
                    />
                  </Button>
                  
                  {showPrompts && (
                    <div className="space-y-3 pt-2">
                      {samplePrompts.map((prompt) => (
                        <div key={prompt.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-foreground">
                              {prompt.title}
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyPrompt(prompt.prompt, prompt.id)}
                              className="h-6 px-2 text-xs"
                            >
                              {copiedPromptId === prompt.id ? (
                                <>
                                  <Check className="h-3 w-3 text-green-600 mr-1" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3 mr-1" />
                                  Copy
                                </>
                              )}
                            </Button>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-md border">
                            <p className="text-sm text-muted-foreground">
                              {prompt.prompt}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {chineseCharacters && (
            <div className="flex flex-col items-center space-y-3">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyChartText}
                  className="flex items-center space-x-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Chart Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy Chart</span>
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                {description}
              </p>
            </div>
          )}
          
          {/* Sample prompts section */}
          <div className="w-full max-w-md mx-auto space-y-3">
            <div className="text-center">
              <p className="text-sm font-medium text-foreground mb-2">
                {title}
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPrompts(!showPrompts)}
                className="flex items-center justify-between"
              >
                <span>View Sample Prompts</span>
                <ChevronDown 
                  className={`h-4 w-4 transition-transform duration-200 ${
                    showPrompts ? 'rotate-180' : ''
                  }`} 
                />
              </Button>
              
              {showPrompts && (
                <div className="space-y-3 pt-2">
                  {samplePrompts.map((prompt) => (
                    <div key={prompt.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-foreground">
                          {prompt.title}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyPrompt(prompt.prompt, prompt.id)}
                          className="h-6 px-2 text-xs"
                        >
                          {copiedPromptId === prompt.id ? (
                            <>
                              <Check className="h-3 w-3 text-green-600 mr-1" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-md border">
                        <p className="text-sm text-muted-foreground">
                          {prompt.prompt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}