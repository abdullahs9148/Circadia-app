"use client";

import type { SleepEntry } from '@/types/sleep';

const STORAGE_KEY = 'slumberAIData';

export function getSleepData(): SleepEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const data = window.localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading sleep data from local storage:", error);
    return [];
  }
}

export function addSleepEntry(entry: SleepEntry): SleepEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }
  const currentData = getSleepData();
  const newData = [entry, ...currentData];
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  } catch (error) {
    console.error("Error saving sleep data to local storage:", error);
  }
  return newData;
}

export function deleteSleepEntry(id: string): SleepEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }
  const currentData = getSleepData();
  const newData = currentData.filter(entry => entry.id !== id);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  } catch (error) {
    console.error("Error updating sleep data in local storage:", error);
  }
  return newData;
}

export function clearAllSleepData(): SleepEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing sleep data from local storage:", error);
  }
  return [];
}