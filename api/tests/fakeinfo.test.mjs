import {jest} from '@jest/globals';

import FakeInfo from './FakeInfo';

// my first jest unit test
test("can we create a FakeInfo object ?",() => {
    let fakeInfo = new FakeInfo();
    
    expect(fakeInfo);
})

// --------------- birthday check from CPR -------------------


test("does the dates match (set cpr) ?",() => {
    let fakeInfo = new FakeInfo();
    fakeInfo.setCpr();

    // the order is mirrored
    //console.log("fakeInfo.birthDate", fakeInfo.birthDate);
    //console.log("fakeInfo.cpr", fakeInfo.cpr);
    
    let checking = fakeInfo.birthDate.slice(8,10) + // dd
        fakeInfo.birthDate.slice(5,7) +             // mm
        fakeInfo.birthDate.slice(2,4);              // yy

    expect(checking).toBe(fakeInfo.cpr.slice(0, 6));
})

// test("does the dates match (set birthday) ?",() => {
//     let fakeInfo = new FakeInfo();
//     fakeInfo.setBirthDate();
//     expect(fakeInfo);
// })