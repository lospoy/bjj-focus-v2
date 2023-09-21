import React from "react";
import { api } from "~/utils/api";
import Link from "next/link";

// ShadCN UI Imports
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

// Types
import type { RouterOutputs } from "~/utils/api";
import { DatePickerWithRange } from "./ui/datepickerRange";
type IntentData = RouterOutputs["intents"]["getById"];

const useIntentData = (id: string): IntentData | undefined => {
  const { data } = api.intents.getById.useQuery({ id });

  return data;
};

const getIntentData = (id: string): IntentData | undefined => {
  const { data } = api.intents.getById.useQuery({ id });

  return data;
};

interface IntentFormData {
  startDate: Date;
  endDate: Date;
  reminders: string;
}

interface IntentWizardProps {
  intentId?: string; // Pass intentId to edit an existing intent
  aimId?: string; // Pass aimId either to edit existing intent or as suggestion for new intent
}

export function IntentWizard() {
  return (
    <div className="flex flex-col">
      <div className="mt-10">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Create New Intent</CardTitle>
            <CardDescription>
              Enter details to create a new intent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dates">How long?</Label>
                <DatePickerWithRange />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Reminders</Label>
                <Input
                  id="email"
                  placeholder="Reminders go here"
                  required
                  type="string"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Create Intent
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
