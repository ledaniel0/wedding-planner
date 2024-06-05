import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { save, load, listGuests, resetForTesting } from './routes';

describe('routes', function() {
  
  it('listGuests', function() {
    // Initially, the guest list should be empty
    const req1 = httpMocks.createRequest({ method: 'GET', url: '/api/listGuests', query: {} });
    const res1 = httpMocks.createResponse();
    listGuests(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData().guestList, []);

    // Save a couple of guests
    const req2 = httpMocks.createRequest({
        method: 'POST',
        url: '/api/save',
        body: {
            name: "John",
            guestOf: "Alice",
            isFamily: true,
            additionalGuest: "unknown",
            dietaryRestrictions: "None",
            additionalGuestName: "",
            additionalGuestDietaryRestriction: ""
        }
    });
    const res2 = httpMocks.createResponse();
    save(req2, res2);

    const req3 = httpMocks.createRequest({
        method: 'POST',
        url: '/api/save',
        body: {
            name: "Alice",
            guestOf: "Bob",
            isFamily: false,
            additionalGuest: "1",
            dietaryRestrictions: "Gluten-Free",
            additionalGuestName: "Charlie",
            additionalGuestDietaryRestriction: "Vegan"
        }
    });
    const res3 = httpMocks.createResponse();
    save(req3, res3);

    // Load the guest list and assert the contents
    const req4 = httpMocks.createRequest({ method: 'GET', url: '/api/listGuests', query: {} });
    const res4 = httpMocks.createResponse();
    listGuests(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData().guestList.length, 2);
    // Assuming the structure of each guest object in the list
    assert.deepStrictEqual(res4._getData().guestList[0], {
        name: "John",
        guestOf: "Alice",
        isFamily: true,
        additionalGuest: "unknown",
        dietaryRestrictions: "None",
        additionalGuestName: "",
        additionalGuestDietaryRestriction: ""
    });
    assert.deepStrictEqual(res4._getData().guestList[1], {
        name: "Alice",
        guestOf: "Bob",
        isFamily: false,
        additionalGuest: "1",
        dietaryRestrictions: "Gluten-Free",
        additionalGuestName: "Charlie",
        additionalGuestDietaryRestriction: "Vegan"
    });

    // Reset for testing other cases
    resetForTesting();
  });

  it('save', function() {
    // Separate domain for each branch:
    // 1. Missing name
    const req1 = httpMocks.createRequest({
      method: 'POST',
      url: '/api/save',
      body: {
        // name missing
        guestOf: "Alice",
        isFamily: true,
        additionalGuest: "unknown",
        dietaryRestrictions: "None",
        additionalGuestName: "",
        additionalGuestDietaryRestriction: ""
      }
    });
    const res1 = httpMocks.createResponse();
    save(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), 'required argument "name" was missing');

    // 2. Missing guestOf
    const req2 = httpMocks.createRequest({
      method: 'POST',
      url: '/api/save',
      body: {
        name: "John",
        // guestOf missing
        isFamily: true,
        additionalGuest: "unknown",
        dietaryRestrictions: "None",
        additionalGuestName: "",
        additionalGuestDietaryRestriction: ""
      }
    });
    const res2 = httpMocks.createResponse();
    save(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), 'required argument "guestOf" was missing');
    
    // 3. Missing isFamily
    const req3 = httpMocks.createRequest({
      method: 'POST',
      url: '/save',
      body: {
        name: "John",
        guestOf: "Alice",
        // isFamily missing
        additionalGuest: "unknown",
        dietaryRestrictions: "None",
        additionalGuestName: "",
        additionalGuestDietaryRestriction: ""
      }
    });
    const res3 = httpMocks.createResponse();
    save(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(), 'required argument "isFamily" was missing');

    // 4. Missing additionalGuest
    const req4 = httpMocks.createRequest({
      method: 'POST',
      url: '/save',
      body: {
        name: "John",
        guestOf: "Alice",
        isFamily: true,
        // additionalGuest missing
        dietaryRestrictions: "None",
        additionalGuestName: "",
        additionalGuestDietaryRestriction: ""
      }
    });
    const res4 = httpMocks.createResponse();
    save(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(), 'required argument "additionalGuest" was missing');

    // 5. Missing dietaryRestrictions
    const req5 = httpMocks.createRequest({
      method: 'POST',
      url: '/save',
      body: {
        name: "John",
        guestOf: "Alice",
        isFamily: true,
        additionalGuest: "unknown",
        // dietaryRestrictions missing
        additionalGuestName: "",
        additionalGuestDietaryRestriction: ""
      }
    });
    const res5 = httpMocks.createResponse();
    save(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(), 'required argument "dietaryRestrictions" was missing');

    // 6. Missing additionalGuestName
    const req6 = httpMocks.createRequest({
      method: 'POST',
      url: '/save',
      body: {
        name: "John",
        guestOf: "Alice",
        isFamily: true,
        additionalGuest: "unknown",
        dietaryRestrictions: "None",
        // additionalGuestName missing
        additionalGuestDietaryRestriction: ""
      }
    });
    const res6 = httpMocks.createResponse();
    save(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(), 'required argument "additionalGuestName" was missing');
    // 7. Missing additionalGuestDietaryRestriction
    const req7 = httpMocks.createRequest({
      method: 'POST',
      url: '/save',
      body: {
        name: "John",
        guestOf: "Alice",
        isFamily: true,
        additionalGuest: "unknown",
        dietaryRestrictions: "None",
        additionalGuestName: "",
        // additionalGuestDietaryRestriction missing
      }
    });
    const res7 = httpMocks.createResponse();
    save(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 400);
    assert.deepStrictEqual(res7._getData(), 'required argument "additionalGuestDietaryRestriction" was missing');
    
    // 8. Saving a guest successfully
    const req8 = httpMocks.createRequest({
      method: 'POST',
      url: '/save',
      body: {
          name: "John",
          guestOf: "Alice",
          isFamily: true,
          additionalGuest: "unknown",
          dietaryRestrictions: "None",
          additionalGuestName: "",
          additionalGuestDietaryRestriction: ""
      }
    });
    const res8 = httpMocks.createResponse();
    save(req8, res8);
    assert.strictEqual(res8._getStatusCode(), 200);
    assert.deepStrictEqual(res8._getData(), { saved: true });

    const req9 = httpMocks.createRequest({
      method: 'POST',
      url: '/save',
      body: {
          name: "Alice",
          guestOf: "John",
          isFamily: false,
          additionalGuest: "1",
          dietaryRestrictions: "Vegetarian",
          additionalGuestName: "Bob",
          additionalGuestDietaryRestriction: "None"
      }
    });
    const res9 = httpMocks.createResponse();
    save(req9, res9);
    assert.strictEqual(res9._getStatusCode(), 200);
    assert.deepStrictEqual(res9._getData(), { saved: true });
  });

  it('load', function() {
    // 1. Missing guestName
    const req1 = httpMocks.createRequest({
      method: 'GET',
      url: '/api/load',
      query: {}
    });
    const res1 = httpMocks.createResponse();
    load(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), 'required argument "name" was missing');

    const req1b = httpMocks.createRequest({
      method: 'GET',
      url: '/api/load',
      query: { wrongParam: "value" } // Incorrect query parameter
    });
    const res1b = httpMocks.createResponse();
    load(req1b, res1b);
    assert.strictEqual(res1b._getStatusCode(), 400);
    assert.deepStrictEqual(res1b._getData(), 'required argument "name" was missing');

    // 2. Guest not found
    const req2 = httpMocks.createRequest({
      method: 'GET',
      url: '/api/load',
      query: { guestName: "NonExistentGuest" }
    });
    const res2 = httpMocks.createResponse();
    load(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 404);
    assert.deepStrictEqual(res2._getData(), 'no guest with that name in the guests');

    const req2b = httpMocks.createRequest({
      method: 'GET',
      url: '/api/load',
      query: { guestName: "AnotherNonExistentGuest" } // Another non-existent guest
    });
    const res2b = httpMocks.createResponse();
    load(req2b, res2b);
    assert.strictEqual(res2b._getStatusCode(), 404);
    assert.deepStrictEqual(res2b._getData(), 'no guest with that name in the guests');

    // 3. Loading a guest successfully
    const req3 = httpMocks.createRequest({
      method: 'POST',
      url: '/api/save',
      body: {
        name: "John",
        guestOf: "Alice",
        isFamily: true,
        additionalGuest: "unknown",
        dietaryRestrictions: "None",
        additionalGuestName: "",
        additionalGuestDietaryRestriction: ""
      }
    });
    const res3 = httpMocks.createResponse();
    save(req3, res3);

    const req4 = httpMocks.createRequest({
      method: 'GET',
      url: '/api/load',
      query: { guestName: "John" }
    });
    const res4 = httpMocks.createResponse();
    load(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 200);
    
    const req5 = httpMocks.createRequest({
      method: 'POST',
      url: '/api/save',
      body: {
          name: "Alice",
          guestOf: "Bob",
          isFamily: false,
          additionalGuest: "1",
          dietaryRestrictions: "Gluten-Free",
          additionalGuestName: "Charlie",
          additionalGuestDietaryRestriction: "Vegan"
      }
    });
    const res5 = httpMocks.createResponse();
    save(req5, res5);
    
    const req6 = httpMocks.createRequest({
        method: 'GET',
        url: '/api/load',
        query: { guestName: "Alice" }
    });
    const res6 = httpMocks.createResponse();
    load(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 200);
    const loadedGuest = res6._getData().guest;
    assert.deepStrictEqual(loadedGuest, {
        name: "Alice",
        guestOf: "Bob",
        isFamily: false,
        additionalGuest: "1",
        dietaryRestrictions: "Gluten-Free",
        additionalGuestName: "Charlie",
        additionalGuestDietaryRestriction: "Vegan"
        
    });

    resetForTesting();
  });

});
