let expect = require('chai').expect;
let path = require('path');
let iplmatches = require('../scripts/iplMatchesDataSolution.js');
let matchesData = path.resolve("test/files/matchesTest.csv");
let matchesDataWithnull = path.resolve("test/files/matchesTestWithNull.csv");
let emptyData = path.resolve("test/files/empty.csv");
let deliveries = path.resolve("test/files/deliveries.csv");


describe("Batsman data of all season", function () {
    it("return empty arr bcoz file is empty", async function () {
        const expected = [];
        const result = await iplmatches.batsmanStrike(emptyData, emptyData, "")
        expect(result).to.deep.equal(expected)
    })
    it("return empty arr bcoz file is empty", async function () {
        const expected = [{
            "batsman": "S Dhawan",
            "four": 5,
            "run": 40,
            "six": 0,
            "strikeRate": 129,
            "year": "2008"
        },{
            "batsman": "S Dhawan",
            "four": 0,
            "run": 0,
            "six": 0,
            "strikeRate": 0.00,
            "year": "2010"
        },{
            "batsman": "S Dhawan",
            "four": 0,
            "run": 0,
            "six": 0,
            "strikeRate": 0.00,
            "year": "2011"
        },{
            "batsman": "S Dhawan",
            "four": 0,
            "run": 0,
            "six": 0,
            "strikeRate": 0.00,
            "year": "2012"
        },{
            "batsman": "S Dhawan",
            "four": 0,
            "run": 0,
            "six": 0,
            "strikeRate": 0.00,
            "year": "2017"
        }];
        const result = await iplmatches.batsmanStrike(matchesData, deliveries, "S Dhawan")
        expect(result).to.deep.equal(expected)
    })

})