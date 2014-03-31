// JavaScript Document March31st
/***********************************
        Declarations
***********************************/
var pages = [];         //list of data-role pages
var links = [];         //list of data-role links
var headers = [];
var numHeaders = 0;
var numLinks =0;
var numPages = 0;
var db = null;
var dbVersion = "";
var domain = "clients.edumedia.ca/mmd/info-file/";
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

/**************************************
CHECK TO SEE IF DB IS CREATED
**************************************/
function checkDB(){
	//check to see if the body has a class.
	/*var checkBodyClass = document.getElementById("bodySec");
	if(checkBodyClass.className == ""){
		alert("body class is empty");
		//set body class to main
		checkBodyClass.className = "main";

	}*/

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
				trans.executeSql('CREATE TABLE IF NOT EXISTS tours (tour_id INTEGER UNSIGNED PRIMARY KEY AUTOINCREMENT, tour_name TEXT NOT NULL, tour_description TEXT NOT NULL, tour_image TEXT NOT NULL, active INTEGER NOT NULL)', [],
					function(tx, rs){
						//do something if it works
						alert("Table tour created");
					},
					function(tx, err){
						//failed to run query
						alert("YES tours err " + err.message);
					});
				//	DO I REALLY NEED THIS SINCE THIS IS FOR USERS THAT HAVE 
				//	ACCESS TO ONLINE. THEREFORE THEY WOULD STREAM THE DATA 
				//	AND NOT DOWNLOAD IT TO THERE PHONES? 
				trans.executeSql('CREATE TABLE IF NOT EXISTS tour_media (media_id INTEGER UNSIGNED NOT NULL, file_name TEXT NOT NULL, mime_type TEXT NOT NULL, tour_id INTEGER UNSIGNED NOT NULL, approved INTEGER NOT NULL DEFAULT "1", install_id INTEGER UNSIGNED NOT NULL DEFAULT "1", ip_address TEXT NOT NULL, PRIMARY KEY(media_id))', [],
					function(tx, rs){
						//do something if it works
						alert("Table tour_media created");
					},
					function(tx, err){
						//failed to run query
						alert("YES tour_media err " + err.message);
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
		callToDB();
	}else{
		//version should be 1.0
		//this won't be the first time running the app
		alert('Version: ' + db.version);
		callToDB();
	}
}

function callToDB(){
	alert("ajax should be called");
	$.ajax({
        url: "http://" + domain + "getTourList.php",
        dataType: "jsonp",
        jsonpCallback: "listTours" 
    }).fail(badAjaxCall);
}

function badAjaxCall(){
    alert("AJAX not working");
}

function listTours(data){
	//insert in sqlite


	alert("jsonP has been retrieved.");	
    var len = data.tours.length;
    for(var i=0; i<len; i++){
        var li = document.createElement("li");
        li.setAttribute("class","tourListItem");
        li.setAttribute("data-tour",data.tours[i].tour_id);
        li.setAttribute("data-role", "link");
        li.setAttribute("data-goto", "takingTour");
        li.setAttribute("id","lili");
        var linkAchor = document.createElement("a");
        linkAchor.setAttribute("href", "#s_mapDetailsPage");
        linkAchor.innerHTML="link";
        var img = document.createElement("img");
        img.setAttribute("src", "img/logo.png");
        var tourName = document.createElement("h2");
        tourName.innerHTML = data.destination_name;
        var tourDescription = document.createElement("p");
        tourDescription.innerHTML = data.tours[i].destination_description;
        tourName.innerHTML = data.tours[i].tour_name;
        (data.tours[i].tour_name);

        var ul = document.getElementById('tourListContainer');
        ul.appendChild(li);
        li.appendChild(linkAchor);
        linkAchor.appendChild(img);
        linkAchor.appendChild(tourName);
        linkAchor.appendChild(tourDescription);
    }
    alert("about to call addNavHandlers func");
    document.querySelector("#lili").addEventListener("click", pageClick);
    addNavHandlers();
}

function pageClick(){
	alert("working");
}

/**************************************
ADD EVENT LISTENERS
**************************************/
function addNavHandlers(){
	alert("addNavHandlers was called");
	//add eventlistener for sync
    //document.querySelector("#syncData").addEventListener("click", updateData);

    //add eventlistener to back buttons
    //document.querySelectorAll('[href="backLnk"]').addEventListener("click", goBack);


	//create Event for navigating pages
    pageshow = document.createEvent("Event");
    pageshow.initEvent("pageshow", true, true);

    //create our own tap Event
    tap = document.createEvent("Event");
    tap.initEvent("tap", true, true);

    pages = document.querySelectorAll('[data-role="page"]');
    numPages = pages.length;

    headers = document.querySelectorAll('[data-role="header"]');
    numHeaders = headers.length;


    links = document.querySelectorAll('[data-role="link"]');
    numLinks = links.length;
    //alert("numLinks = " + numLinks);
    
    setUpApp();
}
function setUpApp(){
    if(detectTouchSupport()){
    	links[lnk].addEventListener("touchend", handleTouchEnd); 
    	links[lnk].addEventListener("tap", handleLinkClick);    //our custom event
    }

    //add our pageshow events
    document.querySelector("#s_mainPage").addEventListener("pageshow", pageOneStuff);
    document.querySelector("#s_mapDetailsPage").addEventListener("pageshow", pageTwoStuff);
    document.querySelector("#s_infoDetailsPage").addEventListener("pageshow", pageThreeStuff);
    document.querySelector("#s_mapDestinationPage").addEventListener("pageshow", pageFourStuff);
    document.querySelector("#s_infoDestinationPage").addEventListener("pageshow", pageFiveStuff);
    document.querySelector("#s_mediaDestinationPage").addEventListener("pageshow", pageSixStuff);

    //make the app run the home page scripts
    applyCSS( "s_mainPage" );
    applyHeaderCSS("h_main");
    document.querySelector("#s_mainPage").dispatchEvent(pageshow);
}

function applyHeaderCSS( headerid ){
  	//code to use AJAX to load a url and display it OR just to switch between divs
  	//keep track of the new URL in a global array
  	//add animations to move between divs if you want
  	//use display:block / display: none; if no animations
  	if( headerid == null || headerid == "undefined"){
		//show the home page
		headerid = headers[0].id;
  	}
	//remove active class from all pages except the one called pageid
	for(var pg=0;pg<numHeaders;pg++){
		if(headers[pg].id === headerid){
			//page needs to show
			headers[pg].className = "show";
			//now add the class active to animate.
			setTimeout(showPage, 20, headers[pg]);
		}else{
			//found the page to hide
			//remove the class active to make it animate off the page
			headers[pg].className = "show";
			//animation off the page is set to take 0.6 seconds
			setTimeout(hidePage, 600, headers[pg]);
		}
	}
	
	//update the style of the tabs too
	for(var lnk=0; lnk<numLinks; lnk++){
		links[lnk].className = "";
	}
	var currTab = document.querySelector('[href="#' + pageid + '"]').className = "activetab";
}

function hidePage(pg){
	pg.className = "hide";
	//this class replaces show
}

function showPage(pg){
	pg.classList.add("active");
}

function updateData(){
	//do ajax call? 
}

function goBack(){
	//go back func
}

function handleTouchEnd(ev){
	//pass the touchend event directly to a click event
	ev.preventDefault();
	var target = ev.currentTarget;	
	target.dispatchEvent( tap );
	//this will send a click event from the touched tab to 
}

function handleLinkClick(ev){
	ev.preventDefault( );  //we want to handle clicks on the link
	var href = ev.currentTarget.href;
	var parts = href.split("#");	//could be #home or index.html#home
	applyCSS( parts[1] );			//send the "home" part
	//run the script that does custom page stuff
	var id = "#"+parts[1];
	document.querySelector(id).dispatchEvent( pageshow );
	console.log("pageshow dispatched on ", parts[1] );
}

function pageOneStuff(){
	alert("working");
}
function pageTwoStuff(){
	alert("working");
}
function pageThreeStuff(){
	alert("working");
}
function pageFourStuff(){
	alert("working");
}
function pageFiveStuff(){
	alert("working");
}
function pageSixStuff(){
	alert("working");
}

function applyCSS( pageid ){
  	//code to use AJAX to load a url and display it OR just to switch between divs
  	//keep track of the new URL in a global array
  	//add animations to move between divs if you want
  	//use display:block / display: none; if no animations
  	if( pageid == null || pageid == "undefined"){
		//show the home page
		pageid = pages[0].id;
  	}
	//remove active class from all pages except the one called pageid
	for(var pg=0;pg<numPages;pg++){
		if(pages[pg].id === pageid){
			//page needs to show
			pages[pg].className = "show";
			//now add the class active to animate.
			setTimeout(showPage, 20, pages[pg]);
		}else{
			//found the page to hide
			//remove the class active to make it animate off the page
			pages[pg].className = "show";
			//animation off the page is set to take 0.6 seconds
			setTimeout(hidePage, 600, pages[pg]);
		}
	}
	
	//update the style of the tabs too
	for(var lnk=0; lnk<numLinks; lnk++){
		links[lnk].className = "";
	}
	var currTab = document.querySelector('[href="#' + pageid + '"]').className = "activetab";
}

function detectTouchSupport( ){
  msGesture = navigator && navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0 && MSGesture;
  touchSupport = (("ontouchstart" in window) || msGesture || (window.DocumentTouch && document instanceof DocumentTouch));
  return touchSupport;
}























