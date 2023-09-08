import React, { useState, useContext, createContext, useEffect } from "react";

// Define the step data type
interface StepData {
  intent: string;
  setIntent: React.Dispatch<React.SetStateAction<string>>;
  fromDate: Date;
  setFromDate: React.Dispatch<React.SetStateAction<Date>>;
  untilDate: Date;
  setUntilDate: React.Dispatch<React.SetStateAction<Date>>;
  reminders: string;
  setReminders: React.Dispatch<React.SetStateAction<string>>;
  selectedDays: string[];
  setSelectedDays: React.Dispatch<React.SetStateAction<string[]>>;
}

// Create a single context for all steps
// Intent Wizard CREATES and EDITS intents
const IntentWizardContext = createContext<StepData | undefined>(undefined);

interface IntentWizardProps {
  intentId?: string; // Pass intentId to edit an existing intent
}

function IntentWizard({ intentId }: IntentWizardProps) {
  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState("");
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [untilDate, setUntilDate] = useState<Date>(new Date());
  const [reminders, setReminders] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const contextValue: StepData = {
    intent,
    setIntent,
    fromDate,
    setFromDate,
    untilDate,
    setUntilDate,
    reminders,
    setReminders,
    selectedDays,
    setSelectedDays,
  };

  useEffect(() => {
    // If intentId is provided, fetch the existing intent data and populate the form for editing
    if (intentId) {
      // Replace this with your logic to fetch existing intent data
      const existingIntentData: StepData = {
        intent: "Existing Intent",
        fromDate: new Date(),
        untilDate: new Date(),
        reminders: "Existing Reminders",
        selectedDays: ["Monday", "Wednesday"],
        setIntent: setIntent,
        setFromDate: setFromDate,
        setUntilDate: setUntilDate,
        setReminders: setReminders,
        setSelectedDays: setSelectedDays,
      };

      // Set the form fields with existing data
      setIntent(existingIntentData.intent);
      setFromDate(existingIntentData.fromDate);
      setUntilDate(existingIntentData.untilDate);
      setReminders(existingIntentData.reminders);
      setSelectedDays(existingIntentData.selectedDays);
    }
  }, [intentId]);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSave = () => {
    // Implement save or edit logic here
    console.log("Form Data:", contextValue);
  };

  return (
    <div className="IntentWizard-container">
      <IntentWizardContext.Provider value={contextValue}>
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}
        <div className="buttons">
          {step > 1 && <button onClick={handlePrev}>Previous</button>}
          {step < 3 ? (
            <button onClick={handleNext}>Next</button>
          ) : (
            <button onClick={handleSave}>Save</button>
          )}
        </div>
      </IntentWizardContext.Provider>
    </div>
  );
}

function Step1() {
  const { intent, setIntent } = useContext(IntentWizardContext)!;

  return (
    <div className="step">
      <h1>Step 1</h1>
      <h2>Set new Intent</h2>
      <input
        type="text"
        placeholder="Write your own Aim"
        value={intent}
        onChange={(e) => setIntent(e.target.value)}
      />
    </div>
  );
}

function Step2() {
  const { fromDate, setFromDate, untilDate, setUntilDate } =
    useContext(IntentWizardContext)!;

  return (
    <div className="step">
      <h1>Step 2</h1>
      <label>From Date</label>
      <input
        type="date"
        value={fromDate.toISOString().split("T")[0]} // Format as YYYY-MM-DD
        onChange={(e) => setFromDate(new Date(e.target.value))}
      />
      <label>Until Date</label>
      <input
        type="date"
        value={untilDate.toISOString().split("T")[0]} // Format as YYYY-MM-DD
        onChange={(e) => setUntilDate(new Date(e.target.value))}
      />
    </div>
  );
}

function Step3() {
  const { reminders, setReminders, selectedDays, setSelectedDays } =
    useContext(IntentWizardContext)!;

  return (
    <div className="step">
      <h1>Step 3</h1>
      <label>Remind me on:</label>
      <input
        type="text"
        placeholder="Enter reminders"
        value={reminders}
        onChange={(e) => setReminders(e.target.value)}
      />
      {/* Add clock and day of the week selection here */}
    </div>
  );
}

export default IntentWizard;
