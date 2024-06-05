import * as assert from 'assert';
import { Guest, parseGuest } from './Guest'

describe('parseGuest', function() {
    const guest  = {
        name: "Alice",
        guestOf: "John",
        isFamily: true,
        dietaryRestrictions: "milk",
        additionalGuest: "unknown",
        additionalGuestName: "",
        additionalGuestDietaryRestriction: ""
    }
    const guest2  = {
        name: 5,
        guestOf: "Molly",
        isFamily: true,
        dietaryRestrictions: "eggs",
        additionalGuest: "unknown",
        additionalGuestName: "",
        additionalGuestDietaryRestriction: ""
    }
    const guest3  = {
        name: 1,
        guestOf: "Molly",
        isFamily: true,
        dietaryRestrictions: "fish",
        additionalGuest: "1",
        additionalGuestName: "David",
        additionalGuestDietaryRestriction: "none"
    }
    const guest4 = {
        name: "Charlie",
        guestOf: 3,
        isFamily: false,
        dietaryRestrictions: "eggs",
        additionalGuest: "unknown",
        additionalGuestName: "",
        additionalGuestDietaryRestriction: ""
    }

    const guest5 = {
        name: "Charlie",
        guestOf: 9,
        isFamily: false,
        dietaryRestrictions: "eggs",
        additionalGuest: "unknown",
        additionalGuestName: "",
        additionalGuestDietaryRestriction: ""
    }

    const guest6 = {
        name: "Charlie",
        guestOf: "Molly",
        isFamily: 10,
        dietaryRestrictions: "eggs",
        additionalGuest: "unknown",
        additionalGuestName: "",
        additionalGuestDietaryRestriction: ""
    }

    const guest7 = {
        name: "Charlie",
        guestOf: "James",
        isFamily: 3,
        dietaryRestrictions: "eggs",
        additionalGuest: "unknown",
        additionalGuestName: "",
        additionalGuestDietaryRestriction: ""
    }

    const guest8 = {
        name: "Charlie",
        guestOf: "James",
        isFamily: true,
        dietaryRestrictions: "eggs",
        additionalGuest: 1919012,
        additionalGuestName: "",
        additionalGuestDietaryRestriction: ""
    }

    const guest9 = {
        name: "Charlie",
        guestOf: "James",
        isFamily: false,
        dietaryRestrictions: "eggs",
        additionalGuest: "2123",
        additionalGuestName: "",
        additionalGuestDietaryRestriction: ""
    }

    const guest10 = {
        name: "Charlie",
        guestOf: "James",
        isFamily: false,
        dietaryRestrictions: 13132,
        additionalGuest: "0",
        additionalGuestName: "",
        additionalGuestDietaryRestriction: ""
    }

    const guest11 = {
        name: "Charlie",
        guestOf: "James",
        isFamily: false,
        dietaryRestrictions: 1,
        additionalGuest: "unknown",
        additionalGuestName: "",
        additionalGuestDietaryRestriction: ""
    }

    const guest12 = {
        name: "Charlie",
        guestOf: "James",
        isFamily: false,
        dietaryRestrictions: "eggs",
        additionalGuest: "unknown",
        additionalGuestName: 111,
        additionalGuestDietaryRestriction: ""
    }

    const guest13 = {
        name: "Charlie",
        guestOf: "James",
        isFamily: false,
        dietaryRestrictions: "eggs",
        additionalGuest: "unknown",
        additionalGuestName: 101,
        additionalGuestDietaryRestriction: ""
    }

    const guest14 = {
        name: "Charlie",
        guestOf: "James",
        isFamily: false,
        dietaryRestrictions: "eggs",
        additionalGuest: "unknown",
        additionalGuestName: "Frank",
        additionalGuestDietaryRestriction: 9
    }

    const guest15 = {
        name: "Charlie",
        guestOf: "James",
        isFamily: false,
        dietaryRestrictions: "eggs",
        additionalGuest: "unknown",
        additionalGuestName: "Frank",
        additionalGuestDietaryRestriction: 1241
    }

    const guest16 : Guest = {
        name: "",
        guestOf: "James",
        isFamily: true,
        dietaryRestrictions: "fish",
        additionalGuest: "unknown",
        additionalGuestName: "",
        additionalGuestDietaryRestriction: ""
    }

    const guest17 : Guest = {
        name: "Konnor",
        guestOf: "Molly",
        isFamily: true,
        dietaryRestrictions: "eggs",
        additionalGuest: "1",
        additionalGuestName: "Frank",
        additionalGuestDietaryRestriction: "also fish"
    }


    it('parse_guest', function() {
        // 2 tests per subdomain
        
        // 1. Guest is not a record
        assert.deepStrictEqual(parseGuest([guest, guest2]), undefined);
        assert.deepStrictEqual(parseGuest("hello"), undefined);

        // 2. name is not a string
        assert.deepStrictEqual(parseGuest(guest2), undefined);
        assert.deepStrictEqual(parseGuest(guest3), undefined);

        // 3. guestOf not a string
        assert.deepStrictEqual(parseGuest(guest4), undefined);
        assert.deepStrictEqual(parseGuest(guest5), undefined);

        // 4. isFamily not a boolean
        assert.deepStrictEqual(parseGuest(guest6), undefined);
        assert.deepStrictEqual(parseGuest(guest7), undefined);

        // 5. additionalGuest is not a "0", "1", undefined
        assert.deepStrictEqual(parseGuest(guest8), undefined);
        assert.deepStrictEqual(parseGuest(guest9), undefined);

        // 6. dietaryRestrictions is not a string
        assert.deepStrictEqual(parseGuest(guest10), undefined);
        assert.deepStrictEqual(parseGuest(guest11), undefined);

        // 7. additionalGuestName is not a string
        assert.deepStrictEqual(parseGuest(guest12), undefined);
        assert.deepStrictEqual(parseGuest(guest13), undefined);

        // 8. additionalGuestDietaryRestriction is not a string
        assert.deepStrictEqual(parseGuest(guest14), undefined);
        assert.deepStrictEqual(parseGuest(guest15), undefined);

        // 9. Parses guest successfully
        assert.deepStrictEqual(parseGuest(guest16), guest16);
        assert.deepStrictEqual(parseGuest(guest17), guest17);
    });

});