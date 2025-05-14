"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Moon } from 'lucide-react';
import type { SleepEntry, FormattedSleepEntry } from '@/types/sleep';
import { addSleepEntry, deleteSleepEntry, getSleepData, clearAllSleepData } from '@/lib/local-storage';
import { useIsClient } from '@/hooks/use-is-client';
import { useToast } from "@/hooks/use-toast";
import { SleepLoggerForm } from '@/components/sleep-logger-form';
import { SleepTipsDisplay } from '@/components/sleep-tips-display';
import { SleepDataChart } from '@/components/sleep-data-chart';
import { SleepHistoryList } from '@/components/sleep-history-list';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format, differenceInMilliseconds } from 'date-fns';

function getSleepTips(sleepDurationHours: number): string[] {
  if (sleepDurationHours < 8) {
    return [
      "Prioritize sleep hygiene: Stick to a consistent bedtime and wake-up schedule (even on weekends).",
      "Optimize your environment: Keep your bedroom cool (60–67°F), dark, and quiet.",
      "Avoid stimulants: Cut off caffeine 6–8 hours before bed and avoid heavy meals/alcohol.",
      "Limit screen time: Stop using phones/TVs 1–2 hours before bed (blue light disrupts melatonin).",
      "Nap strategically: Take short 20–30 minute naps if sleep-deprived to avoid grogginess.",
      "Track your sleep: Use apps like SlumberAI to monitor patterns and adjust habits.",
      "Get morning sunlight: Exposure to daylight helps reset your circadian rhythm.",
      "Manage stress: Practice mindfulness, yoga, or journaling to reduce anxiety.",
      "Avoid late-night fluids: Minimize bathroom trips disrupting sleep.",
    ];
  } else if (sleepDurationHours >= 8 && sleepDurationHours <= 10) {
    return [
      "Great job! You’re within the recommended 8–10 hour range for optimal health.",
      "Maintain consistency: Stick to your sleep schedule even on weekends.",
      "Stay active: Daily exercise improves sleep quality and daytime alertness.",
      "Hydrate wisely: Drink water in the morning to kickstart your metabolism.",
      "Limit weekend sleep-ins: Avoid drastic changes to prevent social jetlag.",
      "Track your sleep: Monitor trends to catch deviations early.",
      "Reduce screen time: Dim lights and avoid screens 1 hour before bed.",
      "Review your diet: Avoid sugary snacks or large meals close to bedtime.",
    ];
  } else {
    return [
      "Check for underlying issues: Oversleeping may signal depression, thyroid disorders, or sleep apnea.",
      "Set a firm alarm: Avoid lingering in bed to prevent grogginess and lethargy.",
      "Stay active: Light exercise like walking regulates your sleep-wake cycle.",
      "Hydrate smartly: Drink water immediately after waking to reduce fatigue.",
      "Limit long naps: Avoid daytime naps exceeding 30 minutes.",
      "Consult a specialist: Rule out sleep disorders like hypersomnia.",
      "Morning sunlight: 15 minutes of daylight helps stabilize your rhythm.",
      "Avoid alcohol: It disrupts sleep cycles, leading to poor-quality rest.",
    ];
  }
}

export default function SlumberAIPage() {
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([]);
  const [personalizedTips, setPersonalizedTips] = useState<string[]>([]);
  const [isLoggingSleep, setIsLoggingSleep] = useState(false);

  const isClient = useIsClient();
  const { toast } = useToast();

  useEffect(() => {
    if (isClient) {
      setSleepEntries(getSleepData());
      setPersonalizedTips([
        "Stick to a consistent sleep schedule, going to bed and waking up around the same time daily, even on weekends.",
        "Create a relaxing pre-sleep routine, like reading a book, taking a warm bath, or listening to calming music.",
        "Ensure your bedroom is dark, quiet, cool, and comfortable for optimal sleep.",
        "Limit exposure to bright screens (phones, tablets, computers, TV) at least an hour before bedtime.",
        "Avoid large meals, caffeine, and alcohol close to bedtime as they can disrupt sleep.",
        "Get regular physical activity during the day, but try to avoid intense workouts close to bedtime.",
        "If you can't sleep after 20 minutes, get out of bed and do something relaxing until you feel tired.",
      ]);
    }
  }, [isClient]);

  const handleLogSleep = async (bedtime: Date, wakeUpTime: Date) => {
    setIsLoggingSleep(true);
    const durationMs = differenceInMilliseconds(wakeUpTime, bedtime);
    const sleepDurationHours = durationMs / (1000 * 60 * 60);

    if (sleepDurationHours <= 0) {
      toast({
        title: "Invalid Sleep Duration",
        description: "Wake up time must be after bedtime.",
        variant: "destructive",
      });
      setIsLoggingSleep(false);
      return;
    }

    const newEntry: SleepEntry = {
      id: crypto.randomUUID(),
      bedtime: bedtime.toISOString(),
      wakeUpTime: wakeUpTime.toISOString(),
      sleepDuration: sleepDurationHours,
      dateLogged: new Date().toISOString(),
    };

    const updatedEntries = addSleepEntry(newEntry);
    setSleepEntries(updatedEntries);

    // Generate dynamic tips based on sleep duration
    const dynamicTips = getSleepTips(sleepDurationHours);
    setPersonalizedTips(dynamicTips);

    toast({
      title: "Sleep Logged!",
      description: `You slept for ${sleepDurationHours.toFixed(1)} hours.`,
    });

    setIsLoggingSleep(false);
  };

  const handleDeleteEntry = (id: string) => {
    const updatedEntries = deleteSleepEntry(id);
    setSleepEntries(updatedEntries);
    toast({
      title: "Entry Deleted",
      description: "The sleep entry has been removed.",
    });
  };

  const handleClearAllEntries = () => {
    const updatedEntries = clearAllSleepData();
    setSleepEntries(updatedEntries);
    setPersonalizedTips([]);
    toast({
      title: "All Data Cleared",
      description: "Your sleep history has been cleared.",
    });
  };

  const formattedSleepEntries: FormattedSleepEntry[] = sleepEntries
    .map(entry => {
      const bedTimeDate = new Date(entry.bedtime);
      const wakeUpTimeDate = new Date(entry.wakeUpTime);
      const dateLoggedDate = new Date(entry.dateLogged);

      return {
        ...entry,
        formattedBedtime: format(bedTimeDate, "p, PPP"),
        formattedWakeUpTime: format(wakeUpTimeDate, "p, PPP"),
        formattedDateLogged: format(dateLoggedDate, "MMM d, yyyy"),
        dayOfWeek: format(bedTimeDate, "EEE"),
      };
    })
    .sort((a, b) => new Date(b.dateLogged).getTime() - new Date(a.dateLogged).getTime());

  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Moon className="w-16 h-16 text-primary animate-pulse" />
        <p className="mt-4 text-xl text-foreground">Loading SlumberAI...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center h-16 max-w-screen-2xl">
          <Moon className="w-8 h-8 mr-3 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">CIRCADIA</h1>
        </div>
      </header>

      <main className="flex-1 container max-w-screen-2xl py-8 px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <SleepLoggerForm onLogSleep={handleLogSleep} isLoading={isLoggingSleep} />
            <SleepDataChart data={formattedSleepEntries} />
          </div>

          <div className="lg:col-span-1 space-y-8">
            <SleepTipsDisplay tips={personalizedTips} />
          </div>
        </div>

        <Separator className="my-12" />

        <SleepHistoryList 
          entries={formattedSleepEntries} 
          onDeleteEntry={handleDeleteEntry}
          onClearAll={handleClearAllEntries}
        />
      </main>

      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row max-w-screen-2xl">
          <p className="text-sm text-center text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} CIRCADIA. Sweet Dreams!
          </p>
          <Image src="https://placehold.co/100x30.png" alt="Calming Abstract Footer Image" width={100} height={30} className="rounded" />
        </div>
      </footer>
    </div>
  );
}