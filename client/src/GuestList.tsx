import React, { Component, MouseEvent } from "react";
import { isRecord } from "./record";
import { parseGuest } from "./Guest";
import { Guest } from "./Guest";
import { doCountFamilyResponse, doCountMaxGuestsResponse, doCountMinGuestsResponse } from "./WeddingApp";

/** The parts of the props of the Guest List */
type GuestListProps = {
    onSelectGuest: (name: string) => void;
    onAddGuest: () => void;
}

/** The parts of the state of the Guest List */
type GuestListState = {
    guestList: {
        name: string;
        guestOf: string;
        isFamily: boolean;
        additionalGuest: "unknown" | "0" | "1" }[];
    mollyFamily: number;
    jamesFamily: number;
    minGuestsJames: number;
    maxGuestsJames: number;
    minGuestsMolly: number;
    maxGuestsMolly: number;
    guestName: string;
}

/** Shows the list of all the guests */
export class GuestList extends Component<GuestListProps, GuestListState> {
    constructor(props: GuestListProps) {
        super(props);

        this.state = {
            guestList: [],
            mollyFamily: 0,
            jamesFamily: 0,
            minGuestsJames: 0,
            maxGuestsJames: 0,
            minGuestsMolly: 0,
            maxGuestsMolly: 0,
            guestName: ""
        };
    }

    componentDidMount = (): void => {
        this.doListClick();
    }

    componentDidUpdate = (prevProps: GuestListProps): void => {
        if (prevProps !== this.props) {
          this.setState({guestName: this.state.guestName});
        }
    };

    render = (): JSX.Element => {
        const guestList: JSX.Element[] = [];
        for (const guest of this.state.guestList) {
            guestList.push(
                <li key={guest.name}>
              <a onClick={(evt) => this.doGuestClick(evt, guest.name)} href="#">
                {guest.name}
              </a>
              , Guest of {guest.guestOf}, {guest.isFamily ? "Family" : "Not Family"}, +{guest.additionalGuest === "unknown" ? "1?" : guest.additionalGuest === "0" ? "0" : "1"}
            </li>
            )
        }

        return (
            <div>
                <h2>Guest List</h2>
                <ul>
                    {guestList}
                </ul>
                <button onClick={this.props.onAddGuest}>Add Guest</button>
                <div>
                    <h3>Summary</h3>
                    {this.state.minGuestsMolly === this.state.maxGuestsMolly ? (
                        <p>
                        Molly's Guests: {this.state.minGuestsMolly} guest
                        {this.state.minGuestsMolly === 1 ? '' : 's'} ({this.state.mollyFamily} Family)
                        </p>
                    ) : (
                        <p>
                        Molly's Guests: {this.state.minGuestsMolly} - {this.state.maxGuestsMolly} guest
                        {this.state.maxGuestsMolly === 1 ? '' : 's'} ({this.state.mollyFamily} Family)
                        </p>
                    )}
                    {this.state.minGuestsJames === this.state.maxGuestsJames ? (
                        <p>
                        James' Guests: {this.state.minGuestsJames} guest
                        {this.state.minGuestsJames === 1 ? '' : 's'} ({this.state.jamesFamily} Family)
                        </p>
                    ) : (
                        <p>
                        James' Guests: {this.state.minGuestsJames} - {this.state.maxGuestsJames} guest
                        {this.state.maxGuestsJames === 1 ? '' : 's'} ({this.state.jamesFamily} Family)
                        </p>
                    )}
                </div>
            </div>
        );
    };

    // Updates the selected guest
    doGuestClick = (_evt: MouseEvent<HTMLAnchorElement>, guestName: string): void => {
        this.props.onSelectGuest(guestName);
    };

    // Lists the guests
    doListClick = (): void => {
        fetch("/api/list").then(this.doListResp)
        .catch(() => this.doListError("failed to connect to server"));
    };

    // Helper function to find which status error
    doListResp = (resp: Response): void => {
        if (resp.status === 200) {
          resp.json().then(this.doListJson)
              .catch(() => this.doListError("200 response is not JSON"));
        } else if (resp.status === 400) {
          resp.text().then(this.doListError)
              .catch(() => this.doListError("400 response is not text"));
        } else {
          this.doListError(`bad status code from /api/list: ${resp.status}`);
        }
    };
    
    // If valid status, sets the state
    doListJson = (data: unknown): void => {
        if (!isRecord(data)) {
            console.error("bad data from /api/list: not a record", data);
            return;
        }
    
        if (!Array.isArray(data.guestList)) {
          console.error("bad data from /api/list: guests is not an array", data);
          return;
        }
    
        const guestList: Guest[] = [];
        for (const val of data.guestList) {
          const guest = parseGuest(val);
          if (guest === undefined)
            return;
          guestList.push(guest);
        }
        this.setState({
            guestList: guestList,
            mollyFamily: doCountFamilyResponse(guestList, "Molly"),
            jamesFamily: doCountFamilyResponse(guestList, "James"),
            minGuestsJames: doCountMinGuestsResponse(guestList, "James"),
            maxGuestsJames: doCountMaxGuestsResponse(guestList, "James"),
            minGuestsMolly: doCountMinGuestsResponse(guestList, "Molly"),
            maxGuestsMolly: doCountMaxGuestsResponse(guestList, "Molly")
        }); 
    };
    
    // Logs the error
    doListError = (msg: string): void => {
        console.error(`Error fetching /api/list: ${msg}`);
    };
}