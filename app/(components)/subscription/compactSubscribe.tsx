// Alternative compact version for use in other components
"use client";

import React, { useState } from "react";

interface SubscribeCardProps {
  onSubscribe?: () => void;
  loading?: boolean;
  className?: string;
}

export function CompactSubscribeCard({
  onSubscribe,
  loading = false,
  className = "",
}: SubscribeCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async () => {
    if (onSubscribe) {
      setIsProcessing(true);
      try {
        await onSubscribe();
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div
      className={`p-6 border border-border rounded-lg bg-background ${className}`}
    >
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4 mx-auto">
          <span className="text-2xl">✨</span>
        </div>
        <h3 className="text-xl font-medium mb-2">Premium Readings</h3>
        <p className="text-muted-foreground mb-4">
          Daily guidance + pair analysis
        </p>

        <div className="mb-4">
          <span className="text-2xl font-light">£1</span>
          <span className="text-muted-foreground">/week</span>
        </div>

        <button
          onClick={handleSubscribe}
          disabled={loading || isProcessing}
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading || isProcessing ? "Processing..." : "Subscribe"}
        </button>
      </div>
    </div>
  );
}
