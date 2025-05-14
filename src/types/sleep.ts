export interface SleepEntry {
    id: string;
    bedtime: string; // ISO string
    wakeUpTime: string; // ISO string
    sleepDuration: number; // in hours
    dateLogged: string; // ISO string of when the entry was created
  }
  
  export interface FormattedSleepEntry extends SleepEntry {
    formattedBedtime: string;
    formattedWakeUpTime: string;
    formattedDateLogged: string;
    dayOfWeek: string;
  }