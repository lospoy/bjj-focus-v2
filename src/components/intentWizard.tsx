import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { api } from "~/utils/api";
import { DatePickerWithRange } from "./ui/datepickerRange";
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
import type { RouterOutputs } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { intentsRouter } from "~/server/api/routers/intents";
type IntentData = RouterOutputs["intents"]["getById"];

const today = new Date();
const lastDateOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

const formSchema = z.object({
  reminders: z.string().min(2, {
    message: "Reminders must be at least 2 characters.",
  }),
  startDate: z.date().refine((date) => {
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date >= today;
  }, "Date must be today or a future date."),
  endDate: z.date().refine((date) => {
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date >= today;
  }, "Date must be today or a future date."),
});

const useIntentData = (id: string): IntentData | undefined => {
  const { data } = api.intents.getById.useQuery({ id });

  return data;
};

const getIntentData = (id: string): IntentData | undefined => {
  const { data } = api.intents.getById.useQuery({ id });

  return data;
};

interface IntentWizardProps {
  intentId?: string; // Pass intentId to edit an existing intent
  aimId?: string; // Pass aimId either to edit existing intent or as suggestion for new intent
}

export function IntentWizard({ intentId, aimId }: IntentWizardProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reminders: "",
      startDate: today,
      endDate: lastDateOfMonth,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (intentId) {
      // Handle edit logic for an existing intent
      console.log("edit intent", values);
    } else {
      // Handle save logic for a new intent
      console.log("new intent", values);
    }
    // Other actions upon saving/editing
  }

  // Fetch existing intent data if intentId is provided
  // useEffect(() => {
  //   if (intentId) {
  //     // Replace with your API request to fetch intent data by ID
  //     useIntentData

  //       // Populate form fields with existing data
  //       Object.keys(existingIntentData).forEach((key) => {
  //         setValue(key, existingIntentData[key]);
  //       });
  //     });
  //   }
  // }, [intentId, setValue]);

  return (
    <div className="flex flex-col">
      <div className="mt-10">
        <Form {...form}>
          {/* added a checksVoidReturn: false to ESLint -> "@typescript-eslint/no-misused-promises" */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="mx-auto max-w-2xl">
              <CardHeader>
                <CardTitle>Create New Intent</CardTitle>
                <CardDescription>Card description</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="reminders"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reminders</FormLabel>
                      <FormControl>
                        <Input placeholder="reminders go here" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={() => (
                    <FormItem>
                      <FormLabel>Dates</FormLabel>
                      <FormControl>
                        <DatePickerWithRange />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit">
                  Create Intent
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
