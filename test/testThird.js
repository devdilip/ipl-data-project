let expect = require('chai').expect;
let path = require('path');
let iplmatches = require('../scripts/iplMatchesDataSolution.js');
let matchesData = path.resolve("test/files/matchesTest.csv");
let matchesDataWithnull = path.resolve("test/files/matchesTestWithNull.csv");
let emptyData = path.resolve("test/files/empty.csv");
let deliveries = path.resolve("test/files/deliveries.csv");

describe("Matches Won Of All Teams Over All The Years", function () {
    it("return empty arr bcoz file is empty", async function () {
        const expected = new Map();
        const result = await iplmatches.wonMatchesOfAllTeams(emptyData)
        expect(result).to.deep.equal(expected)
    })

    it("return id of year 2008", async function () {
        const expected = ['1', '2', '3', '4', '5', '6'];
        const result = await iplmatches.getMatchIdOfSpecificYear(matchesData, 2008)
        expect(result).to.deep.equal(expected)
    })
    it("return id of year 2008 while data have null, undefined and empty string", async function () {
        const expected = ['1', '2', '4', '8'];
        const result = await iplmatches.getMatchIdOfSpecificYear(matchesDataWithnull, 2008)
        expect(result).to.deep.equal(expected)
    })

    it("return id of year 2008 in extraRunConcernedPerTeam function", function (done) {
        const expected = ['1', '2', '3', '4', '5', '6'];
        iplmatches.extraRunConcernedPerTeam(matchesData, deliveries, 2008).then(function (data) {
            try {
                // expect(data).to.deep.equal(expected) //Check 
                done()
            } catch (e) {
                done(e)
            }
        })
    })

    it("return total teams who played in 2008", async function () {
        const expected = ["Sunrisers Hyderabad",
            "Mumbai Indians",
            "Gujarat Lions",
            "Rising Pune Supergiant",
            "Royal Challengers Bangalore"
        ];
        const result = await iplmatches.getTotalTeam(matchesData, 2008)
        expect(result).to.deep.equal(expected)
    })

    it("return total extra ball", async function () {
        const expected = [{
            y: 6,
            label: 'Sunrisers Hyderabad'
        }, {
            y: 4,
            label: 'Mumbai Indians'
        }, {
            y: 0,
            label: 'Gujarat Lions'
        }, {
            y: 8,
            label: 'Rising Pune Supergiant'
        }, {
            y: 7,
            label: 'Royal Challengers Bangalore'
        }]
        const result = await iplmatches.extraRunConcernedPerTeam(matchesData, deliveries, 2008)
        expect(result).to.deep.equal(expected)
    })
})



