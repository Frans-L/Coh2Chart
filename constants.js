
const VAKIO_Ostheer = 0;
const VAKIO_OKW = 1;
const VAKIO_Soviet = 2;
const VAKIO_US = 3;
const VAKIO_UKF = 4;
const VAKIO_Neutral = 5;

const VAKIO_Axis = 0;
const VAKIO_Allies = 2;

//ostheer, okw, soviet, us, ukf, neutral
const fColors = ['#FAA43A','#F15854', '#5DA5DA','#60BD68','#DECF3F','#4D4D4D'];
//soviet, us, ukf, ostheer, okw, neutral
const fColorsI = ['#5DA5DA','#60BD68', '#DECF3F','#FAA43A','#F15854','#4D4D4D'];

var VAKIO_Width = 910; //joissain tapauksissa ei ole vakio... kannykka etc.
var VAKIO_WidthHalf = VAKIO_Width*0.48;

const VAKIO_Height = 500;

const VAKIO_ChartAnimationTime = 650; //850
const VAKIO_ChartAnimationStyle = "inAndOut"; //inAndOut //linear //in //out

const VAKIO_resizeEventTime = 150; //ms