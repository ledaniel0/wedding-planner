import React, { Component, ChangeEvent, MouseEvent } from "react";
import { isRecord } from "./record";

type AddGuestProps = {
    // onSave: (name: string, guestOf: string, isFamily: boolean) => void;
    onBack: () => void;
}

type AddGuestState = {
    name: string;
    guestOf: string;
    isFamily: boolean;
    error: string;
}

export class AddGuest extends Component<AddGuestProps, AddGuestState> {
    constructor(props: AddGuestProps) {
        super(props);

        this.state = {
            name: "",
            guestOf: "",
            isFamily: false,
            error: ""
        };
    }
    render = (): JSX.Element => {
        return (
            <div>
                <h2>Add Guest</h2>
                Name:
                <br />
                <input
                    type="text"
                    value={this.state.name}
                    onChange={this.doNameChange}
                    placeholder="Enter name"
                    >
                </input>
                <br />
                Guest of:
                <br />
                <label>
                    <input type="radio" name="guestOf" value="Molly" onChange={this.doGuestOfChange} />
                    Molly
                </label>
                <br />
                <label>
                    <input type="radio" name="guestOf" value="James" onChange={this.doGuestOfChange} />
                    James
                </label>
                <br />
                <label>
                    Family?
                    <input
                        type="checkbox"
                        checked={this.state.isFamily}
                        onChange={this.doIsFamilyChange}
                    />
                </label>
                <br />
                <button type="submit" onClick={this.doSaveClick}>Add</button>
                <button type="button" onClick={this.props.onBack}>Back</button>
                <br />
                {this.state.error}
            </div>
        );
    };

    doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({ name: evt.target.value });
    };

    doGuestOfChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({ guestOf: evt.target.value });
    };
    
    doIsFamilyChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({ isFamily: evt.target.checked });
    };
    
    doSaveClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        const name: string = this.state.name;
        const guestOf: string = this.state.guestOf;
        const isFamily: boolean = this.state.isFamily;
        if (name.trim() === "") {
          this.setState({ error: "Name is required" });
        } else if (guestOf === "") {
            this.setState({ error: "Error: host is required" });
        } else {
            const guest = {
                name: name,
                guestOf: guestOf,
                isFamily: isFamily,
                additionalGuest: "unknown",
                dietaryRestrictions: "",
                additionalGuestName: "",
                additionalGuestDietaryRestriction: ""
            };
            
            fetch("/api/save", {
                method: "POST", body: JSON.stringify(guest),
                headers: {"Content-Type": "application/json"}
            })
            .then(this.doSaveResp)
            .catch(() => this.doSaveError("failed to connect to server"));
        }
    };

    doSaveResp = (resp: Response): void => {
        if (resp.status === 200) {
          resp.json().then(this.doSaveJson)
              .catch(() => this.doSaveError("200 response is not JSON"));
        } else if (resp.status === 400) {
          resp.text().then(this.doSaveError)
              .catch(() => this.doSaveError("400 response is not text"));
        } else {
          this.doSaveError(`bad status code from /api/save: ${resp.status}`);
        }
    };

    doSaveJson = (data: unknown): void => {
        if (!isRecord(data)) {
          console.error("bad data from /api/save: not a record", data);
          return;
        }
    
        this.props.onBack();
    };

    doSaveError = (msg: string): void => {
        this.setState({error: msg})
    };

}
