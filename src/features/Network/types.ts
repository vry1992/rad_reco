export type NetworkCallsignsMapType = Record<
  string,
  {
    callsign: string;
    shipIds: string[];
    unitIds: string[];
    aircraftIds: string[];
  }
>;
