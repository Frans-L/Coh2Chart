
// Hoitaa taulukoiden luomisen ja datan sijoittamisen niihin
// Tiedostot: menu.js, chart.js yhdistetaan core.js tiedostoon 

//charts
var chartData = [];
var chartDataEmpty = [];
var chartOptions = [];
var chartChart = [];
var chartTitle = [];

//time slider
var startDay = new Date(2017, 4, 15, 1, 0, 0, 0);
var endDay = new Date(2017, 4, 15, 1, 0, 0, 0);
startDay.setDate(startDay.getDate() - 90);


//palauttaa viittauksen taulukkoon
function locateBarChartWinRatio(divID) {
    return new google.visualization.BarChart(document.getElementById(divID));
}

function locateBarChartGamesPlayed(divID) {
    return new google.visualization.ColumnChart(document.getElementById(divID));
}

function locatePieChartGamesPlayed(divID) {
    return new google.visualization.PieChart(document.getElementById(divID));
}


//valmistelee datan piirtoa varten
function initializeBarChartWinRatio(allData, id, divChart, title) {
    chartData[id] = new google.visualization.arrayToDataTable(allData);

    //lisataan annotation, jossa on winratio
    //rivi sisaltaa tiedot, column muuttujien tunnukset
    for (var i = 0; i < chartData[id].getNumberOfRows(); i++) {
        var value = chartData[id].getValue(i, 1);
        chartData[id].setValue(i, 4, value + ""); // 3 tarkoittaa neljatta jasenta

    }

    chartOptions[id] = {
        'title': title,
        'titleTextStyle': {
            'color': 'black',
            'fontSize': 14,
            'bold': 'true',
            'fontName': 'sans-serif'
        },
        'chartArea': {
            'top': '10%',
            'left': '15%',
            'width': '75%',
            'height': '75%'
        },
        //'hAxis': {'title': 'Year', 'titleTextStyle': {'color': 'red'}},
        //'colors': ['red','green'],
        //'colors': ['#5DA5DA','#F15854'],
        'height': VAKIO_Height,
        //'width':VAKIO_WidthHalf,
        'isStacked': 'true',
        'legend': {
            'position': 'none'
        },
        'hAxis': {
            'viewWindow': {
                'min': 0,
                'max': 1
            },
            'gridlines': {
                'count': 9
            },
        },
        'series': {
            1: {
                'color': '#F1F1F1',
            },
        },
        'annotations': {
            'textStyle': {
                'fontSize': 12,
                'bold': 'false',
                'italic': 'true',
            },
        },
        'animation': {
            'duration': VAKIO_ChartAnimationTime,
            'easing': VAKIO_ChartAnimationStyle,
        },
    };

    chartChart[id] = divChart; //mihin kohtaan piirretaan
}

//juoksevan viikon pelatut pelit yhteensa
function initializeBarChartGamesPlayed(allData, id, divChart, title) {
    chartData[id] = new google.visualization.arrayToDataTable(allData);

    //lisataan annotation, jossa on columnien summa
    //rivi vaaka, column pysty
    for (var i = 0; i < chartData[id].getNumberOfRows(); i++) {
        var total = 0;
        //  j=1, koska ensimmainen factionen nimi
        //  -2, koska 0 --> (n-1) ja viimeinen on {setting}
        for (var j = 1; j <= chartData[id].getNumberOfColumns() - 2; j++) {
            total += chartData[id].getValue(i, j);
        }
        chartData[id].setValue(i, chartData[id].getNumberOfColumns() - 1, total + "");

    }

    // Set chart options
    chartOptions[id] = {
        'title': title,
        'titleTextStyle': {
            'color': 'black',
            'fontSize': 14,
            'bold': 'true',
            'fontName': 'sans-serif'
        },
        'chartArea': {
            'top': '10%',
            'left': '15%',
            'width': '75%',
            'height': '75%'
        },
        //'hAxis': {'title': 'Year', 'titleTextStyle': {'color': 'red'}},
        //'colors': ['red','green'],
        'colors': ['#5DA5DA', '#F15854'],
        'vAxis': {
            'viewWindow': {
                'min': 0
            },
            'format': ''
        },
        'height': VAKIO_Height,
        //'width':VAKIO_WidthHalf,
        'isStacked': 'true',
        'annotations': {
            'textStyle': {
                'fontSize': 12,
                'bold': 'false',
                'italic': 'true',
            },
        },
        'legend': {
            'position': 'bottom'
        },
        'animation': {
            'duration': VAKIO_ChartAnimationTime,
            'easing': VAKIO_ChartAnimationStyle,
        },
    };

    //piirros
    chartChart[id] = divChart;
    //chartChart[id].draw(chartData[id], chartOptions[id]);
}


//juoksevan viikon pelatut pelit yhteensa
function initializeBarChartGamesPlayedAll(allData, id, divChart, title) {
    chartData[id] = new google.visualization.arrayToDataTable(allData);

    //lisataan annotation, jossa on columnien summa
    //rivi vaaka, column pysty
    for (var i = 0; i < chartData[id].getNumberOfRows(); i++) {
        var total = 0;
        //  j=1, koska ensimmainen factionen nimi
        //  -2, koska 0 --> (n-1) ja viimeinen on {setting}
        for (var j = 1; j <= chartData[id].getNumberOfColumns() - 2; j++) {
            total += chartData[id].getValue(i, j);
        }
        chartData[id].setValue(i, chartData[id].getNumberOfColumns() - 1, total + "");

    }

    // Set chart options
    chartOptions[id] = {
        'title': title,
        'titleTextStyle': {
            'color': 'black',
            'fontSize': 14,
            'bold': 'true',
            'fontName': 'sans-serif'
        },
        'chartArea': {
            'top': '10%',
            'left': '15%',
            'width': '75%',
            'height': '75%'
        },
        //'hAxis': {'title': 'Year', 'titleTextStyle': {'color': 'red'}},
        //'colors': ['red','green'],
        'colors': fColorsI,
        'vAxis': {
            'viewWindow': {
                'min': 0
            },
            'format': ''
        },
        'height': VAKIO_Height,
        //'width':VAKIO_WidthHalf,
        'isStacked': 'true',
        'annotations': {
            'textStyle': {
                'fontSize': 12,
                'bold': 'false',
                'italic': 'true',
            },
        },
        'legend': {
            'position': 'bottom'
        },
        'animation': {
            'duration': VAKIO_ChartAnimationTime,
            'easing': VAKIO_ChartAnimationStyle,
        },
    };

    //piirros
    chartChart[id] = divChart;
    //chartChart[id].draw(chartData[id], chartOptions[id]);
}


//juoksevan viikon pelatut pelit Piirakka
function initializePieChartGamesPlayedAll(allData, id, divChart, title) {
    chartData[id] = new google.visualization.arrayToDataTable(allData);

    // Set chart options
    chartOptions[id] = {
        'title': title,
        'titleTextStyle': {
            'color': 'black',
            'fontSize': 14,
            'bold': 'true',
            'fontName': 'sans-serif'
        },
        'chartArea': {
            'top': '10%',
            'left': '15%',
            'width': '75%',
            'height': '75%'
        },
        //'hAxis': {'title': 'Year', 'titleTextStyle': {'color': 'red'}},
        'colors': fColors,
        'vAxis': {
            'viewWindow': {
                'min': 0
            },
            'format': ''
        },
        'height': VAKIO_Height,
        //'width':VAKIO_WidthHalf,
        'legend': {
            'position': 'bottom'
        },
        'animation': {
            'duration': VAKIO_ChartAnimationTime,
            'easing': VAKIO_ChartAnimationStyle,
        },
        'pieHole': 0.4,
    };

    //piirros
    chartChart[id] = divChart;
    //chartChart[id].draw(chartData[id], chartOptions[id]);
}

//win-ratio kayra paivittain
function initializeLineChartWin(allData, id, divChart, title) {
    chartData[id] = new google.visualization.arrayToDataTable(allData, false);
    chartChart[id] = divChart['dashboard'];
    chartChart[id + "_main"] = divChart['main'];
    chartChart[id + "_slider"] = divChart['slider'];
    chartTitle[id] = title;

    //luodaan jyhta, jotta jokaisella ID:lla olisi options
    //helpottaa silmukoiden lapikayntia
    chartOptions[id] = null;
}


function locateLineChartWin(divID) {

    var charts = [];

    // dashboard
    charts['dashboard'] = new google.visualization.Dashboard();

    //slider
    charts['slider'] = new google.visualization.ControlWrapper({
        'controlType': 'ChartRangeFilter',
        'containerId': divID + '_slider',
        'options': {
            'filterColumnLabel': 'Date',
            'ui': {
                'chartType': 'LineChart',
                'chartOptions': {
                    'chartArea': {
                        'color': 'black',
                        'fontSize': 14,
                        'bold': 'true',
                        'fontName': 'sans-serif'
                    },
                    'hAxis': {
                        'baselineColor': 'none'
                    },
                    'height': 30,
                    'colors': fColors,
                    'chartArea': {
                        'top': '12%',
                        'left': '10%',
                        'width': '75%',
                        'height': '100%'
                    },
                },
                'minRangeSize': 86400000 * 5,
                'snapToData': false,
                'animation': {
                    'duration': VAKIO_ChartAnimationTime,
                    'easing': VAKIO_ChartAnimationStyle,
                },
            },
        },
        'state': {
            'range': {
                'start': startDay,
                'end': endDay,
            },
        },
    });

    // Line chart visualization (main)
    charts['main'] = new google.visualization.ChartWrapper({
        'chartType': 'LineChart',
        'containerId': divID + '_main',
        'options': {
            'title': 'Still loading (probably)',
            'titleTextStyle': {
                'color': 'black',
                'fontSize': 15,
                'fontName': 'sans-serif'
            },
            'chartArea': {
                'top': '12%',
                'left': '10%',
                'width': '75%',
                'height': '80%'
            },
            'height': 380,
            'colors': fColors,
            'animation': {
                'duration': VAKIO_ChartAnimationTime,
                'easing': VAKIO_ChartAnimationStyle,
            },
        },
    });

    // synkronointi
    charts['dashboard'].bind(charts['slider'], charts['main']);
    return charts

    //chartChart[id].draw(chartData[id]);
}

function chartsInitialize() {
    //1. luodaan ja haetaan pohja, johon voidaan piirtaa diagrammit
    //2. esiladataan tiedot taulukoihin, ja talletetaan mihin pohjaan ne piirretaan

    var divChart;
    var id;

    //winratiodaily
    divChart = locateLineChartWin('C_WinRatio');
    for (var elo = 0; elo < 3; elo++) {
        for (var arranged = 0; arranged <= 1; arranged++) {
            for (var gameMode = 1; gameMode <= 4; gameMode++) {
                if (arranged == 1 && gameMode == 1) {
                    continue;
                }
                id = 'winRatioDaily' + 'M' + gameMode + 'E' + ELOdb[elo] + 'A' + arranged;
                initializeLineChartWin(pureData[id], id, divChart, gameMode + ' vs ' + gameMode + "- Win-Ratio (" + ELOstr[
                        elo] +
                    ")");
            }
        }
    }

    //gamesplayeddaily
    divChart = locateLineChartWin('C_GamesPlayedDaily');
    for (var elo = 0; elo < 3; elo++) {
        for (var arranged = 0; arranged <= 1; arranged++) {
            for (var gameMode = 1; gameMode <= 4; gameMode++) {
                if (arranged == 1 && gameMode == 1) {
                    continue;
                }
                id = 'gamesPlayedDaily' + 'M' + gameMode + 'E' + ELOdb[elo] + 'A' + arranged;
                initializeLineChartWin(pureData[id], id, divChart, gameMode + ' vs ' + gameMode + "- Games Played (" +
                    ELOstr[elo] +
                    ")");
            }
        }
    }

    //gamesplayedweekly
    divChart = locateBarChartGamesPlayed('C_GamesPlayed');
    for (var elo = 0; elo < 3; elo++) {
        for (var arranged = 0; arranged <= 1; arranged++) {
            for (var gameMode = 1; gameMode <= 4; gameMode++) {
                if (arranged == 1 && gameMode == 1) {
                    continue;
                }
                id = 'gamesPlayedWeek' + 'M' + gameMode + 'E' + ELOdb[elo] + 'A' + arranged;
                initializeBarChartGamesPlayed(pureData[id], id, divChart, gameMode + ' vs ' + gameMode +
                    "- Games Played This Week (" + ELOstr[elo] + ")");
            }
        }
    }

    //winratioweekly
    divChart = locateBarChartWinRatio('C_WinRatioWeek');
    for (var elo = 0; elo < 3; elo++) {
        for (var arranged = 0; arranged <= 1; arranged++) {
            for (var gameMode = 1; gameMode <= 4; gameMode++) {
                if (arranged == 1 && gameMode == 1) {
                    continue;
                }
                id = 'winRatioWeek' + 'M' + gameMode + 'E' + ELOdb[elo] + 'A' + arranged;
                initializeBarChartWinRatio(pureData[id], id, divChart, gameMode + ' vs ' + gameMode +
                    "- Win-Ratio This Week (" +
                    ELOstr[elo] + ")");
            }
        }
    }

    //general

    //GamesPlayedAllFaction
    divChart = locateBarChartGamesPlayed('C_GamesPlayedAllFaction');
    for (var elo = 0; elo < 3; elo++) {
        for (var arranged = 0; arranged <= 1; arranged++) {
            id = 'gamesPlayedWeeklyFaction' + 'E' + ELOdb[elo] + 'A' + arranged;
            initializeBarChartGamesPlayedAll(pureData[id], id, divChart, "General - Games Played This Week (" + ELOstr[
                    elo] +
                ")");
        }
    }

    //GamesPlayedAllMode
    divChart = locateBarChartGamesPlayed('C_GamesPlayedAllMode');
    for (var elo = 0; elo < 3; elo++) {
        for (var arranged = 0; arranged <= 1; arranged++) {
            id = 'gamesPlayedWeeklyMode' + 'E' + ELOdb[elo] + 'A' + arranged;
            initializeBarChartGamesPlayedAll(pureData[id], id, divChart, "General - Games Played This Week (" + ELOstr[
                    elo] +
                ")");
        }
    }

    //GamesPlayedAllFactionPie
    divChart = locatePieChartGamesPlayed('C_GamesPlayedPieAllFaction');
    for (var elo = 0; elo < 3; elo++) {
        for (var arranged = 0; arranged <= 1; arranged++) {
            id = 'gamesPlayedWeeklyPieFaction' + 'E' + ELOdb[elo] + 'A' + arranged;
            initializePieChartGamesPlayedAll(pureData[id], id, divChart, "General - Games Played This Week (" + ELOstr[
                    elo] +
                ")");
        }
    }

    //GamesPlayedAllModePie
    divChart = locatePieChartGamesPlayed('C_GamesPlayedPieAllMode');
    for (var elo = 0; elo < 3; elo++) {
        for (var arranged = 0; arranged <= 1; arranged++) {
            id = 'gamesPlayedWeeklyPieMode' + 'E' + ELOdb[elo] + 'A' + arranged;
            initializePieChartGamesPlayedAll(pureData[id], id, divChart, "General - Games Played This Week (" + ELOstr[
                    elo] +
                ")");
        }
    }

    //GamesPlayedAllModeWeekly
    divChart = locateLineChartWin('C_GamesPlayedDailyAll');
    for (var elo = 0; elo < 3; elo++) {
        for (var arranged = 0; arranged <= 1; arranged++) {
            id = 'gamesPlayedDailyAll' + 'E' + ELOdb[elo] + 'A' + arranged;
            initializeLineChartWin(pureData[id], id, divChart, "General - Games Played (" + ELOstr[elo] + ")");
        }
    }
}
