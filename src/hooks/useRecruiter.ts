import { useContext } from "react";
import {
  RecruiterContext,
  type RecruiterContextType,
} from "../context/recruiterContextDef";

export const useRecruiter = (): RecruiterContextType => {
  const context = useContext(RecruiterContext);
  if (!context) {
    throw new Error("useRecruiter must be used within a RecruiterProvider");
  }
  return context;
};
