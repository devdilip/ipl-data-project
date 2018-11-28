let expect = require('chai').expect;
let path = require('path');
let iplmatches = require('../scripts/iplMatchesDataSolution.js');
let matchesData = path.resolve("test/files/matchesTest.csv");
let matchesDataWithnull = path.resolve("test/files/matchesTestWithNull.csv");
let emptyData = path.resolve("test/files/empty.csv");

describe("Matches Per Year", function () {

    it("return file is present or not", function (done) {
        expect(iplmatches.fileExists(matchesData)).equal(true);
        done();
    })

    it("return empty object from empty cvs file", async function () {
        const expected = {}
        const originalOutput = await iplmatches.getmatchPerSeason(emptyData)
        expect(originalOutput).to.deep.equal(expected)
    })

    it("should avoid null, undefined or empty string if there", async function () {
        const expected = {
            '2008': 6,
            '2010': 3
        };

        const result = await iplmatches.getmatchPerSeason(matchesDataWithnull);
        expect(result).deep.equal(expected);
    })

    it("return year per Matches", async function () {
        const expected = {
            '2008': 6,
            '2010': 3,
            '2011': 3,
            '2012': 2,
            '2017': 1
        }
        const originalOutput = await iplmatches.getmatchPerSeason(matchesData)
        expect(originalOutput).to.deep.equal(expected)
    })

    
    xit("return chart supported form Data", function (done) {
        const expected = [
            {
                label: '2008',
                y: 6
            },
            {
                label: '2010',
                y: 4
            }]
        const originalOutput = iplmatches.createJsonFileForPerYearMatch(matchesDataWithnull)
        done();
        console.log("wdsd "+originalOutput)
        expect(originalOutput).to.deep.equal(expected)
    })
    
})