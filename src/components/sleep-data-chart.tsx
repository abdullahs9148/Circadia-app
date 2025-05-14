"use client";

import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { FormattedSleepEntry } from '@/types/sleep';
import { BarChart3 } from 'lucide-react';

interface SleepDataChartProps {
  data: FormattedSleepEntry[];
}

export function SleepDataChart({ data }: SleepDataChartProps) {
  const formatShortDate = (isoDateString: string) => {
    try {
      return new Date(isoDateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (e) {
      return "Invalid Date";
    }
  };

  const chartData = data
    .map(entry => ({
      name: `${entry.dayOfWeek}, ${formatShortDate(entry.bedtime)}`,
      duration: parseFloat(entry.sleepDuration.toFixed(1)),
    }))
    .reverse(); // Show most recent data to the right or left based on preference, reversing for chronological display.

  return (
    <Card className="w-full shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-semibold">
          <BarChart3 className="w-7 h-7 mr-3 text-primary" />
          Sleep Duration Overview
        </CardTitle>
        <CardDescription>Your sleep duration in hours over time.</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No sleep data yet. Log your sleep to see the chart.</p>
          </div>
        ) : (
          <div className="h-80 w-full"> {/* Fixed height for the chart container */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} 
                  stroke="hsl(var(--foreground))"
                  tickFormatter={(value) => value.substring(0, value.lastIndexOf(','))} // Show only day of week or part of date
                />
                <YAxis 
                  label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: 'hsl(var(--foreground))', fontSize: 14, dy: 40, dx: -5 }}
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                  stroke="hsl(var(--foreground))"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))',
                    borderRadius: 'var(--radius)',
                  }}
                  cursor={{ fill: 'hsl(var(--accent))', opacity: 0.3 }}
                />
                <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
                <Bar dataKey="duration" name="Sleep Duration (hours)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}