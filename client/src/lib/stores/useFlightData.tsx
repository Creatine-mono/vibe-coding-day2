import { create } from "zustand";

interface FlightDataState {
  speed: number;
  altitude: number;
  setSpeed: (speed: number) => void;
  setAltitude: (altitude: number) => void;
}

export const useFlightData = create<FlightDataState>((set) => ({
  speed: 20,
  altitude: 20,
  setSpeed: (speed) => set({ speed }),
  setAltitude: (altitude) => set({ altitude }),
}));
