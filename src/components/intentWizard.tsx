import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useUser } from "@clerk/nextjs";
import { IntentStatus } from "@prisma/client";
import { useRouter } from "next/router";
import { useAimData } from "./aimWizard";
type IntentData = RouterOutputs["intents"]["getById"];
type IntentFormSchema = RouterOutputs["intents"]["create"];

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

export function IntentWizard({ intentId }: IntentWizardProps) {
  const { user } = useUser();
  const router = useRouter();
  const { mutateAsync } = api.intents.create.useMutation();

  // grabs aimId from URL slug
  // defined @ src\components\aimFeed.tsx
  const aimId = router.query.aimId as string;
  const aimTitle = useAimData(aimId)?.aim.title;
  const aimNotes = useAimData(aimId)?.aim.notes;

  // some date calculations
  const today = new Date(Date.now()); // UTC time so that it's synced with the server time
  const lastDateOfMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
  );

  const form = useForm<IntentFormSchema>({
    defaultValues: {
      reminders: "empty reminder",
      status: IntentStatus.ACTIVE,
      aimId: aimId,
      startDate: today,
      endDate: lastDateOfMonth,
    },
  });

  async function onSubmit() {
    const formValues = { ...form.getValues() };

    if (intentId) {
      // Handle edit logic for an existing intent
      console.log("edit intent", formValues);
    } else {
      // Handle save logic for a new intent
      console.log("new intent", formValues);

      await mutateAsync(formValues);
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

  if (!user) return null;

  return (
    <div className="flex flex-col">
      <div className="mt-10">
        <Form {...form}>
          {/* added a checksVoidReturn: false to ESLint -> "@typescript-eslint/no-misused-promises" */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="mx-auto max-w-2xl">
              <CardHeader>
                <CardTitle>{aimTitle}</CardTitle>
                <CardDescription>{aimNotes}</CardDescription>
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
