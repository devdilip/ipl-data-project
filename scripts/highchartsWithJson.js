function getDataFromFiles(filePath) {
    let fileContent = [];
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            fileContent = JSON.parse(this.responseText);
        }
    };
    xhttp.open("GET", filePath, false);
    xhttp.send();
    return fileContent;
}

function pieChartOfMatchPerYear() {
    var NumOfMatchPerYear = getDataFromFiles("../jsonfiles/PerYearMatches.json");
    // document.getElementById('title-of-chart').innerHTML = "All Match Per Season";
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        title: {
            text: "Number of Matches Per Year in IPL"
        },
        axisY: {
            title: "Number of Matches",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC"
        },
        toolTip: {
            shared: true
        },
        data: [{
            type: "column",
            name: "Matches Played",
            showInLegend: true,
            yValueFormatString: "#,##0.#",
            dataPoints: NumOfMatchPerYear
        }]
    });
    chart.render();
}

function chartForWonMatchesInAllYearsInIPL() {
    var wonMatchesInAllYear = getDataFromFiles("../jsonfiles/wonMatchesOfAllTeamsInIPL.json");
    let chartObj = [];
    for (i = 0; i < wonMatchesInAllYear.length; i++) {
        let obj = {
            type: "stackedBar",
            showInLegend: true,
            name: wonMatchesInAllYear[i][0],
            dataPoints: wonMatchesInAllYear[i][1]
        }
        chartObj.push(obj);
    }
    var chart = new CanvasJS.Chart("chartContainer", {
        title: {
            text: "IPL Team."
        },
        toolTip: {
            shared: true
        },
        axisY: {
            title: "Won match per Year"
        },
        data: chartObj
    });
    chart.render();

}

function chartForExtraRunPerTeam() {
    var extraRunPerTeam = getDataFromFiles("../jsonfiles/extraRunPerTeam.json");
    var chart = new CanvasJS.Chart("chartContainer", {
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        animationEnabled: true,
        title: {
            text: "Extra Run Per Team in 2016"
        },
        data: [{
            type: "pie",
            startAngle: 25,
            toolTipContent: "<b>{label}</b>: {y} Runs",
            showInLegend: "true",
            legendText: "{label}",
            indexLabelFontSize: 16,
            indexLabel: "{label} - {y} Runs",
            dataPoints: extraRunPerTeam
        }]
    });
    chart.render();
}

function chartForEconomicRateOfBowler() {
    let economicRateofBowler = getDataFromFiles("../jsonfiles/bowlerEconomicRate.json");
    console.log(economicRateofBowler);
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Economic Rate of Bowler in IPL 2015"
        },
        data: [{
            type: "column", //"pyramid" // "line" //"column" //pie //"area"
            indexLabelFontSize: 18,
            valueRepresents: "area",
            toolTipContent: "<b>{label}:</b> {y}",
            dataPoints: economicRateofBowler
        }]
    });
    chart.render();
}

function renderChart(event) {
    let chartSelection = event.id;
    document.getElementById("chartContainer").innerHTML = "";
    document.getElementById("select-player").style.display = "none";
    if (chartSelection == "allMatchesPerSeason") {
        pieChartOfMatchPerYear();
    } else if (chartSelection == "winMatchperyear") {
        chartForWonMatchesInAllYearsInIPL();
    } else if (chartSelection == "extraRunPerTeam") {
        chartForExtraRunPerTeam();
    } else if (chartSelection == "economicBowlerRate") {
        chartForEconomicRateOfBowler();
    } else if (chartSelection == "TopThree") {
        document.getElementById("select-player").style.display = "flex";
        batsmanStrikeOfAllSeason("../jsonfiles/batsman/v-kohli.json", "Virat Kohali");
    } else if (chartSelection == "home") {
        window.location.reload();
    }
}

function selectPlayer() {
    let selectBox = document.getElementById("selectBox");
    let selectedValue = selectBox.options[selectBox.selectedIndex].value;
    let selectedText = selectBox.options[selectBox.selectedIndex].text;
    batsmanStrikeOfAllSeason("../jsonfiles/batsman/" + selectedValue, selectedText);
}

function batsmanStrikeOfAllSeason(filePath, batsmanName) {
    let batsmanData = getDataFromFiles(filePath);
    let foursRunArr = [];
    let SixRunArr = [];
    let strikeRate = [];
    let totalRunsArr = [];
    for (key in batsmanData) {
        let fourRunObj = {
            "y": batsmanData[key].four,
            "label": batsmanData[key].year
        };
        let SixRunObj = {
            "y": batsmanData[key].six,
            "label": batsmanData[key].year,
        };
        let totalRunObj = {
            "label": batsmanData[key].year,
            "y": batsmanData[key].run
        };
        let strikeRunObj = {
            "label": batsmanData[key].year,
            "y": batsmanData[key].strikeRate
        };
        SixRunArr.push(SixRunObj);
        foursRunArr.push(fourRunObj);
        totalRunsArr.push(totalRunObj);
        strikeRate.push(strikeRunObj);
    }
    StrikeRateAndRunChart(strikeRate, totalRunsArr,batsmanName);
    playersSix(SixRunArr);
    playersFour(foursRunArr);
}

function StrikeRateAndRunChart(strikeRate, totalRunsArr,batsmanName) {
    var chart = new CanvasJS.Chart("chartContainer", {
        theme: "light2",
        animationEnabled: true,
        title: {
            text: batsmanName + " performance overall IPL"
        },
        axisY: {
            includeZero: false,
            title: "Strick Rate and Runs",
        },
        toolTip: {
            shared: "true"
        },
        legend: {
            cursor: "pointer"
        },
        data: [{
                type: "spline",
                showInLegend: true,
                yValueFormatString: "####",
                name: "Strike Rate",
                dataPoints: strikeRate
            },
            {
                type: "spline",
                showInLegend: true,
                yValueFormatString: "####Runs",
                name: "Total Runs",
                dataPoints: totalRunsArr
            }
        ]
    });
    chart.render();
}

function playersSix(SixRunArr) {
    var chart = new CanvasJS.Chart("chartContainerSix", {
        animationEnabled: true,
        title: {
            text: "Total Six in all season"
        },
        data: [{
            type: "pie",
            startAngle: 240,
            yValueFormatString: "##\"\"",
            indexLabel: "{label} {y}",
            dataPoints: SixRunArr
        }]
    });
    chart.render();
}

function playersFour(foursRunArr) {
    var chart = new CanvasJS.Chart("chartContainerFour", {
        animationEnabled: true,
        title: {
            text: "Total Four in all season"
        },
        data: [{
            type: "pie",
            startAngle: 240,
            yValueFormatString: "##\"\"",
            indexLabel: "{label} {y}",
            dataPoints: foursRunArr
        }]
    });
    chart.render();
}