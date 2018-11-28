let expect = require('chai').expect;
let path = require('path');
let iplmatches = require('../scripts/iplMatchesDataSolution.js');
let matchesData = path.resolve("test/files/matchesTest.csv");
let matchesDataWithnull = path.resolve("test/files/matchesTestWithNull.csv");
let emptyData = path.resolve("test/files/empty.csv");

describe("Matches Won Of All Teams Over All The Years", function () {
    it("return empty arr bcoz file is empty", async function () {
        const expected = new Map();
        // const expected = {};        
        const result = await iplmatches.wonMatchesOfAllTeams(emptyData)
        expect(result).to.deep.equal(expected)
    })

    xit("return all team of IPL", async function () {
        const expected = [
            "Sunrisers Hyderabad",
            "Mumbai Indians",
            "Gujarat Lions",
            "Rising Pune Supergiant",
            "Royal Challengers Bangalore",
            "Kolkata Knight Riders",
            "Delhi Daredevils",
            "Kings XI Punjab"
        ]
        const originalOutput = await iplmatches.wonMatchesOfAllTeams(matchesData)
        expect(originalOutput).to.deep.equal(expected)  //returning teamArray

    })

    xit("return all specific season per team", function (done) {

        let expectedResult = new Map();
        expectedResult.set('Sunrisers Hyderabad', [{'2008':2}]);
        expectedResult.set('Rising Pune Supergiant', [{'2008':1}]);
        expectedResult.set('Kolkata Knight Riders', [{'2008':1,'2011':1,'2012':1 }]);
        expectedResult.set('Kings XI Punjab', [{'2008':1,'2010':1}]);
        expectedResult.set('Royal Challengers Bangalore', [{'2008':1}]);
        expectedResult.set('Mumbai Indians', [{'2010':1,'2011':2}]);
        expectedResult.set('Delhi Daredevils', [{'2010':1,'2017':1}]);
        expectedResult.set('Gujarat Lions', [{'2012':1}]);

        iplmatches.wonMatchesOfAllTeams(matchesData).then(function (data) {
            try {
                expect(data).to.deep.equal(expectedResult)
                done()
            } catch (e) {
                done(e)
            }
        })

    })
    xit("return all specific season per team while file have null, undefined and empty space", function (done) {

        let expectedResult = new Map();
        expectedResult.set('Sunrisers Hyderabad', [{'2008':2}]);
        expectedResult.set('Rising Pune Supergiant', [{'2008':1}]);
        expectedResult.set('Kolkata Knight Riders', [{'2008':1}]);
        expectedResult.set('Kings XI Punjab', [{'2008':2}]);
        expectedResult.set('Royal Challengers Bangalore', [{'2010':1}]);
        expectedResult.set('Mumbai Indians', [{'2010':1}]);
        expectedResult.set('Delhi Daredevils', [{'2010':1}]);

        iplmatches.wonMatchesOfAllTeams(matchesDataWithnull).then(function (data) {
            try {
                expect(data).to.deep.equal(expectedResult)
                done()
            } catch (e) {
                done(e)
            }
        })

    })
})