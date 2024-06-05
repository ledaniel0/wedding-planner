import React, { ChangeEvent, Component, MouseEvent } from "react";
import { parseGuest, Guest } from "./Guest";
import { isRecord } from "./record";

/** The parts of the props of the Guest Details */
type GuestDetailProps = {
    guestName: string;
    onBack: () => void;
}

/** The parts of the state of the Guest Details */
type GuestDetailState = {
    guest: Guest | undefined;
    additionalGuest: "unknown" | "0" | "1";
    additionalGuestName: string;
    guestDietaryRestrictions: string;
    dietaryRestrictions: string;
    error: string;
}

/**
 * Displays all the details of the guest and if they have an additional guest
 */
export class GuestDetail extends Component<GuestDetailProps, GuestDetailState> {
    constructor(props: GuestDetailProps) {
        super(props);

        this.state = {
            guest: undefined,
            additionalGuest: "unknown",
            additionalGuestName: "",
            dietaryRestrictions: "",
            guestDietaryRestrictions: "",
            error: ""
        };
    }

    componentDidMount = (): void => {
        this.doRefreshClick(); 
    };
    
    render = (): JSX.Element => {
        const guest: Guest | undefined = this.state.guest;
        return (
            <div>
                <h2>Guest Details: </h2>
                { this.props.guestName }, Guest of { guest?.guestOf }, { guest?.isFamily ? ("Family"): "not Family" }
                <h3>Dietary Restrictions ('none' if none):</h3>
                <input
                    value={this.state.dietaryRestrictions}
                    onChange={this.doDietaryRestrictionsChange}
                    placeholder="Dietary Restrictions">
                </input>
                <br></br>
                <br></br>
                Additional Guest?  
                <select value={this.state.additionalGuest} onChange={this.doAdditionalGuestChange}>
                    <option value="unknown">unknown</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                </select>
                {this.state.additionalGuest === "1"  && (
                <>
                <h3>Guest Name: </h3>
                <input
                    value={this.state.additionalGuestName}
                    onChange={this.doAdditionalGuestNameChange}
                    placeholder="name">
                </input>
                <h3>Guest Dietary Restrictions ('none' if none):</h3>
                <input
                    value={this.state.guestDietaryRestrictions}
                    onChange={this.doAddDietaryRestrictionsChange}
                    placeholder="Dietary Restrictions">
                </input>
                </>
                )}
                <br></br>
                <br></br>
                <button onClick={this.doSaveClick}>Save</button>
                <button onClick={this.props.onBack}>Back</button>
                <br></br>
                { this.state.error }
            </div>
        )
    };

    // Saves the guest info
    doSaveClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        if (this.state.dietaryRestrictions === "") {
            this.setState({ error: "Error: please set dietary restriction" });
        } else if (this.state.additionalGuest === "1" && (this.state.guestDietaryRestrictions === "")) {
            this.setState({ error: "Error: please set additional guest's dietary restriction" });
        } else if (this.state.additionalGuest === "1" && (this.state.additionalGuestName === "")) {
            this.setState({ error: "Please input additional guests' name"});
        } else {
            if (this.state.guest !== undefined) {
                const updatedGuest: Guest = {
                    name: this.state.guest.name,
                    guestOf: this.state.guest.guestOf,
                    isFamily: this.state.guest.isFamily,
                    additionalGuest: this.state.additionalGuest,
                    dietaryRestrictions: this.state.dietaryRestrictions,
                    additionalGuestName: this.state.additionalGuestName,
                    additionalGuestDietaryRestriction: this.state.guestDietaryRestrictions
                };
                fetch("/api/save", {
                    method: "POST", body: JSON.stringify(updatedGuest),
                    headers: {"Content-Type": "application/json"}})
                .then(this.doSaveResp)
                .catch(() => this.doSaveError("failed to connect to server"));
            } else {
                console.error("guest from /api/load did not parse", this.state.guest);
                return;
            }
        }
    };

    // Helper function to find which status error
    doSaveResp = (res: Response): void => {
        if (res.status === 200) {
          res.json().then(this.doSaveJson)
              .catch(() => this.doSaveError("200 response is not JSON"));
        } else if (res.status === 400) {
          res.text().then(this.doSaveError)
              .catch(() => this.doSaveError("400 response is not text"));
        } else {
          this.doSaveError(`bad status code from /api/bid: ${res.status}`);
        }
      };
    
    // If valid status, sets the state
    doSaveJson = (data: unknown): void => {
        if (!isRecord(data)) {
            console.error("bad data from /api/add: not a record", data);
            return;
            }
    
        this.props.onBack();
    };
    
    // Logs the error
    doSaveError = (msg: string): void => {
        this.setState({ error: msg});
    };

    // Updates the additional guest name
    doAdditionalGuestNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({ additionalGuestName: evt.target.value });
    };

    // Updates if there is an additional guest
    doAdditionalGuestChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
        if (evt.target.value !== "") {
            if (evt.target.value === "0") {
                this.setState({additionalGuest: "0"});
            } else if (evt.target.value === "1") {
                this.setState({additionalGuest: "1"});
            } else {
                this.setState({additionalGuest: "unknown"});
            }
        }
    };

    // Updates additional guest dietary restrictions
    doAddDietaryRestrictionsChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({ guestDietaryRestrictions: evt.target.value })
    };

    // Updates guest dietary restrictions
    doDietaryRestrictionsChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({ dietaryRestrictions: evt.target.value })
    };

    // Updates the list on refresh
    doRefreshClick = (): void => {
        fetch("/api/load?guestName=" + encodeURIComponent(this.props.guestName))
      .then(this.doLoadResp)
      .catch(() => this.doLoadError("failed to connect to server"));
    };
    
    // Helper function to find which status error
    doLoadResp = (res: Response): void => {
        if (res.status === 200) {
          res.json().then(this.doLoadJson)
              .catch(() => this.doLoadError("200 res is not JSON"));
        } else if (res.status === 400) {
          res.text().then(this.doLoadError)
              .catch(() => this.doLoadError("400 response is not text"));
        } else {
          this.doLoadError(`bad status code from /api/load: ${res.status}`);
        }
    };
    
    // If valid status, calls a helper function that sets the state
    doLoadJson = (data: unknown): void => {
        if (!isRecord(data)) {
          console.error("bad data from /api/load: not a record", data);
          return;
        }
        
        this.doGuestChange(data);
    };
    
    // Helper function to set the state
    doGuestChange = (data: {guest?: unknown}): void => {
        const guest = parseGuest(data.guest);
        if (guest !== undefined) {
          this.setState({
            guest: guest,
            additionalGuest: guest.additionalGuest,
            additionalGuestName: guest.additionalGuestName,
            guestDietaryRestrictions: guest.additionalGuestDietaryRestriction,
            dietaryRestrictions: guest.dietaryRestrictions,
          })
        } else {
          console.error("guest from /api/load did not parse", data.guest)
        }
    };
    
    // Logs the error
    doLoadError = (msg: string): void => {
        this.setState({ error: msg});
    };
}