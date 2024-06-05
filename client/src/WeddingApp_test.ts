import { Guest } from "./Guest";
import { doCountFamilyResponse, doCountMaxGuestsResponse, doCountMinGuestsResponse } from "./WeddingApp";
import * as assert from 'assert';

describe('Wedding App', function() {

  const guestList: Guest[] = [
    { name: 'Alice', guestOf: 'John', isFamily: true, dietaryRestrictions: "", additionalGuest: '0', additionalGuestName: "", additionalGuestDietaryRestriction: "" },
    { name: 'Bob', guestOf: 'John', isFamily: false, dietaryRestrictions: "", additionalGuest: '0', additionalGuestName: "", additionalGuestDietaryRestriction: "" },
    { name: 'Charlie', guestOf: 'John', isFamily: true, dietaryRestrictions: "", additionalGuest: '0', additionalGuestName: "", additionalGuestDietaryRestriction: "" },
    { name: 'David', guestOf: 'Jane', isFamily: true, dietaryRestrictions: "", additionalGuest: '0', additionalGuestName: "", additionalGuestDietaryRestriction: "" },
    { name: 'Eve', guestOf: 'Jane', isFamily: false, dietaryRestrictions: "", additionalGuest: '0', additionalGuestName: "", additionalGuestDietaryRestriction: "" },
    { name: 'Frank', guestOf: 'John', isFamily: true, dietaryRestrictions: "", additionalGuest: '0', additionalGuestName: "", additionalGuestDietaryRestriction: "" },
    { name: 'Grace', guestOf: 'John', isFamily: false, dietaryRestrictions: "", additionalGuest: '0', additionalGuestName: "", additionalGuestDietaryRestriction: "" },
  ];

  it('family guests', function() {
    assert.strictEqual(doCountFamilyResponse(guestList, 'John'), 3);
    assert.strictEqual(doCountFamilyResponse(guestList, 'Jane'), 1);
  });

  it('min guests', function() {
    assert.strictEqual(doCountMinGuestsResponse(guestList, 'John'), 5);
    assert.strictEqual(doCountMinGuestsResponse(guestList, 'Jane'), 2);
  });

  it('max guests', function() {
    assert.strictEqual(doCountMaxGuestsResponse(guestList, 'John'), 5);
    assert.strictEqual(doCountMaxGuestsResponse(guestList, 'Jane'), 2);
  });

});


