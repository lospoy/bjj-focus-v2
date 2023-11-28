// KnownJitWizard
// Handles creating and (not yet editing) KnownJits

// Used in:
// ~../pages/knownJit
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
import { KnownJitStatus } from "@prisma/client";
import { useRouter } from "next/router";
import { useJitData } from "./jitWizard";

type KnownJitFormSchema = RouterOutputs["knownJits"]["create"];

// type KnownJitData = RouterOutputs["knownJits"]["getById"];
// const useKnownJitData = (id: string): KnownJitData | undefined => {
//   const { data } = api.knownJits.getById.useQuery({ id });

//   return data;
// };

// const getKnownJitData = (id: string): KnownJitData | undefined => {
//   const { data } = api.knownJits.getById.useQuery({ id });

//   return data;
// };
type KnownJitData = RouterOutputs["knownJits"]["getById"];

export const useKnownJitData = (id: string): KnownJitData | undefined => {
  const { data } = api.knownJits.getById.useQuery({ id });

  return data;
};

interface KnownJitWizardProps {
  knownJitId?: string; // Pass knownJitId to edit an existing knownJit
  jitId?: string; // Pass jitId either to edit existing knownJit or as suggestion for new knownJit
}

export function KnownJitWizard({ knownJitId }: KnownJitWizardProps) {
  const { user } = useUser();
  const router = useRouter();
  // const { mutateAsync } = api.knownJits.create.useMutation();

  // grabs jitId from URL slug
  // defined @ src\components\jitFeed.tsx
  const jitId = router.query.jitId as string;
  const jitTitle = useJitData(jitId)?.jit.title;
  const jitNotes = useJitData(jitId)?.jit.notes;

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

  const form = useForm<KnownJitFormSchema>({
    defaultValues: {
      status: KnownJitStatus.ACTIVE,
      jitId: jitId,
      startDate: today,
      endDate: lastDateOfMonth,
    },
  });

  function onSubmit() {
    const formValues = { ...form.getValues() };

    if (knownJitId) {
      // Handle edit logic for an existing knownJit
      console.log("edit knownJit", formValues);
    } else {
      // Handle save logic for a new knownJit
      console.log("new knownJit", formValues);

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

  // Fetch existing knownJit data if knownJitId is provided
  // useEffect(() => {
  //   if (knownJitId) {
  //     // Replace with your API request to fetch knownJit data by ID
  //     useKnownJitData

  //       // Populate form fields with existing data
  //       Object.keys(existingKnownJitData).forEach((key) => {
  //         setValue(key, existingKnownJitData[key]);
  //       });
  //     });
  //   }
  // }, [knownJitId, setValue]);

  if (!user) return null;

  return (
    <div className="-m-4">
      <Form {...form}>
        {/* added a checksVoidReturn: false to ESLint -> "@typescript-eslint/no-misused-promises" */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="space-y-0">
            <Card className="p-6">
              <CardTitle className="text-2xl">{jitTitle}</CardTitle>
              <CardDescription>{jitNotes}</CardDescription>
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
              Create KnownJit
            </Button>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
}
