"use client";

import { JourneyData } from "@/app/page";
import JourneyReservationExperience from "./JourneyReservationExperience";

interface BookingEngineProps {
  initialJourney: JourneyData | null;
}

export default function BookingEngine({ initialJourney }: BookingEngineProps) {
  return <JourneyReservationExperience initialJourney={initialJourney} />;
}
