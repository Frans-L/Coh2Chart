
// Hoitaa tabien vaihtamisen, taulukoiden paivittamisen ja animaatiot
// Tiedostot: Menu.js, Chart.js yhdistetaan Core.js tiedostoon 

var tabLi = []; //sisaltaa viitaukset menun nappuloihin
var contentDivs = []; //sisaltaa viitaukset tabien kontentiin
var pageBlock = []; //sisaltaa kukin sivun contentboxiy

var chartAnimationReady = true; //onko animaatiot loppuneet
var tabDrawPart; //kertoo mika vaihe meneillaan
const DRAW_Normal = 0;
const DRAW_FirstTime = 1;
const DRAW_TabChange = 2;

var currentPage; //nykyinen tabi
var currentPageType = ""; //onko general tab, chart tab vai donate tab
const TYPE_General = "G"
const TYPE_Chart = "C"
const TYPE_Donate = "D"
var currentRadioRanking; //nykyinen asetus ranking filteroinnista
var currentRadioArranged;

var resizeEvent = false; //sivun resize kaynnissa
var isLoading = false; //ladataanko sivua
var animationFinishListener; //kertoo milloin animaatio loppuu


var ELOdb = []; //ranking elo kategorittain
ELOdb[0] = 1;
ELOdb[1] = 251;
ELOdb[2] = 501;

var ELOstr = []; //ranking elo kategorittain selitykseksi
ELOstr[0] = "1-250";
ELOstr[1] = "251-500";
ELOstr[2] = "500+";



/** Alustaa valikon ja tabin toiminnot.
 * Kutsutaan kun sivusto latautunut taysin */
function menuInitialize() {

    //maaritetaan mista palikoista sivu koostuu
    pageBlock["General"] = [];
    pageBlock["General"][0] = $("#block_Introduction");
    pageBlock["General"][1] = $("#block_Ad");
    pageBlock["General"][2] = $("#block_Settings");
    pageBlock["General"][3] = $("#block_GamesPlayedAll");
    pageBlock["General"][4] = $("#block_GamesPlayedAllFaction");
    pageBlock["General"][5] = $("#block_GamesPlayedAllMode");

    pageBlock["Chart"] = [];
    pageBlock["Chart"][0] = $("#block_Settings");
    pageBlock["Chart"][1] = $("#block_WeeklyData");
    pageBlock["Chart"][2] = $("#block_WinRatioDaily");
    pageBlock["Chart"][3] = $("#block_GamesPlayedDaily");

    pageBlock["Donate"] = [];
    pageBlock["Donate"][0] = $("#block_Donation");


    //haetaan ylavalikon tiedot
    var tabListItems = document.getElementById('menutabs').childNodes; //etsitaan menu
    for (var i = 0; i < tabListItems.length; i++) {
        if (tabListItems[i].nodeName == "LI") { //li elementit lapi
            var id = tabListItems[i].getAttribute('id'); //id talteen
            tabLi[id] = tabListItems[i]; //valikko talteen				
        }
    }

    //kolme paasaraketta
    contentDivs["Donate"] = document.getElementById('T_Donate');
    contentDivs["Chart"] = document.getElementById('T_Chart');
    contentDivs["General"] = document.getElementById('T_General');

    //vakioidaan leveys
    var tmpWidth = Math.min(Math.max(document.documentElement.clientWidth, 750), 910);
    VAKIO_Width = tmpWidth;
    VAKIO_WidthHalf = VAKIO_Width * 0.48;
    $(".contentbox").css({
        'width': VAKIO_Width,
        'min-width': 0,
        ' max-width': 0
    });

    //showTabia varten
    tabDrawPart = DRAW_FirstTime;

    //lisataan komennot menun nappaimille
    var i = 0;
    for (var id in tabLi) {

        //lisataan komenti
        $(tabLi[id]).click(function(event) {
            var identifier = event.target.id + "";
            showTab(identifier);
        });

        //ensimmainen aktiiviseksi
        if (i === 0) {
            tabLi[id].className = 'active';
            showTab(tabLi[id].getAttribute('id') + ""); //naytetaan sen tiedot
            tabLi[id].setAttribute("unselectable", "on"); //ei voi klikata (IE < 10)					
        }

        i++;
    }

    //asetetaan oikeat asetukset
    currentRadioRanking = $("input[name=Ranking]:radio:checked").val();
    currentRadioArranged = $("input[name=ArrangedTeams]:radio:checked").val();

    //lisataan toiminnot asetusten radiobuttoneille
    $("input[name=Ranking]:radio, input[name=ArrangedTeams]:radio").change(function(event) {
        showTab(currentPage);
    });

    /* //kosketusnaytto
    var mainContent = $("#mainContent")[0];
    mainContent.get("pinch").set({enable: false});
    Hammer(mainContent).on("swiperight",function(){
        changePage(-1);
    });                       
    Hammer(mainContent).on("swipeleft",function(){
        changePage(1);
    }); 
    */

}



//nayttaa sivun
function showPage(page) {
    showTab(pageNumberToID(page), false, true);
}

//paivittaa tabin, esim. resizen jalkeen
function refreshCurrentTab() {
    chartAnimationReady = true;
    showTab(currentPage, true);
}

//nayttaa sivun kaikki blockit
function showBlocks(id) {
    for (var i = 0; i < pageBlock[id].length; i++) {
        pageBlock[id][i].show();
    }
}

//piilottaa sivun kaikki blockit
function hideBlocks(id) {
    for (var i = 0; i < pageBlock[id].length; i++) {
        pageBlock[id][i].hide();
    }
}



/** * Vaihtaa nykyisen sivun uuteen tabiin
 * 1. korostaa menun
 * 2. kutsuu doTabChange, joka hoitaa animaatiot
 * 3. doTabChange kutsuu setTab... joka asettaa tabin sisallon
*/
function showTab(selectedID, _refresh, _animationOn ) {

    //parametrit muuttujiksi
    var refresh = (typeof  _refresh === 'undefined') ? false : _refresh;
    var animation = (typeof  _animationOn === 'undefined') ? true : _animationOn;

    // korosta menun valintaa
    if (chartAnimationReady === true) {
        for (var id in tabLi) {
            if (id == selectedID) {
                tabLi[id].className = 'active';
            } else {
                tabLi[id].className = '';
            }
        }
    }

    //Vaihda sisalto
    doTabChange(selectedID, refresh, animation);

}



/** Hoitaa tabin vaihdoin animaatiot 
 *ja kutsuu kontentin vaihtoa funktioita */ 
function doTabChange(selectedID, refresh, animation){		

    //loading overlay paalle			
    $(".top").show();
    $("#loadingOverlay").transition({opacity: '1'}, 100, 'easeOutQuad', function() {

        
        //ei animaatiota, jos tullaan kokonaan uudelta sivulta/tabilta
        var pageType = selectedID.substr(0, 1); //otetaan nykyisen tabin alkuosa talteen
        if (currentPageType !== pageType || !animation) {
            ChartAnimation(0);

            //haihdutetaan tausta
            if (tabDrawPart === DRAW_Normal) {
                tabDrawPart = DRAW_TabChange;
                $("#mainContent").css({
                    opacity: '0.5'
                })
            }
            //ChartAnimation(VAKIO_ChartAnimationTime/1.35);
        } else {
            //tabDrawPart = DRAW_FirstTime;
            ChartAnimation(VAKIO_ChartAnimationTime);
        }

        
        if (pageType === TYPE_Chart) {
            setChartTab(selectedID, refresh);
        } else if (pageType === TYPE_General) {
            setGeneralTab(selectedID, refresh);
        } else if (pageType === TYPE_Donate) {
            setDonateTab(selectedID, refresh);
        }

        currentPageType = pageType; //sivu valituksi
        currentPage = selectedID; 

        //jos diagrammianimaatioita ei pyoriteta, merkataan animaatiot jo valmiiksi
        if (tabDrawPart === DRAW_Normal) {
            chartAnimationReady = false;
        
        } else {
            if (tabDrawPart === DRAW_TabChange) {
                google.visualization.events.removeListener(animationFinishListener);
                $("#loadingOverlay").transition({ opacity: '0', delay: '400' }, 500, function() {
                    $(".top").hide();
                    isLoading = false;
                });
                $("#mainContent").transition({ opacity: '1' }, 400, 'easeOutQuad')
            } else {
                google.visualization.events.removeListener(animationFinishListener);
                $("#loadingOverlay").transition({ opacity: '0', delay: '500' }, 500, function() {
                    $(".top").hide();
                    isLoading = false;
                });
            }
            tabDrawPart = DRAW_Normal;
        }

        //animaatio takaisin
        //$("#T_Chart").transition({opacity:'1'},400);
    });
}



/**  Asettaa sisallon chart tabeihin kuten 1v1 */
function setChartTab(selectedID, refresh) {

    hideBlocks("Donate");
    hideBlocks("General");
    showBlocks("Chart");

    //haetaan asetukset
    var selectedRadioRanking = $("input[name=Ranking]:radio:checked").val();
    var selectedRadioArranged = $("input[name=ArrangedTeams]:radio:checked").val();

    //samaa sivua ei paiviteta uudelleen
    if (currentPage !== selectedID || refresh === true ||
        currentRadioRanking !== selectedRadioRanking ||
        currentRadioArranged !== selectedRadioArranged) {

        var tmpID;
        currentRadioRanking = selectedRadioRanking;
        currentRadioArranged = selectedRadioArranged;

        var tmpGameMode = selectedID.substr(2, 1);
        var tmpELO = currentRadioRanking;
        var tmpArranged = (tmpGameMode == 1 ? 0 : currentRadioArranged);

        //paivitetaan taulukot
        tmpID = 'winRatioWeek' + 'M' + tmpGameMode + 'E' + tmpELO + 'A' + tmpArranged;
        chartChart[tmpID].draw(chartData[tmpID], chartOptions[tmpID]);
        tmpID = 'gamesPlayedWeek' + 'M' + tmpGameMode + 'E' + tmpELO + 'A' + tmpArranged;
        chartChart[tmpID].draw(chartData[tmpID], chartOptions[tmpID]);
        tmpID = 'winRatioDaily' + 'M' + tmpGameMode + 'E' + tmpELO + 'A' + tmpArranged;
        chartChart[tmpID].draw(chartData[tmpID]);
        chartChart[tmpID + "_main"].setOption('title', chartTitle[tmpID]);
        tmpID = 'gamesPlayedDaily' + 'M' + tmpGameMode + 'E' + tmpELO + 'A' + tmpArranged;
        chartChart[tmpID].draw(chartData[tmpID]);
        chartChart[tmpID + "_main"].setOption('title', chartTitle[tmpID]);

        //arranged team radio button pois kaytosta, jos 1v1
        if (tmpGameMode == 1) {
            $("input[name=ArrangedTeams]:radio").attr('disabled', true);
        } else {
            $("input[name=ArrangedTeams]:radio").attr('disabled', false);
        }

        //estetaan animaation keskeytys
        google.visualization.events.removeListener(animationFinishListener);
        tmpID = 'winRatioWeek' + 'M' + tmpGameMode + 'E' + tmpELO + 'A' + tmpArranged;
        animationFinishListener = google.visualization.events.addOneTimeListener(chartChart[tmpID],
            'animationfinish',
            function() {
                chartAnimationReady = true;

                var tmpGameMode = selectedID.substr(2, 1);
                var tmpELO = currentRadioRanking;
                var tmpArranged = (tmpGameMode == 1 ? 0 : currentRadioArranged);

                tmpID = 'gamesPlayedDaily' + 'M' + tmpGameMode + 'E' + tmpELO + 'A' + tmpArranged;
                chartChart[tmpID + "_main"].setOption('animation.duration', 0); //timeline muutosto varten nollataan
                tmpID = 'winRatioDaily' + 'M' + tmpGameMode + 'E' + tmpELO + 'A' + tmpArranged;
                chartChart[tmpID + "_main"].setOption('animation.duration', 0);

                //loadingOverlay fadetaan pois	
                $("#loadingOverlay").transition({ opacity: '0', delay: 100}, 200, 'easeOutQuad', function() {
                    $(".top").hide();
                    isLoading = false;
                    resizeEvent = false;
                });
            }
        );

    } else {
        chartAnimationReady = true;
        tabDrawPart = DRAW_TabChange;
    }

}



/**  Asettaa sisällön general tabiin */
function setGeneralTab(selectedID, refresh) {
    hideBlocks("Donate");
    hideBlocks("Chart");
    showBlocks("General");

    //haetaan asetukset
    var selectedRadioRanking = $("input[name=Ranking]:radio:checked").val();
    var selectedRadioArranged = $("input[name=ArrangedTeams]:radio:checked").val();

    //samaa sivua ei paiviteta uudelleen
    if (currentPage !== selectedID || refresh === true ||
        currentRadioRanking !== selectedRadioRanking ||
        currentRadioArranged !== selectedRadioArranged) {

        currentRadioRanking = selectedRadioRanking;
        currentRadioArranged = selectedRadioArranged;

        var tmpID;
        var tmpELO = currentRadioRanking;
        var tmpArranged = currentRadioArranged;

        //paivitetaan taulukot
        tmpID = 'gamesPlayedWeeklyFaction' + 'E' + tmpELO + 'A' + tmpArranged;
        chartChart[tmpID].draw(chartData[tmpID], chartOptions[tmpID]);
        tmpID = 'gamesPlayedWeeklyMode' + 'E' + tmpELO + 'A' + tmpArranged;
        chartChart[tmpID].draw(chartData[tmpID], chartOptions[tmpID]);
        tmpID = 'gamesPlayedWeeklyPieFaction' + 'E' + tmpELO + 'A' + tmpArranged;
        chartChart[tmpID].draw(chartData[tmpID], chartOptions[tmpID]);
        tmpID = 'gamesPlayedWeeklyPieMode' + 'E' + tmpELO + 'A' + tmpArranged;
        chartChart[tmpID].draw(chartData[tmpID], chartOptions[tmpID]);
        tmpID = 'gamesPlayedDailyAll' + 'E' + tmpELO + 'A' + tmpArranged;
        chartChart[tmpID].draw(chartData[tmpID]);
        chartChart[tmpID + "_main"].setOption('title', chartTitle[tmpID]);

        //radiobuttonit kayttoon kaiken varalta
        $("input[name=ArrangedTeams]:radio").attr('disabled', false);

        //estetaan animaation keskeytys
        google.visualization.events.removeListener(animationFinishListener);
        tmpID = 'gamesPlayedWeeklyMode' + 'E' + tmpELO + 'A' + tmpArranged;
        animationFinishListener = google.visualization.events.addOneTimeListener(chartChart[tmpID],
            'animationfinish',
            function() {
                chartAnimationReady = true;

                var tmpELO = currentRadioRanking;
                var tmpArranged = currentRadioArranged;

                tmpID = 'gamesPlayedDailyAll' + 'E' + tmpELO + 'A' + tmpArranged;
                chartChart[tmpID + "_main"].setOption('animation.duration', 0); //timeline muutosto varten nollataan

                //loadingOverlay fadetaan pois	
                $("#loadingOverlay").transition({ opacity: '0', delay: 100}, 200, 'easeOutQuad', function() {
                    $(".top").hide();
                    isLoading = false;
                    resizeEvent = false;
                });
            }
        );

    } else {
        chartAnimationReady = true;
        tabDrawPart = DRAW_TabChange;
    }
}



/**  Asettaa sisällön donate tabiin */
function setDonateTab(selectedID, refresh) {
    hideBlocks("General");
    hideBlocks("Chart");
    showBlocks("Donate");

    isLoading = false;
    resizeEvent = false;
    chartAnimationReady = true;
    tabDrawPart = DRAW_TabChange;
}



//vaihtaa kaikkien animaatioiden pituudet
function ChartAnimation(time) {

    //normikuvaajat
    for (var id in chartOptions) {
        if (chartOptions[id] != null) {;
            chartOptions[id].animation.duration = time;
        }

    }

    var tmpID;

    //googlen dashboardissa olevat kuvaajat
    for (var elo = 0; elo < 3; elo++) {
        for (var arranged = 0; arranged <= 1; arranged++) {
            for (var gameMode = 1; gameMode <= 4; gameMode++) {
                if (arranged == 1 && gameMode == 1) {
                    continue;
                }
                tmpID = 'winRatioDaily' + 'M' + gameMode + 'E' + ELOdb[elo] + 'A' + arranged;
                chartChart[tmpID + "_main"].setOption('animation.duration', time);
                tmpID = 'gamesPlayedDaily' + 'M' + gameMode + 'E' + ELOdb[elo] + 'A' + arranged;
                chartChart[tmpID + "_main"].setOption('animation.duration', time);
            }
        }
    }

    for (var elo = 0; elo < 3; elo++) {
        for (var arranged = 0; arranged <= 1; arranged++) {
            tmpID = 'gamesPlayedDailyAll' + 'E' + ELOdb[elo] + 'A' + arranged;
            chartChart[tmpID + "_main"].setOption('animation.duration', time);
        }
    }


}


function changePage(direction) {
    var page = getPageNumber();
    if (direction > 0) {
        if (page < 6) { //last page number
            showPage(page + 1);
        }
    } else {
        if (page > 1) { //last page number
            showPage(page - 1);
        }
    }
}

function getPageNumber() {
    var i = 0;
    switch (currentPage) {
        case "General": i = 1; break;
        case "C_1v1": i = 2; break;
        case "C_2v2": i = 3; break;
        case "C_3v3": i = 4; break;
        case "C_4v4": i = 5; break;
        case "Donate": i = 6; break;
    }
    return i;
}

function pageNumberToID(page) {
    var id = "";
    switch (page) {
        case 1: id = "General"; break;
        case 2:	id = "C_1v1"; break;
        case 3: id = "C_2v2"; break;
        case 4: id = "C_3v3"; break;
        case 5: id = "C_4v4"; break;
        case 6: id = "Donate"; break;
    }
    return id;
}





//resize funktionit
$(window).resize(function() {
    
        if (this.resizeTO) clearTimeout(this.resizeTO);
        this.resizeTO = setTimeout(timeoutResize, VAKIO_resizeEventTime);
    
        function timeoutResize() {
            if (resizeEvent === false) {
                $(this).trigger('resizeEnd');
            } else {
                if (this.resizeTO) clearTimeout(this.resizeTO);
                this.resizeTO = setTimeout(timeoutResize, VAKIO_resizeEventTime);
            }
        }
    });
    
    
//TODO: selkeyta rezise funktiota, ota pois random numerot ilman selitysta
$(window).on('resizeEnd', function() {
    var width = Math.min(Math.max(document.documentElement.clientWidth, 750), 910);
    if (width != VAKIO_Width) {
        var tmpDelay;
        if (VAKIO_Width < width) { //pieni delay, jotta ei alota liian nopeasti
            tmpDelay = 100;
        } else {
            tmpDelay = 200;
        }
        VAKIO_Width = width;
        VAKIO_WidthHalf = VAKIO_Width * 0.48;

        resizeEvent = true;
        $(".ghostHeader").css({
            width: VAKIO_Width
        });
        $(".chartDrawArea").css({
            width: VAKIO_Width - 10
        });
        $(".chartDrawArea.Half").css({
            width: VAKIO_WidthHalf - 10
        });
        $(".contentbox").transition({
            width: (VAKIO_Width + 1 - 10),
            delay: tmpDelay
        }, VAKIO_ChartAnimationTime, 'in-out');

        refreshCurrentTab();
    }
});