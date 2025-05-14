"use client";

import React, { useState } from 'react';
import type { FormattedSleepEntry } from '@/types/sleep';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ListChecks, Trash2, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SleepHistoryListProps {
  entries: FormattedSleepEntry[];
  onDeleteEntry: (id: string) => void;
  onClearAll: () => void;
}

export function SleepHistoryList({ entries, onDeleteEntry, onClearAll }: SleepHistoryListProps) {
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [showClearAllDialog, setShowClearAllDialog] = useState(false);

  const handleDelete = () => {
    if (entryToDelete) {
      onDeleteEntry(entryToDelete);
      setEntryToDelete(null);
    }
  };
  
  const handleClearAllConfirm = () => {
    onClearAll();
    setShowClearAllDialog(false);
  };

  return (
    <Card className="w-full shadow-lg rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center text-2xl font-semibold">
            <ListChecks className="w-7 h-7 mr-3 text-primary" />
            Sleep History
          </CardTitle>
          <CardDescription>Review your past sleep logs.</CardDescription>
        </div>
        {entries.length > 0 && (
           <AlertDialog open={showClearAllDialog} onOpenChange={setShowClearAllDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" /> Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center"><AlertTriangle className="text-destructive mr-2"/>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your sleep data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAllConfirm} className="bg-destructive hover:bg-destructive/90">
                  Yes, delete all
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No sleep history yet. Start logging your sleep!</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Bedtime</TableHead>
                  <TableHead>Wake Up</TableHead>
                  <TableHead className="text-right">Duration</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.formattedDateLogged}</TableCell>
                    <TableCell>{entry.formattedBedtime}</TableCell>
                    <TableCell>{entry.formattedWakeUpTime}</TableCell>
                    <TableCell className="text-right">{entry.sleepDuration.toFixed(1)} hrs</TableCell>
                    <TableCell className="text-center">
                       <AlertDialog open={entryToDelete === entry.id} onOpenChange={(isOpen: any) => !isOpen && setEntryToDelete(null)}>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon" onClick={() => setEntryToDelete(entry.id)} aria-label="Delete entry">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Sleep Entry?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this sleep entry? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setEntryToDelete(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}