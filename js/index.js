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
	console.info("deviceready");
	db = openDatabase('sample', '', 'Sample Db', 1024*1024);
	if(db.version == ''){
		console.info('First time running... create tables');
		//means first time creation of DB
		//increment the version and create the tables
		db.changeVersion('', '1.0',
			function(trans){
				//something to do in addition to incrementing the value
				//otherwise your new version will be an empty DB
				console.info("DB version incremented");
				//do the inition setup
				trans.executeSql('CREATE TABLE stuff(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)', [],
					function(tx, rs){
						//do something if it works
						console.info("Table stuff created");
					},
					function(tx, err){
						//failed to run query
						console.info( err.message);
					});
				trans.executeSql('INSERT INTO stuff(name) VALUES(?)', ["Cheese"],
					function(tx, rs){
						//do something if works, as desired
						console.info("Added row in stuff");
					},
					function(tx, err){
						//failed to run query
						console.info( err.message);
					});
			},
			function(err){
				//error in changing version
				//if the increment fails
				console.info( err.message);
			},
			function(){
				//successfully completed the transaction of incrementing the version number
			});
		addNavHandlers();
	}else{
		//version should be 1.0
		//this won't be the first time running the app
		console.info('Version: ', db.version);
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








