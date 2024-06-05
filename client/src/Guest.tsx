import { isRecord } from "./record";

/** Describes a guest */
export type Guest = {
    name: string;
    guestOf: string;
    isFamily: boolean;
    additionalGuest: "unknown" | "0" | "1";
    dietaryRestrictions: string;
    additionalGuestName: string;
    additionalGuestDietaryRestriction: string;
  };

/**
 * Parses unknown data into a Guest. Will log an error and return undefined
 * if it is not a valid Guest.
 * @param val unknown data to parse into a Guest
 * @return Guest if val is a valid Guest and undefined otherwise
 */
export const parseGuest = (val: unknown): undefined | Guest => {
    if (!isRecord(val)) {
      console.error("not a guest", val);
      return undefined;
    }
  
    if (typeof val.name !== "string") {
      console.error("not a guest: missing 'name'", val);
      return undefined;
    }
  
    if (typeof val.guestOf !== "string") {
      console.error("not a guest: missing 'guestOf'", val);
      return undefined;
    }
  
    if (typeof val.isFamily !== "boolean") {
      console.error("not a guest: missing or invalid 'isFamily'", val);
      return undefined;
    }
  
    if (typeof val.additionalGuest !== "string" || (val.additionalGuest !== 'unknown' && val.additionalGuest !== '1' && val.additionalGuest !== '0')) {
      console.error("not a guest: missing or invalid 'additionalGuest'", val);
      return undefined;
    }
  
    if (typeof val.dietaryRestrictions !== "string") {
      console.error("not a guest: missing 'dietaryRestrictions'", val);
      return undefined;
    }
  
    if (typeof val.additionalGuestName !== "string") {
      console.error("not a guest: missing 'additionalGuestName'", val);
      return undefined;
    }
  
    if (typeof val.additionalGuestDietaryRestriction !== "string") {
      console.error("not a guest: missing 'additionalGuestDietaryRestriction'", val);
      return undefined;
    }
  
    return {
      name: val.name,
      guestOf: val.guestOf,
      isFamily: val.isFamily,
      additionalGuest: val.additionalGuest,
      dietaryRestrictions: val.dietaryRestrictions,
      additionalGuestName: val.additionalGuestName,
      additionalGuestDietaryRestriction: val.additionalGuestDietaryRestriction,
    };
  };

  /** Converts a Guest object to its JSON representation */
export const toJson = (guest: Guest): string => {
    return JSON.stringify(guest);
  };
  
/** Converts a JSON representation to a Guest object */
export const fromJson = (json: string): Guest | undefined => {
    try {
      const parsedJson = JSON.parse(json);
      if (!isRecord(parsedJson)) {
        throw new Error("Invalid JSON format");
      }
  
      return parseGuest(parsedJson);
    } catch (error: unknown) { // Specify the type of error as Error
      console.error("Error parsing JSON:", error);
      return undefined;
    }
  };
  
  
  