import { Loader2 } from "lucide-react";
import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Loader2 className={"h-8 w-8 animate-spin"} />
      <p>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
