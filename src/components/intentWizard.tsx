import React, { useState, useEffect } from "react";
import { AimWizard } from "./aimWizard";

interface IntentWizardProps {
  intentId?: string; // Pass intentId to edit an existing intent
  aimId?: string; // Pass aimId either to edit existing intent or as suggestion for new intent
}

function IntentWizard({ intentId, aimId}: IntentWizardProps) {
  // const currentUserId = ctx.userId

  const [formData, setFormData] = useState({
    aimId: aimId ?? "",
    startDate: new Date(),
    endDate: new Date(),
    reminders: "",
    isPublic: true,
    successYes: 0,
    successNo: 0,
    status: "ACTIVE",
  });

  useEffect(() => {
    // If intentId is provided, fetch the existing intent data and populate the form for editing
    if (intentId) {
      // Logic to fetch existing intent data
      const existingIntentData = {};

      // Set the form fields with existing data
      setFormData(existingIntentData);
    }
  }, [intentId]);

  const handleSave = () => {
    // Save or Edit logic here

    console.log("Form Data:", { formData });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="w-full rounded-lg bg-gray-100 p-4 shadow-md">
      <div className="mb-4">
        <AimWizard />
      </div>
      <div className="mb-4">
        <input
          className="w-full rounded border p-2"
          type="date"
          name="startDate"
          placeholder="from date"
          value={formData.startDate.toISOString().split("T")[0]}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <input
          className="w-full rounded border p-2"
          type="date"
          name="endDate"
          value={formData.endDate.toISOString().split("T")[0]}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <input
          className="w-full rounded border p-2"
          type="text"
          name="reminders"
          placeholder="Enter reminders"
          value={formData.reminders}
          onChange={handleChange}
        />
      </div>
      {/* Add clock and day of the week selection here */}
      <div className="mt-4 flex justify-end">
        <button
          className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default IntentWizard;
