import React from "react";

const Display = (props: { text: string }) => {
  return (
    <div
      className={`whitespace-pre-wrap rounded-md border p-4 text-sm ${props.text ? "" : "text-secondary"}`}
    >
      {props.text || "No message to display"}
    </div>
  );
};

export default Display;
