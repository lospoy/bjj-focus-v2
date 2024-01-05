import React, { useState } from "react";
import useLongPress from "@custom-react-hooks/use-long-press";

const LongPressTestComponent = () => {
  const [status, setStatus] = useState("Ready");

  const longPressCallback = () => {
    setStatus("Finished");
  };

  const longPressEvents = useLongPress(longPressCallback, {
    threshold: 500,
    onStart: () => setStatus("Started"),
    onFinish: () => setStatus("Finished"),
    onCancel: () => setStatus("Cancelled"),
  });

  return (
    <div>
      <button {...longPressEvents}>Press and Hold</button>
      <p>
        Status: <span>{status}</span>
      </p>
    </div>
  );
};

export default LongPressTestComponent;
