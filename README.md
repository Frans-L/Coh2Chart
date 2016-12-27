# Coh2Chart.com - Real-Time Statistics from Company of Heroes 2

[Coh2chart.com](http://coh2chart.com/) is a website that shows real-time game statistics from the game Company of Heroes 2. Data is download from Company of Heroes 2's servers and processed to be suitable for statistics. 

**Note**: Originally, this project wasn't open source. The code that connects to Company of Heroes 2's server cannot be published. If you want to make your own, try to contact the game company Relic Entertainment and ask permissions to use their API.


![Screenshot](/images/screenshot1.png?raw=true "Screenshot")

## Motivation

My motivation to code the website was to learn some web development. The project has been made while being in upper secondary school. 

An idea was to do a website from scratch. I wanted to learn frontend and backend languages. At the same time, I started to play a popular RTS game called Company of Heroes 2. The game didn't have any statistics about game results: e.g. How many games are played daily? So, I started to make the website and the data crawler using Javascript and PHP. The first version of the website was released early in 2015. The website has been updated and new features added occasionally. New features haven't been added since the end of 2016. In 2016, the website had on average 4 000 unique visitors per month.

Originally, this project wasn't open source. That's why the comments are in my native language Finnish, sorry for that :)

---

## Deployment

Server requirements
 
* PHP 5 / PHP 7 
* MySQL


Files that need to be tweaked before deployment:

*  _./core.js_
    * Combine _menu.js_ and _chart.js_ to _core.js _.  

Files that need to be made before deployment:

* _cronjobs/gather-data.php_
     * Downloads and processes data from Company of Heroes 2 server. It cannot be published. If you want make your own, try to contact the game company Relic Entertainment and ask permissions to use their API.
* _cronjobs/login_mysql_
    * Connects to MySQL server. The connection is saved to the variable called _$conn_ .


## Libraries

* [jQuery](https://jquery.com/) -  JavaScript library
* [transit-js](https://github.com/cognitect/transit-js) - CSS transitions & transformations for jQuery
* [Mobile-Detect](https://github.com/serbanghita/Mobile-Detect) - PHP class for detecting mobile devices
* [Google Charts](https://developers.google.com/chart/) -  Interactive charts for browsers


## Project Structure

* ./
    * **index.js**
        * is the main page, of which content is selected by _menu.js_.
    * **menu.js**
        * handles the menu, changing tabs, animations, updates charts and resizing windows.
    * **chart.js**
        * initializes and loads the data to be shown in Google Charts.
    * **core.js**
        * menu.js and chart.js should be combined and added to this file when deploying.
* ./css/
    * **simple.css**
        * All css
    * **simple_mobile.css**
        * Mobile css version
* ./cronjobs/
    * **gather_data.php**
        * downloads and processes the data from Company of Heroes 2's server.
    * **add_to_database.php**
        * moves the data from gather_data.php to the MySQL database.
    * **pretty_data.php**
        * fixes duplicates, wrong dates etc. from database.
    * **login_mysql.php**
        * connects to MySQL database.


---

## Authors

* **Frans L** - [Frans-L](https://github.com/Frans-L)


## License

This project is licensed under the Apache Software License 2.0.
