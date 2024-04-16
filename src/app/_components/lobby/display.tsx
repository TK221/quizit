import React from "react";
import { Label } from "../ui/label";

const Display = (props: { text: string }) => {
  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor="message">Message Display</Label>
      <div
        className={`flex whitespace-pre-wrap border p-4 text-sm ${props.text ? "" : "text-secondary"}`}
      >
        {props.text || "No message to display"}
      </div>
    </div>
  );
};

export default Display;
