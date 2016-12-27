<!DOCTYPE html>
<html>

<head>
	
	<title>Coh2Chart.com - Real-Time Statistics</title>
	<meta charset="UTF-8">
	<meta content="Coh2Chart gathers and shows statistics of the game Company of Heroes 2.
		There are charts and graphs about win-ratios, faction popularity, games played etc."
	name="description">

	<!-- google Charts -->
	<script src="https://www.google.com/jsapi" type="text/javascript"></script>
	<script type="text/javascript">
	             google.load('visualization', '1.0', {'packages':['corechart','controls']});
	</script>

	<link href="http://fonts.googleapis.com/css?family=Open Sans" rel="stylesheet" type="text/css">
	<link href="http://fonts.googleapis.com/css?family=Droid Sans" rel="stylesheet" type="text/css">
	<link href="https://fonts.googleapis.com/css?family=Roboto+Condensed" rel="stylesheet" type="text/css">
	
	<?php
		require_once 'library/mobile_detect.php';
		$detect = new Mobile_Detect;
		if ($detect->isMobile()){ 
	?>
		<link href="css/simple.css" rel="stylesheet">
		<link href="css/simple_mobile.css" rel="stylesheet">
	<?php } else { ?>
		<link href="css/simple.css" rel="stylesheet">
	<?php } ?>


</head>


<body>

	<div class="everything">
		
		<!-- Lataa... -->
		<div class="top">
			<div id="loadingOverlay">
				<div class="overlay">
				</div>
				<div class="loadingAnnotation">
					Loading charts...
				</div>
			</div>
		</div>

		<!-- Css kikkailua -->
		<div class="ghostHeader">
		</div>

		<!-- Menu -->
		<div class="header fixed">
			<ul class="center" id="menutabs">
				<li id="General">General</li>
				<li id="C_1v1">1 vs 1</li>
				<li id="C_2v2">2 vs 2</li>
				<li id="C_3v3">3 vs 3</li>
				<li id="C_4v4">4 vs 4</li>
				<li id="Donate">| Donate</li>
			</ul>
		</div>

		<!-- Sisalto -->
		<div class="mainContent" id="mainContent">
			
			<!--
				"contextbox" on laatikko, joita core.js siirtelee oikeille tabeille.
				Kaikki aluksi nakvyilla, mutta core.js piilottaa ne valittomasti sivun
				latauduttua.
			-->

			<div class="tabContent">


				<!-- Otsikko -->
				<div class="contentbox visible" id="block_Introduction">
					<h1><b>Real-Time Statistics from Company of Heroes 2</b>
					</h1>
					<p>Coh2Chart gathers and shows statistics of the game <a href="http://www.companyofheroes.com/" target="_blank">Company of
					Heroes 2</a>. The charts and the graphs can be used to understand better the balance of the game. You can see for
					instance see win-ratios, faction popularity etc. The data is gathered from Relic Entertainment's servers. You can
					view the statistics of the players whose rank are 1 - 250, 251 - 500 or greater than 500. If you have something to
					ask, visit in the forums of <a href="http://www.coh2.org/" target="_blank">coh2.org</a>.<br>
					<br></p>
				</div>

				<!-- Ilmoitukset -->
				<div class="contentbox visible" id="block_Ad">
					<p><br>
					<b>Note</b> (1.6.2017):<br>
					<br>
					Unfortunately, Relic hasn't been able to update their database since 16.5.2017. The charts aren't up to date
					anymore. Previously, this site used to crawl Relic's leaderboards and gather the data, but it didn't produce
					enough reliable data. A solution was to cooperate with Relic, so this site connected to their server and used
					their accurate database. The downside was that this site became dependent on them.<br>
					<br>
					If they are not able to fix their database, I may someday change back to use the crawling method. But at the
					moment, I have no time to update the site... But I have to say: Thank you to all of 3 500 active visitors and
					especially the donators who have made possible to keep servers running over two years now!<br>
					<br>
					Regards,<br>
					<i>Frans L</i><br>
					<br></p>
				</div>

				<!-- Asetuspalkki -->
				<div class="contentbox visible" id="block_Settings">
					<div class="settingsForm">
						<div class="radioLine left">
							<div class="wrapper">
								<p>Ranking:</p>
								<input checked="checked" id="rankingChoice1" name="Ranking" type="radio" value="1"> <label for=
								"rankingChoice1">1-250</label> <input id="rankingChoice2" name="Ranking" type="radio" value="251"> <label for=
								"rankingChoice2">251-500</label> <input id="rankingChoice3" name="Ranking" type="radio" value="501">
								<label for="rankingChoice3">500+</label>
							</div>
						</div>

						<div class="radioLine right">
							<div class="wrapper">
								<input checked="checked" id="arrangedTeamsChoice1" name="ArrangedTeams" type="radio" value="0"> <label for=
								"arrangedTeamsChoice1">Random teams</label> <input id="arrangedTeamsChoice2" name="ArrangedTeams" type="radio"
								value="1"> <label for="arrangedTeamsChoice2">Arranged teams</label>
							</div>
						</div>
					</div>
				</div>

				<!-- kaikki pelit viivadiagrammi -->		
				<div class="contentbox visible" id="block_GamesPlayedAll">
					<div class="justChart" id="C_GamesPlayedDailyAll">
						<div class="chartDrawArea" id="C_GamesPlayedDailyAll_main">
							<p>Loading...<br> <br> Javascript is required!</p>
						</div>
						<div class="chartDrawArea lineSlider" id="C_GamesPlayedDailyAll_slider">
						</div>
					</div>
				</div>

				<!-- kaikki pelit yhdistelma factioneittain -->	
				<div class="contentbox invisible" id="block_GamesPlayedAllFaction">
					<div class="contentboxhalfL">
						<div class="chartDrawArea Half" id="C_GamesPlayedAllFaction">
							<p>Loading...</p>
						</div>
					</div>
					<div class="contentboxhalfR">
						<div class="chartDrawArea Half" id="C_GamesPlayedPieAllFaction">
							<p>Loading...</p>
						</div>
					</div>
				</div>

				<!-- kaikki pelit yhdistelma pelimuodoittain -->	
				<div class="contentbox invisible" id="block_GamesPlayedAllMode">
					<div class="contentboxhalfL">
						<div class="chartDrawArea Half" id="C_GamesPlayedPieAllMode">
							<p>Loading...</p>
						</div>
					</div>
					<div class="contentboxhalfR">
						<div class="chartDrawArea Half" id="C_GamesPlayedAllMode">
							<p>Loading...</p>
						</div>
					</div>
				</div>

				<!-- winratios ja pelatut pelit yhdistelma-->
				<div class="contentbox invisible" id="block_WeeklyData">
					<div class="contentboxhalfL">
						<div class="chartDrawArea Half" id="C_GamesPlayed">
							<p>Loading...</p>
						</div>
					</div>
					<div class="contentboxhalfR">
						<div class="chartDrawArea Half" id="C_WinRatioWeek">
							<p>Loading...</p>
						</div>
					</div>
				</div>

				<!-- viikottainen winratio viivadiagrammi -->
				<div class="contentbox visible" id="block_WinRatioDaily">
					<div class="justChart" id="C_WinRatio">
						<div class="chartDrawArea" id="C_WinRatio_main">
							<p>Loading...</p>
						</div>
						<div class="chartDrawArea lineSlider" id="C_WinRatio_slider">
						</div>
					</div>
				</div>

				<!-- viikottainen pelit viivadiagrammi -->
				<div class="contentbox visible" id="block_GamesPlayedDaily">
					<div class="justChart" id="C_GamesPlayedDaily">
						<div class="chartDrawArea" id="C_GamesPlayedDaily_main">
							<p>Loading...</p>
						</div>
						<div class="chartDrawArea lineSlider" id="C_GamesPlayedDaily_slider">
						</div>
					</div>
				</div>

				<!-- donate -->
				<div class="contentbox invisible donate" id="block_Donation">
					<div class="contentboxhalfL">
						<p><b>Donate, why?</b><br>
						<br>
						The domain and the server aren't free. If you want to support with the upkeep cost of the server, please feel
						free to click the donate button. I really appreciate it :)<br>
						<br>
						Regards<br>
						Frans L<br>
						<br>
						Huge thanks to current donators! :)<br>
						<br></p>
					</div>

					<div class="contentboxhalfR">
						<div id="donateButton">
							<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
								<input name="cmd" type="hidden" value="_s-xclick"> <input name="hosted_button_id" type="hidden" value=
								"Z373BKDARVWXN"> <input alt="PayPal - The safer, easier way to pay online!" name="submit" src=
								"https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" type="image"> <img alt="" border="0" height="1"
								src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1">
							</form>
						</div>
					</div>

					<div class="contentboxhalfR topMargin">
						<p><b>Donations - Year 2016</b><br><br>
						Offensive75 5&euro;<br><br>
						Alex 25&euro;<br>
						DestD 10&euro;<br><br>
						<b>Donations - Year 2015</b><br><br>
						Drange 20&euro;<br>
						Gunther T 5&euro;<br><br>
						wuFF 5&euro;<br>
						Peter 10&euro;<br>
						Adrien 2&euro;<br><br>
						Sybarite 5&euro;<br>
						SturmTigerGaddafi 20&euro;<br>
						I984 5&euro;<br>
						Rypob 1&euro;<br></p>
					</div>

					<div class="contentboxhalfL topMargin">
						<p><b>Other COH2 Projects</b><br>
						<br>
						<iframe allowfullscreen frameborder="0" height="200" src="https://www.youtube.com/embed/vOWOitmG9h8" width=
						"355"></iframe><br>
						<br>
						<a href="https://steamcommunity.com/sharedfiles/filedetails/?id=356017805" target="_blank">Steam Workshop</a>
						</p>
					</div>

				</div>

			</div>
		</div>


		<div class="footer">
			<div class="footerbox">
				Copyright (C) 2015 by Frans L<br>
				Data is gathered from Relic and COH2.org's ladders.<br>
				<br>
			</div>
		</div>

	</div>

	<!-- Kirjastot -->
	<script src="http://code.jquery.com/jquery-1.11.1.min.js">
	</script> 
	<script src="library/transit.js" type="text/javascript">
	</script>

	<!-- Omat js tiedostot  -->
	<script src="constants.js" type="text/javascript">
	</script> 
	<script src="data/load_data.js" type="text/javascript">
	</script> 
	<script src="core.js" type="text/javascript">
	</script>
	
</body>
</html>