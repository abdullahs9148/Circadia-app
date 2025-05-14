"use client";

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BedDouble, CalendarIcon, Clock } from 'lucide-react';
import { format, parse } from 'date-fns';

const formSchema = z.object({
  bedtimeDate: z.date({ required_error: "Bedtime date is required." }),
  bedtimeTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)."),
  wakeUpDate: z.date({ required_error: "Wake up date is required." }),
  wakeUpTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)."),
}).refine(data => {
  const bedtime = new Date(data.bedtimeDate);
  const [bedHours, bedMinutes] = data.bedtimeTime.split(':').map(Number);
  bedtime.setHours(bedHours, bedMinutes, 0, 0);

  const wakeUp = new Date(data.wakeUpDate);
  const [wakeHours, wakeMinutes] = data.wakeUpTime.split(':').map(Number);
  wakeUp.setHours(wakeHours, wakeMinutes, 0, 0);
  
  return wakeUp > bedtime;
}, {
  message: "Wake up time must be after bedtime.",
  path: ["wakeUpTime"],
});

type SleepFormValues = z.infer<typeof formSchema>;

interface SleepLoggerFormProps {
  onLogSleep: (bedtime: Date, wakeUpTime: Date) => void;
  isLoading: boolean;
}

export function SleepLoggerForm({ onLogSleep, isLoading }: SleepLoggerFormProps) {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<SleepFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bedtimeDate: new Date(),
      bedtimeTime: "22:00",
      wakeUpDate: new Date(new Date().setDate(new Date().getDate() + 1)), // Default to next day
      wakeUpTime: "06:00",
    }
  });

  const onSubmit = (data: SleepFormValues) => {
    const bedtime = new Date(data.bedtimeDate);
    const [bedHours, bedMinutes] = data.bedtimeTime.split(':').map(Number);
    bedtime.setHours(bedHours, bedMinutes, 0, 0);

    const wakeUp = new Date(data.wakeUpDate);
    const [wakeHours, wakeMinutes] = data.wakeUpTime.split(':').map(Number);
    wakeUp.setHours(wakeHours, wakeMinutes, 0, 0);
    
    onLogSleep(bedtime, wakeUp);
    // reset(); // Optionally reset form after submission
  };

  return (
    <Card className="w-full shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-semibold">
          <BedDouble className="w-7 h-7 mr-3 text-primary" />
          Log Your Sleep
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bedtime */}
            <div className="space-y-3">
              <Label htmlFor="bedtimeDate" className="text-base font-medium">Bedtime</Label>
              <Controller
                name="bedtimeDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              <Controller
                name="bedtimeTime"
                control={control}
                render={({ field }) => (
                  <Input type="time" {...field} className="text-base" aria-label="Bedtime time" />
                )}
              />
              {errors.bedtimeDate && <p className="text-sm text-destructive">{errors.bedtimeDate.message}</p>}
              {errors.bedtimeTime && <p className="text-sm text-destructive">{errors.bedtimeTime.message}</p>}
            </div>

            {/* Wake-up Time */}
            <div className="space-y-3">
              <Label htmlFor="wakeUpDate" className="text-base font-medium">Wake-up Time</Label>
              <Controller
                name="wakeUpDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              <Controller
                name="wakeUpTime"
                control={control}
                render={({ field }) => (
                  <Input type="time" {...field} className="text-base" aria-label="Wake up time" />
                )}
              />
              {errors.wakeUpDate && <p className="text-sm text-destructive">{errors.wakeUpDate.message}</p>}
              {errors.wakeUpTime && <p className="text-sm text-destructive">{errors.wakeUpTime.message}</p>}
            </div>
          </div>
          
          {errors.root?.message && <p className="text-sm text-destructive">{errors.root.message}</p>}
          {errors.wakeUpTime?.type === "custom" && <p className="text-sm text-destructive">{errors.wakeUpTime.message}</p>}


          <Button type="submit" className="w-full text-lg py-3 mt-4" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 animate-spin" /> Logging...
              </div>
            ) : (
              "Log Sleep"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}