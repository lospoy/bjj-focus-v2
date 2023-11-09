// IntentWizard
// Handles creating and (not yet editing) Intents

// Used in:
// ~../pages/intent
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

type IntentFormSchema = RouterOutputs["intents"]["create"];

// type IntentData = RouterOutputs["intents"]["getById"];
// const useIntentData = (id: string): IntentData | undefined => {
//   const { data } = api.intents.getById.useQuery({ id });

//   return data;
// };

// const getIntentData = (id: string): IntentData | undefined => {
//   const { data } = api.intents.getById.useQuery({ id });

//   return data;
// };
type IntentData = RouterOutputs["intents"]["getById"];

export const useIntentData = (id: string): IntentData | undefined => {
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
  // const { mutateAsync } = api.intents.create.useMutation();

  // grabs aimId from URL slug
  // defined @ src\components\aimFeed.tsx
  const aimId = router.query.aimId as string;
  const aimTitle = useAimData(aimId)?.aim.title;
  const aimNotes = useAimData(aimId)?.aim.notes;

  // some date calculations
  const today = new Date(Date.now()); // UTC time so that it's synced with the server time
  // Calculate the last day of the current month
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  // Set the time to the last minute and second of the day in the local timezone
  const lastDateOfMonth = new Date(
    lastDayOfMonth.getFullYear(),
    lastDayOfMonth.getMonth(),
    lastDayOfMonth.getDate(),
    23, // Hours
    59, // Minutes
    59, // Seconds
    999, // Milliseconds
  );

  const form = useForm<IntentFormSchema>({
    defaultValues: {
      status: IntentStatus.ACTIVE,
      aimId: aimId,
      startDate: today,
      endDate: lastDateOfMonth,
    },
  });

  function onSubmit() {
    const formValues = { ...form.getValues() };

    if (intentId) {
      // Handle edit logic for an existing intent
      console.log("edit intent", formValues);
    } else {
      // Handle save logic for a new intent
      console.log("new intent", formValues);

      // await mutateAsync(formValues);
      console.log(formValues);
    }
    setTimeout(() => {
      void router.push("/");
    }, 300);
  }

  type ButtonDayProps = {
    value: string;
    label: string;
  };

  const ButtonDay = ({ value, label }: ButtonDayProps) => (
    <Button
      className="w-10 rounded-xl bg-background text-lg font-semibold text-primary"
      value={value}
    >
      {label}
    </Button>
  );

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
    <div className="-m-4">
      <Form {...form}>
        {/* added a checksVoidReturn: false to ESLint -> "@typescript-eslint/no-misused-promises" */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="space-y-0">
            <Card className="p-6">
              <CardTitle className="text-2xl">{aimTitle}</CardTitle>
              <CardDescription>{aimNotes}</CardDescription>
            </Card>
          </CardHeader>
          <CardContent className="space-y-4">
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
          <CardContent>
            <FormField
              control={form.control}
              name="reminders"
              render={({ field }) => (
                <FormItem className="space-x-3" {...field}>
                  <ButtonDay value="SUN" label="S" />
                  <ButtonDay value="MON" label="M" />
                  <ButtonDay value="TUE" label="T" />
                  <ButtonDay value="WED" label="W" />
                  <ButtonDay value="THU" label="T" />
                  <ButtonDay value="FRI" label="F" />
                  <ButtonDay value="SAT" label="S" />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className=" flex flex-col">
            <Button className="flex w-2/5 items-center bg-accent" type="submit">
              Create Intent
            </Button>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
}
