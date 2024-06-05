import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check


type Guest = {
  name: string;
  guestOf: string;
  isFamily: boolean;
  additionalGuest: "unknown" | "0" | "1";
  dietaryRestrictions: string;
  additionalGuestName: string;
  additionalGuestDietaryRestriction: string;
}

const guests: Map<String, Guest> = new Map<String, Guest>;

/** Testing function to remove all the guests */
export const resetForTesting = (): void => {
  guests.clear;
}

/** Handles request for /save by storing the file. */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.body.name);
  if (typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }

  const guestOf = first(req.body.guestOf);
  if (typeof guestOf !== 'string') {
    res.status(400).send('required argument "guestOf" was missing');
    return;
  }

  const isFamily = req.body.isFamily;
  if (typeof isFamily !== 'boolean') {
    res.status(400).send('required argument "isFamily" was missing');
    return;
  }

  const additionalGuest = first(req.body.additionalGuest);
  if ((additionalGuest !== 'unknown' && additionalGuest !== '1' && additionalGuest !== '0')) {
    res.status(400).send('required argument "additionalGuest" was missing');
    return;
  }

  const dietaryRestrictions = first(req.body.dietaryRestrictions);
  if (typeof dietaryRestrictions !== 'string') {
    res.status(400).send('required argument "dietaryRestrictions" was missing');
    return;
  }

  const additionalGuestName = first(req.body.additionalGuestName);
  if (typeof additionalGuestName !== 'string') {
    res.status(400).send('required argument "additionalGuestName" was missing');
    return;
  }

  const additionalGuestDietaryRestriction = first(req.body.additionalGuestDietaryRestriction);
  if (typeof additionalGuestDietaryRestriction !== 'string') {
    res.status(400).send('required argument "additionalGuestDietaryRestriction" was missing');
    return;
  }

  const guest: Guest = {
    name: name,
    guestOf: guestOf,
    isFamily: isFamily,
    additionalGuest: additionalGuest,
    dietaryRestrictions: dietaryRestrictions,
    additionalGuestName: additionalGuestName,
    additionalGuestDietaryRestriction: additionalGuestDietaryRestriction,
  }
  
  guests.set(name, guest);

  res.send({saved: true});
}


/** Handles request for /load by returning the guest requested. */
export const load = (req: SafeRequest, res: SafeResponse): void => {
  const guestName = first(req.query.guestName);
  if (guestName === undefined) {
    res.status(400).send('required argument "name" was missing');
    return;
  }

  if (!guests.has(guestName)) {
    res.status(404).send('no guest with that name in the guests');
   return;
  }

  res.send({guestName: guestName, guest: guests.get(guestName)});
};

/** Handles request for /name to list the names of all guests currently saved. */
export const listGuests = (_req: SafeRequest, res: SafeResponse): void => {
  const guestList = Array.from(guests.values());
  res.send({guestList: guestList});
};


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};
