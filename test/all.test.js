const should = require('should');
require('../src/ts/modules/indexModel.ts');


describe("model", function() {
    it("ignoreGuardCalc", function() {
        ignoreCalc([0.3,0.3,0.3]).should.equal(1 - (1-0.3)*(1-0.3)*(1-0.3));
    });

    it("addIf", function() {
        addIf(0.89,0.3).should.equal(ignoreCalc([0.3, 0.89]));
	});
});