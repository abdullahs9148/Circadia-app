
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Loader2 } from 'lucide-react'; // Loader2 might be unused now

interface SleepTipsDisplayProps {
  tips: string[];
  // isLoading prop removed
}

export function SleepTipsDisplay({ tips }: SleepTipsDisplayProps) {
  // isLoading logic removed
  // if (isLoading) {
  //   return (
  //     <Card className="w-full shadow-lg rounded-xl">
  //       <CardHeader>
  //         <CardTitle className="flex items-center text-2xl font-semibold">
  //           <Lightbulb className="w-7 h-7 mr-3 text-accent" />
  //           Personalized Sleep Tips
  //         </CardTitle>
  //       </CardHeader>
  //       <CardContent className="flex items-center justify-center h-32">
  //         <Loader2 className="h-8 w-8 animate-spin text-primary" />
  //         <p className="ml-2 text-lg">Generating your tips...</p>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  if (!tips || tips.length === 0) {
    return (
       <Card className="w-full shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl font-semibold">
            <Lightbulb className="w-7 h-7 mr-3 text-accent" />
            Sleep Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* You might want to change this message if tips are always static or handled differently */}
          <p className="text-muted-foreground text-center py-4">Log your sleep to see relevant tips, or general tips are always available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-semibold">
          <Lightbulb className="w-7 h-7 mr-3 text-accent" />
          Sleep Tips 
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 list-disc list-inside text-base">
          {tips.map((tip, index) => (
            <li key={index} className="leading-relaxed">{tip}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}