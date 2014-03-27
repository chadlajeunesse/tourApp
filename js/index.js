// JavaScript Document
/***********************************
        Declarations
***********************************/
var pages = [];         //list of data-role pages
var links = [];         //list of data-role links
var numLinks =0;
var numPages = 0;
var db = null;
var dbVersion = "";
//events
var pageshow = null;
var tap = null;

/***********************************
        Set up functions
***********************************/
window.addEventListener("DOMContentLoaded", init);

function init(){
    document.addEventListener("deviceready", checkDB);
    //Wait for phonegap  to be ready... IF you are using phonegap
}

function checkDB(){
	//once deviceready app starts
	alert("deviceready");
	db = openDatabase('sample', '', 'Sample Db', 1024*1024);
	alert(db.version);
	if(db.version == ''){
		alert('First time running... create tables');
		//means first time creation of DB
		//increment the version and create the tables
		db.changeVersion('', '1.0',
			function(trans){
				//something to do in addition to incrementing the value
				//otherwise your new version will be an empty DB
				alert("DB version incremented");
				//do the inition setup
				trans.executeSql('CREATE TABLE IF NOT EXISTS destinations (destination_id INTEGER PRIMARY KEY AUTOINCREMENT, tour_id INTEGER UNSIGNED NOT NULL, seq_num INTEGER UNSIGNED NOT NULL, destination_name TEXT NOT NULL, destination_description TEXT NOT NULL, latitude TEXT NOT NULL, longitude TEXT NOT NULL, destination_image TEXT NOT NULL, image_mime TEXT NOT NULL)', [],
					function(tx, rs){
						//do something if it works
						alert("Table destinations created");
					},
					function(tx, err){
						//failed to run query
						alert("YES destinations err " + err.message);
					});
				trans.executeSql('CREATE TABLE IF NOT EXISTS tours (tour_id INTEGER PRIMARY KEY AUTOINCREMENT, tour_name TEXT NOT NULL, tour_description TEXT NOT NULL, tour_image TEXT NOT NULL, active INTEGER NOT NULL)', [],
					function(tx, rs){
						//do something if it works
						alert("Table tour created");
					},
					function(tx, err){
						//failed to run query
						alert("YES tours err " + err.message);
					});
				trans.executeSql('CREATE TABLE IF NOT EXISTS tour_media (media_id INTEGER UNSIGNED NOT NULL, file_name TEXT NOT NULL, mime_type TEXT NOT NULL, tour_id INTEGER UNSIGNED NOT NULL, approved INTEGER NOT NULL DEFAULT "1", install_id INTEGER UNSIGNED NOT NULL DEFAULT "1", ip_address TEXT NOT NULL, PRIMARY KEY(media_id))', [],
					function(tx, rs){
						//do something if it works
						alert("Table tour_media created");
					},
					function(tx, err){
						//failed to run query
						alert("YES tour_media err " + err.message);
					});





				trans.executeSql('INSERT INTO destinations (tour_id) VALUES(?)', ["1"],
					function(tx, rs){
						//do something if works, as desired
						alert("Added row in stuff");
					},
					function(tx, err){
						//failed to run query
						alert( err.message);
					});
			},
			function(err){
				//error in changing version
				//if the increment fails
				alert( err.message);
			},
			function(){
				//successfully completed the transaction of incrementing the version number
			});
		addNavHandlers();
	}else{
		//version should be 1.0
		//this won't be the first time running the app
		alert('Version: ' + db.version);
		addNavHandlers();
	}
}

function buildDB(trans){
	alert("db built");
	trans.executeSql('DROP TABLE IF EXISTS Occasions');
	trans.executeSql('CREATE TABLE IF NOT EXISTS Occasions (id INTEGER PRIMARY KEY, occasion TEXT)' );
	
	trans.executeSql('DROP TABLE IF EXISTS Gifts');
	trans.executeSql('CREATE TABLE IF NOT EXISTS Gifts (id INTEGER PRIMARY KEY, person INTEGER, occasion INTEGER, name TEXT, purchased INTEGER)' );
    
	//trans.executeSql(' SELECT count(*) AS O FROM Occasions', [], areOccasionsInsert);
    //trans.executeSql(' SELECT count(*) AS G FROM Gifts', [], areGiftsInsert);
    
	trans.executeSql('INSERT INTO Occasions(occasion) VALUES("Christmas")');
	trans.executeSql('INSERT INTO Occasions(occasion) VALUES("Birthday")');
	trans.executeSql('INSERT INTO Occasions(occasion) VALUES("Valentines Day")');
	trans.executeSql('INSERT INTO Occasions(occasion) VALUES("Halloween")');
	trans.executeSql('INSERT INTO Occasions(occasion) VALUES("Holiday")');
	
	//these assume that there is at least two contacts in the device
	trans.executeSql('INSERT INTO Gifts(person, occasion, name, purchased) VALUES(1, 1, "Lego", 0)');
	trans.executeSql('INSERT INTO Gifts(person, occasion, name, purchased) VALUES(2, 1, "Crossbow", 0)');
	trans.executeSql('INSERT INTO Gifts(person, occasion, name, purchased) VALUES(3, 1, "Bike", 0)');
	trans.executeSql('INSERT INTO Gifts(person, occasion, name, purchased) VALUES(1, 2, "Skates", 0)');
	trans.executeSql('INSERT INTO Gifts(person, occasion, name, purchased) VALUES(2, 2, "Laptop", 0)');
	trans.executeSql('INSERT INTO Gifts(person, occasion, name, purchased) VALUES(3, 2, "Tablet", 0)');
}

function dbErr(err){
	alert("Data Error");
	console.log(	err.code + " " + err.message );
}








