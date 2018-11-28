function fileExists(matchesData) {
    return require('fs').existsSync(matchesData);
}

function getmatchPerSeason(matchesData) {
    return new Promise(function (resolve, rejected) {
        let matchesPerSeason = {};
        require('fs').readFile(matchesData, function (err, data) {
            if (err) {
                reject(err)
            } else {
                data.toString().split("\n").forEach(function (line, index) {
                    if (index != 0) {
                        const match = line.split(",")
                        const season = parseInt(match[1]);
                        if (season) {
                            if (matchesPerSeason.hasOwnProperty(season)) {
                                matchesPerSeason[season]++;
                            } else {
                                matchesPerSeason[season] = 1;
                            }
                        }
                    }
                })
                resolve(matchesPerSeason);
            }
        })
    })
}

function wonMatchesOfAllTeams(matchesData) {
    return new Promise(function (resolve, rejected) {
        let teamMap = new Map();
        require('fs').readFile(matchesData, function (err, data) {
            if (err) {
                reject(err)
            } else {
                data.toString().split("\n").forEach(function (line, index) {
                    if (index != 0) {
                        const match = line.split(",");
                        const season = parseInt(match[1]);
                        const winner = match[10];
                        if (winner && season) {
                            if (teamMap.has(winner)) {
                                teamMap.get(winner).forEach(function (ele) {
                                    if (ele.hasOwnProperty(season)) {
                                        ele[season]++;
                                    } else {
                                        ele[season] = 1;
                                    }
                                })
                            } else {
                                let obj = {};
                                obj[season] = 1;
                                teamMap.set(winner, [obj]);

                            }
                        }
                    }
                })
            }
            let winMatchMap = new Map();
            teamMap.forEach((v, k) => {
                let winMatches = [];
                for (key in v[0]) {
                    let obj = {
                        'y': v[0][key],
                        'label': key
                    }
                    winMatches.push(obj);
                }
                winMatchMap.set(k, winMatches);
            });
            resolve(winMatchMap);
        })
    })
}

function extraRunConcernedPerTeam(matchesData, deliveries, year) {
    return new Promise(function (resolve, rejected) {
        let matchId = [];
        let teams = [];
        let extraRunPerTeam = [];
        getMatchIdOfSpecificYear(matchesData, year).then(async function (data) {
            matchId = await data;
            getTotalTeam(matchesData, year).then(async function (data) {
                teams = await data;
                require('fs').readFile(deliveries, function (err, data) {
                    if (err) {
                        reject(err)
                    } else {
                        let extraRun = 0;
                        teams.forEach(function (team) {
                            data.toString().split("\n").forEach(function (line, index) {
                                if (index != 0) {
                                    const match = line.split(",");
                                    if (matchId.includes(match[0]) && (team == match[3])) {
                                        extraRun = extraRun + parseInt(match[16]);
                                    }
                                }
                            })
                            let matchObj = {};
                            matchObj['y'] = extraRun;
                            matchObj["label"] = team;
                            extraRunPerTeam.push(matchObj);
                            extraRun = 0;
                        })
                        console.log(extraRunPerTeam);
                        resolve(extraRunPerTeam);
                    }
                })

            })
        })
    })
}

function getMatchIdOfSpecificYear(matchesData, year) {
    return new Promise(function (resolve, rejected) {
        let matchId = [];
        require('fs').readFile(matchesData, function (err, data) {
            if (err) {
                reject(err)
            } else {
                data.toString().split("\n").forEach(function (line, index) {
                    if (index != 0) {
                        const match = line.split(",");
                        if (parseInt(match[0])) {
                            if (match[1] == year) {
                                matchId.push(match[0]);
                            }
                        }
                    }
                })
            }
            resolve(matchId);
        })
    })
}

function getTotalTeam(matchesData, year) {
    return new Promise(function (resolve, rejected) {
        let teams = [];
        require('fs').readFile(matchesData, function (err, data) {
            if (err) {
                reject(err)
            } else {
                data.toString().split("\n").forEach(function (line, index) {
                    if (index != 0) {
                        const match = line.split(",");
                        if (parseInt(match[1])) {
                            if (match[1] == year) {
                                if (!teams.includes(match[4]))
                                    teams.push(match[4]);
                            }
                        }
                    }
                })
            }
            resolve(teams);
        })
    })
}
// Fourth Ques

function topEconomicalBolers(matchesData, deliveries, year) {
    return new Promise(function (resolve, rejected) {
        let topTenBowler = [];
        getMatchIdOfSpecificYear(matchesData, year).then(async function (matchId) {
            let startId = matchId[0];
            let endId = matchId[matchId.length - 1];
            let bowlerRun = {};
            let bowlerBalls = {};
            require('fs').readFile(deliveries, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    data.toString().split("\n").forEach(function (line, index) {
                        if (index != 0) {
                            deliveryData = line.split(",");
                            let deliveryId = deliveryData[0];
                            let bowlerName = deliveryData[8];
                            let wideBall = deliveryData[10];
                            let noBall = deliveryData[13];
                            let run = deliveryData[17];
                            if (deliveryId >= startId && deliveryId <= endId) {
                                if (bowlerRun.hasOwnProperty(bowlerName)) {
                                    bowlerRun[bowlerName] += parseInt(run);
                                } else {
                                    bowlerRun[bowlerName] = 1;
                                }
                                if (bowlerBalls.hasOwnProperty(bowlerName)) {
                                    if (noBall == "0" && wideBall == "0") {
                                        bowlerBalls[bowlerName]++;
                                    }
                                } else {
                                    bowlerBalls[bowlerName] = 1;
                                }
                            }
                        }
                    })
                    let arr = [];
                    for (ball in bowlerBalls) {
                        for (run in bowlerRun) {
                            if (run === ball) {
                                let economicRate = ((bowlerRun[run] / bowlerBalls[ball]) * 6).toFixed(2);
                                let obj = {
                                    y: economicRate,
                                    bowler: run
                                }
                                arr.push(obj);
                            }
                        }
                    }
                    arr.sort(function (a, b) {
                        return a.y - b.y;
                    })
                    topTenBowler = arr.splice(0, 10);
                    resolve(topTenBowler);
                }
            })
        })
        
    })
}

// topEconomicalBolers("../csvfiles/matches.csv", "../csvfiles/deliveries.csv", 2015);

function batsmanStrike(matchesData, deliveries, batsman) {
    return new Promise(function (resolve, rejected) {
        let batsmanStrikeArr = [];
        let matchObj = {};
        require('fs').readFile(matchesData, function (err, mData) {
            if (err) {
                reject(err)
            } else {
                require('fs').readFile(deliveries, function (err, dData) {
                    if (err) {
                        reject(err)
                    } else {
                        mData.toString().split("\n").forEach(function (line1, index1) {
                            if (index1 != 0) {
                                const match = line1.split(",");
                                if (!matchObj.hasOwnProperty(match[1]) && match[1]) {
                                    matchObj[match[1]] = {};
                                    matchObj[match[1]]["batsman"] = batsman,
                                        matchObj[match[1]]["run"] = 0,
                                        matchObj[match[1]]["four"] = 0,
                                        matchObj[match[1]]["six"] = 0
                                    matchObj[match[1]]["balls"] = 0
                                }
                                if (matchObj.hasOwnProperty(match[1]) && match[1]) {
                                    dData.toString().split("\n").forEach(function (line2, index) {
                                        if (index != 0) {
                                            const delivery = line2.split(",");
                                            if ((match[0] == delivery[0]) && (delivery[6] == batsman)) {
                                                matchObj[match[1]]["balls"]++;
                                                matchObj[match[1]]["run"] += parseInt(delivery[15]);
                                                if (parseInt(delivery[15]) === 4)
                                                    matchObj[match[1]]["four"]++;
                                                if (parseInt(delivery[15]) === 6)
                                                    matchObj[match[1]]["six"]++;
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    }
                    for (key in matchObj) {
                        let StrikeRate = ((matchObj[key].run / matchObj[key].balls) * 100).toFixed(2);
                        if (!parseInt(StrikeRate)) {
                            StrikeRate = 0;
                        }
                        let obj = {
                            "year": key,
                            "batsman": matchObj[key].batsman,
                            "run": matchObj[key].run,
                            "four": matchObj[key].four,
                            "six": matchObj[key].six,
                            "strikeRate": parseInt(StrikeRate)
                        };
                        batsmanStrikeArr.push(obj);
                    }
                    resolve(batsmanStrikeArr);
                })
            }
        })
    })
}

/*************   JSON Files  *************/
function createJsonFileForPerYearMatch() {
    let matchesData = require('path').resolve("../csvfiles/matches.csv");
    getmatchPerSeason(matchesData).then(async function (matchesData) {
        let perYearMatch = [];
        for (key in matchesData) {
            let matchAndSeason = {};
            matchAndSeason['label'] = key;
            matchAndSeason['y'] = matchesData[key];
            perYearMatch.push(matchAndSeason);
        }
        require('fs').writeFile("../jsonfiles/perYearMatches.json", JSON.stringify(perYearMatch, null, 4), (err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log("perYearMatches File Created");
        });
    })
}

function createJsonFileForwonMatchesOfAllTeams() {
    let matchesData = require('path').resolve("../csvfiles/matches.csv");
    wonMatchesOfAllTeams(matchesData).then(async function (wonMatchesTeams) {
        require('fs').writeFile("../jsonfiles/wonMatchesOfAllTeams.json", JSON.stringify([...wonMatchesTeams]), (err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log("wonMatchesTeams File Created");
        });
    })
}

function createJsonFileForExtraRunConcernedPerTeam() {
    let matchesData = require('path').resolve("../csvfiles/matches.csv");
    let deliveriesData = require('path').resolve("../csvfiles/deliveries.csv");
    extraRunConcernedPerTeam(matchesData, deliveriesData, 2016).then(async function (extraRun) {
        require('fs').writeFile("../jsonfiles/extraRunConcernedPerTeam.json", JSON.stringify(extraRun, null, 4), (err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log("extraRunConcernedPerTeam File Created");
        });
    })
}

function createJsonFileBatsmanStrike(batsmanName) {
    batsmanStrike("../csvfiles/matches.csv", "../csvfiles/deliveries.csv", batsmanName).then(async function (batsman) {
        let perYearMatch = await batsman;
        require('fs').writeFile("../jsonfiles/batsman/msdhoni.json", JSON.stringify(perYearMatch, null, 4), (err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(batsmanName + " File Created");
        });
    })
}

module.exports = {
    fileExists: fileExists,
    getmatchPerSeason: getmatchPerSeason,
    wonMatchesOfAllTeams: wonMatchesOfAllTeams,
    getMatchIdOfSpecificYear: getMatchIdOfSpecificYear,
    extraRunConcernedPerTeam: extraRunConcernedPerTeam,
    getTotalTeam: getTotalTeam,
    batsmanStrike: batsmanStrike,
    topEconomicalBolers: topEconomicalBolers
}
// createJsonFileForPerYearMatch();
// createJsonFileForwonMatchesOfAllTeams();
// createJsonFileForExtraRunConcernedPerTeam();
// createJsonFileBatsmanStrike("MS Dhoni");