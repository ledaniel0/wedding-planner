import React, { Component } from "react";
// import { isRecord } from './record';
import { AddGuest } from "./AddGuest";
import { GuestList } from "./GuestList";
import { GuestDetail } from "./GuestDetails";
import { Guest } from "./Guest";

// TODO: When you're ready to get started, you can remove all the example 
//   code below and start with this blank application:

/** Describes set of possible app page views */
  type Page = { kind: "Guest List" }
    | { kind: "Guest Details"; guestName: string }
    | { kind: "Add Guest" 
    };

/** The parts of the state of the app */
  type WeddingAppState = {
    currPage: Page;
    loading: boolean;
    guestList: Guest[];
  };

/** Displays the UI of the Wedding rsvp application. */
export class WeddingApp extends Component<{}, WeddingAppState> {

  constructor(props: {}) {
    super(props);

    this.state = {
      currPage: { kind: "Guest List" },
      loading: false,
      guestList: []
    };
  }

  render = (): JSX.Element => {
    
    if (this.state.loading) {
      return <div>Loading...</div>;
    }

    switch (this.state.currPage.kind) {
      case "Guest List":
        return (
          <GuestList
            onSelectGuest={this.doSelectGuestClick}
            onAddGuest={this.doAddGuestClick}
          />
        );
      case "Add Guest":
        return (
          <AddGuest
            onBack={this.doBackGuestListClick}
          />
        );
      case "Guest Details":
        return (
          <GuestDetail
            guestName={this.state.currPage.guestName}
            onBack={this.doBackGuestListClick}
          />
        )
      default:
        return <div>Invalid page</div>;
    }
  };

  // Updates to Guest Details page when a guests' name is clicked
  doSelectGuestClick = (name: string): void => {
    this.setState({ currPage: { kind: "Guest Details", guestName: name }});
  };

  // Updates to Add Guest page when add guest button is clicked
  doAddGuestClick = (): void => {
    this.setState({ currPage: { kind: "Add Guest" }});
  };
  
  // Updates back to the Guest List view without changing anything
  doBackGuestListClick = (): void => {
    this.setState({ currPage: { kind: "Guest List" } });
  };

}

/**
 * Calculate the number of family guests for each person
 * @param guestList list of guests
 * @param guestOf passed in guest of who
 * @returns the number of guests for the person passed in
 */
export const doCountFamilyResponse = (guestList: Guest[], guestOf: string): number => {
  const familyGuests = guestList.filter(guest => guest.guestOf === guestOf && guest.isFamily);
  return familyGuests.length;
};

/**
 * Calculates the Min number of guests for each person
 * @param guestList list of guests
 * @param guestOf passed in guest of who
 * @returns the number of min guests in the list
 */
export const doCountMinGuestsResponse = (guestList: Guest[], guestOf: string): number => {
  const minGuests = guestList.filter(guest => guest.guestOf === guestOf);
  const minGuestsWith1 = minGuests.filter(guest => guest.additionalGuest === "1");
  return minGuests.length + minGuestsWith1.length;
};

/**
 * Calculates the Max number of guests for each person
 * @param guestList list of guests
 * @param guestOf passed in guest of who
 * @returns the number of max guests in the list
 */
export const doCountMaxGuestsResponse = (guestList: Guest[], guestOf: string): number => {
  const minGuests = guestList.filter(guest => guest.guestOf === guestOf);
  const minGuestsWith1 = minGuests.filter(guest => guest.additionalGuest === "1");
  const maxGuestsWithUnknown = minGuests.filter(guest => guest.guestOf === guestOf && guest.additionalGuest === "unknown");
  return minGuests.length + maxGuestsWithUnknown.length + minGuestsWith1.length;
};