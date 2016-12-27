<?php


include 'login_mysql.php';

echo 'Connected successfully';
echo '<br><br>';

$myFile = fopen("datapull.txt", "r");
if (!$myFile) {
    echo "Open file failed!";
    die("open file failed");
}

//infforivi turha
fgets($myFile);

//alusta muuttujat
$year     = 0;
$week     = 0;
$team     = 0;
$faction  = "qqq";
$arranged = 0;
$elo      = 0;
$wins     = 0;
$losses   = 0;

$i = 0;

//talletetaan uusin paivays 
$currentYear = 0;
$currentWeek = 0;
//vanhin paiva vuodelta 2015
$firstYear   = 2015;
$firstWeek   = 99;

//poistetaan uusimmat tiedot, koska ne muuttuvat
$sql    = "SELECT ID, Year, Week FROM updateDate WHERE ID=1;";
$result = $conn->query($sql);
$row    = $result->fetch_assoc();
$sql    = "DELETE FROM statsOrginal WHERE Year=" . $row["Year"] . " AND Week=" . $row["Week"];
$result = $conn->query($sql);


while (($line = fgets($myFile)) !== false) {
    
    $i++;
    
    $pieces = explode("|", $line);
    
    $year  = (int) ($pieces[0]);
    $month = (int) ($pieces[1]);
    $week  = (int) ($pieces[2]);
    
    //viimeinen viikko paattyy seuravaalle vuodelle
    if ($week == 53) {
        $year = $year - 1;
    }
    
    //uusin paiva
    if ($year > $currentYear) {
        $currentYear = $year;
        $currentWeek = $week;
    } else if ($year == $currentYear) {
        $currentWeek = max($week, $currentWeek);
    }
    
    //vanhin paiva
    if ($year == $firstYear) {
        $firstWeek = min($week, $firstWeek);
    }
    
    $team    = (int) substr($pieces[3], 0, 1);
    $faction = strtolower(substr($pieces[4], 0, 3));
    
    if ($pieces[5] == "Arranged") {
        $arranged = 1;
    } else {
        $arranged = 0;
    }
    
    if ($pieces[6] == "500+") {
        $elo = 501;
    } else if ($pieces[6] == "251-500") {
        $elo = 251;
    } else if ($pieces[6] == "0-250") {
        $elo = 1;
    }
    
    $wins   = (int) $pieces[9];
    $losses = (int) $pieces[10];
    
    
    $sql = "INSERT IGNORE INTO statsOrginal SET 
            Year=" . $year . ", Month= " . $month . ", Week= " . $week . ", Arranged=" . $arranged . ", Faction='" . $faction . "', 
            Team=" . $team . ", Elo=" . $elo . ", Wins=" . $wins . ", Losses=" . $losses . ";";
    
    if (mysqli_query($conn, $sql)) {
        echo "Done " . $i . "<br>";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
        die("sql error");
    }
    
}

//talletetaan paiva, joilloin uudet tiedot haettiin
$sql = "DELETE FROM updateDate WHERE ID=1;";
mysqli_query($conn, $sql);
$sql = "INSERT INTO updateDate SET ID=1, Year=" . $currentYear . ", Week=" . $currentWeek . ";";
mysqli_query($conn, $sql);




echo '<br><br>';

fclose($myFile);
mysqli_close($conn);



?>