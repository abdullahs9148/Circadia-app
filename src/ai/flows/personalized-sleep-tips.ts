// src/ai/flows/personalized-sleep-tips.ts
'use server';
/**
 * @fileOverview Personalized sleep tips based on logged sleep data.
 *
 * - getPersonalizedSleepTips - A function that provides personalized sleep tips.
 * - SleepDataInput - The input type for the getPersonalizedSleepTips function.
 * - SleepTipsOutput - The return type for the getPersonalizedSleepTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SleepDataInputSchema = z.object({
  bedtime: z
    .string()
    .describe('The time the user went to bed, in ISO format (e.g., 2024-07-21T22:30:00Z).'),
  wakeUpTime: z
    .string()
    .describe('The time the user woke up, in ISO format (e.g., 2024-07-22T06:30:00Z).'),
  sleepDuration: z
    .number()
    .describe('The duration of sleep in hours, calculated from bedtime and wakeUpTime.'),
});

export type SleepDataInput = z.infer<typeof SleepDataInputSchema>;

const SleepTipsOutputSchema = z.object({
  sleepTips: z.array(z.string()).describe('Personalized sleep tips for the user based on their sleep data.'),
});

export type SleepTipsOutput = z.infer<typeof SleepTipsOutputSchema>;

export async function getPersonalizedSleepTips(input: SleepDataInput): Promise<SleepTipsOutput> {
  return personalizedSleepTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedSleepTipsPrompt',
  input: {schema: SleepDataInputSchema},
  output: {schema: SleepTipsOutputSchema},
  prompt: `You are a sleep expert providing personalized sleep tips.

  Based on the following sleep data, provide personalized sleep tips to improve the user's sleep habits.

  Bedtime: {{{bedtime}}}
  Wake-up time: {{{wakeUpTime}}}
  Sleep duration: {{{sleepDuration}}} hours

  Provide 3-5 actionable sleep tips.
  Ensure the tips are tailored to the user's specific sleep patterns.
  Consider factors like sleep duration and consistency.
  Avoid generic advice; focus on personalized recommendations.
  Ensure the sleep tips are in a bulleted list format.

  Here are some examples of good sleep tips:
  - Establish a consistent sleep schedule by going to bed and waking up around the same time every day, even on weekends.
  - Create a relaxing bedtime routine to unwind before sleep, such as reading a book or taking a warm bath.
  - Optimize your sleep environment by ensuring your bedroom is dark, quiet, and cool.
  `,
});

const personalizedSleepTipsFlow = ai.defineFlow(
  {
    name: 'personalizedSleepTipsFlow',
    inputSchema: SleepDataInputSchema,
    outputSchema: SleepTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);