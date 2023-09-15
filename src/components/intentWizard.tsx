import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";

type IntentData = RouterOutputs["intents"]["getById"];

const useIntentData = (id: string): IntentData | undefined => {
  const { data } = api.intents.getById.useQuery({ id });

  return data;
};

interface IntentWizardProps {
  intentId?: string; // Pass intentId to edit an existing intent
  aimId?: string; // Pass aimId either to edit existing intent or as suggestion for new intent
}

export function IntentWizard({ intentId, aimId }: IntentWizardProps) {
  const { control, handleSubmit, setValue } = useForm();
  const onSubmit = (data: IntentData) => {
    if (intentId) {
      // Handle edit logic for an existing intent
      console.log("edit intent", data);
    } else {
      // Handle save logic for a new intent
      console.log("new intent", data);
    }

    // Other actions upon saving/editing
  };

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
    <div className="w-full rounded-lg bg-gray-100 p-4 shadow-md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          {/* Add your form fields here */}
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <input
                type="date"
                {...field}
                // Add defaultValue for initial values
                defaultValue={aimId || ""}
              />
            )}
          />
        </div>
        <div className="mb-4">
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <input
                type="date"
                {...field}
                // Add defaultValue for initial values
                defaultValue={aimId || ""}
              />
            )}
          />
        </div>
        <div className="mb-4">
          <Controller
            name="reminders"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                {...field}
                // Add defaultValue for initial values
                defaultValue={aimId || ""}
              />
            )}
          />
        </div>
        {/* Add other form fields */}
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
