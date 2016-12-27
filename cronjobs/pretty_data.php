<?php
include 'loginMySQL.php';

echo 'Connected successfully';
echo '<br><br>';


///
// Poistaa duplicated ja korjata tilastovirheet
///

$currentWeek = 0;
$currentYear = 0;
$lastWeek    = 0;
$lastYear    = 0;

//elot

$ELOdb = [];
$ELOdb[0] = 1; //1-250
$ELOdb[1] = 251; //251-500
$ELOdb[2] = 501; //500+

$FACTIONCOUNT = 5;

//alotuspaiva
$sql    = "SELECT ID, Year, Week FROM updateDate WHERE ID=2;";
$result = $conn->query($sql);

if ($row = $result->fetch_assoc()) {
    $currentWeek = (int) $row["Week"];
    $currentYear = (int) $row["Year"];
    
    //jos alotuspaivaa ei loydy, aloitetaan alusta
} else {
    $currentWeek = 2;
    $currentYear = 2014;
}


//lopetuspaiva, viimesta paivaa ei kayda lapi
$sql      = "SELECT ID, Year, Week FROM updateDate WHERE ID=1;";
$result   = $conn->query($sql);
$row      = $result->fetch_assoc();
$lastWeek = (int) $row["Week"];
$lastYear = (int) $row["Year"];

$i = 0;

while ($currentWeek != $lastWeek || $currentYear != $lastYear) {
    
	//kaydaan kaikki lapi
	//TODO: paranna lapikayntia, turhan hankala ja sekava
    for ($gameMode = 1; $gameMode <= 4; $gameMode++) {
        for ($arranged = 0; $arranged <= 1; $arranged++) {
            if ($gameMode == 1 && $arranged == 1) {
                continue;
            }
            
            for ($elo = 0; $elo <= 2; $elo++) {
                $tmpAmount = ($arranged == 0 ? $FACTIONCOUNT : 2);
                for ($factionI = 0; $factionI < $tmpAmount; $factionI++) {
                    
                    $fac    = ($arranged == 0 ? IdToFac($factionI) : IdToSide($factionI));
                    $wins   = 0;
                    $losses = 0;
                    
                    $sql    = "SELECT Wins, Losses FROM statsOrginal WHERE 
                            Year=" . $currentYear . " AND Week=" . $currentWeek . " AND Team=" . $gameMode . " AND ELO=" . $ELOdb[$elo] . " AND Arranged=" . $arranged . " AND Faction='" . $fac . "';";
                    $result = $conn->query($sql);
                    if (!$result) {
                        printf("Errormessage: %s\n", $conn->error);
                    }
                    $row = $result->fetch_assoc();
                    
                    $wins   = (int) $row["Wins"];
                    $losses = (int) $row["Losses"];
                    
                    //viikko on jakautunut kahtia
                    if ($row = $result->fetch_assoc()) {
                        
                        echo "Year: " . $currentYear . "  Week: " . $currentWeek . " <br>";
                        
                        //paivat lasketaan yhteen
                        $wins += (int) $row["Wins"];
                        $losses += (int) $row["Losses"];
                        
						//counterit overlappaat, kun elo pienempi kuin 500
						//overlap poisto
                        if ($elo != 2) {
                            $wins   = (int) (floor((float) ($wins) * 52.0 / 70.0));
                            $losses = (int) (floor((float) ($losses) * 52.0 / 70.0));
                        }
                    }
                    
                    $sql = "INSERT IGNORE INTO stats SET 
                            Year=" . $currentYear . ", Week= " . $currentWeek . ", Arranged=" . $arranged . ", Faction='" . $fac . "', 
                            Team=" . $gameMode . ", Elo=" . $ELOdb[$elo] . ", Wins=" . $wins . ", Losses=" . $losses . ";";
                    
                    $i++;
                    if (mysqli_query($conn, $sql)) {
                        echo "Done " . $i . "<br>";
                    } else {
                        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
                        die("sql error");
                    }
                    
                }
            }
        }
    }
    
    $currentWeek++;
    if ($currentWeek > 52) {
        $currentWeek = 1;
        $currentYear++;
    }
    
}


//merkataan, etta kaikki aikaisemmat on kaunistettu
$sql = "DELETE FROM updateDate WHERE ID=2;";
mysqli_query($conn, $sql);
$sql = "INSERT INTO updateDate SET ID=2, Year=" . $lastYear . ", Week=" . $lastWeek . ";";
mysqli_query($conn, $sql);

mysqli_close($conn);


//palauttaa faction (puolen tassa tilanteessa) nimi lyhteen database varten
function IdToSide($i)
{
    $fac = "";
    switch ($i) {
        case 0: $fac = "axi"; break;
        case 1: $fac = "all"; break;
    }
    return $fac;
}

//palauttaa faction nimi lyhteen database varten
function IdToFac($i)
{
    $fac = "";
    switch ($i) {
        case 0:  $fac = "weh";  break;
        case 1:  $fac = "sov";  break;
        case 2:  $fac = "okw";  break;
        case 3:  $fac = "usf";  break;
        case 4:  $fac = "ukf";  break;
    }
    return $fac;
}

?>