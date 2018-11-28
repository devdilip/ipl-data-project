let expect = require('chai').expect;
let path = require('path');
let iplmatches = require('../scripts/iplMatchesDataSolution.js');
let matchesData = path.resolve("test/files/matchesTest.csv");
let matchesDataWithnull = path.resolve("test/files/matchesTestWithNull.csv");
let emptyData = path.resolve("test/files/empty.csv");
let deliveries = path.resolve("test/files/deliveries.csv");

let OriginalmatchesData = path.resolve("../csvfiles/matches.csv");
let Originaldeliveries = path.resolve("../csvfiles/deliveries.csv");

describe("Top Economical Bowler ", function () {
    it("return empty arr bcoz file is empty", async function () {
        const expected = [];
        const result = await iplmatches.topEconomicalBolers(emptyData,emptyData,"2008")
        expect(result).to.deep.equal(expected)
    })
    it("return content", async function () {
        const expected = [];
        const result = await iplmatches.topEconomicalBolers(OriginalmatchesData,Originaldeliveries,2015);
        expect(result).to.deep.equal(expected)
    })

})