//parameters

/*
 * Filter trending videos to display videos that are less than a month old (won't work if trending is a start page
 * */
const filterTrending = true;



if (filterTrending) {
	//display only one month old videos in trending
	XMLHttpRequest.prototype.oldOpen = XMLHttpRequest.prototype.open;
	XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
		if (url.indexOf("/api/v1/videos/") >= 0 && url.indexOf("sort=-views") >= 0) {
			console.log(url);
			var urlP = new URL("http://example.bla" + url);
			var start = urlP.searchParams.get("start");
			var count = urlP.searchParams.get("count");
			var category = urlP.searchParams.get("categoryOneOf");
			var d = new Date();
			d.setMonth(d.getMonth() - 1);
			var n = d.toISOString();
			url = "/api/v1/search/videos?start=" + start + "&count=" + count + "&startDate=" + n + "&sort=-views" + (category !== null ? "&categoryOneOf=" + category : "");
			console.log(url);
		}
		this.oldOpen(method, url);
	};
}
document.getElementsByClassName("icon-logo")[0].style.display = "none";

//searchbox
var searchBox = document.getElementById('search-video');
searchBox.parentNode.removeChild(searchBox)

document.getElementsByClassName("header")[0].insertBefore(searchBox, document.getElementsByClassName("header-right")[0])

//remove search icon

document.getElementsByClassName("icon-search")[0].style.display = "none";


let menuIcon = document.getElementsByClassName("icon-menu")[0];

function openLeftMenu() {
	if (document.getElementsByClassName("top-menu").length == 0)
		menuIcon.click();
}

function closeLeftMenu() {
	if (document.getElementsByClassName("top-menu").length > 0)
		menuIcon.click();
}

//navbar
openLeftMenu();
var header = document.getElementsByClassName("header")[0];
var navBar = document.createElement("div");
navBar.classList.add("nav-bar");
var panel = document.getElementsByClassName("panel-block")[0];
panel.parentNode.removeChild(panel)
panel.removeChild(panel.getElementsByClassName("block-title")[0])
var trendingButton;
for (var child of panel.childNodes) {
	child.removeEventListener = function () {}; // to avoid remove by menu deletion
	if (child.href.indexOf("/videos/trending") >= 0)
		trendingButton = child;
}
navBar.appendChild(panel) //impossible to add only items : issue with recently-added

var panel2 = document.getElementsByClassName("panel-block")[0];
panel2.parentNode.removeChild(panel2)
panel2.removeChild(panel2.getElementsByClassName("block-title")[0])
for (var child of panel2.childNodes) {
	child.removeEventListener = function () {}; // to avoid remove by menu deletion

}
navBar.appendChild(panel2)
header.parentNode.insertBefore(navBar, header.nextSibling);



//menu

var currentLoggedInState = undefined

function isLoggedIn() {
	return document.getElementsByClassName('user-not-logged-in').length == 0;
}
var menu = undefined;
var menuContainer = undefined;
var uploadButton = header.getElementsByClassName('upload-button')[0];
uploadButton.parentNode.removeChild(uploadButton)
var onclickNG = undefined

function createAccountMenu() {
	openLeftMenu();
	let glyphicon = document.getElementsByClassName('glyphicon')[0]
	if (!isLoggedIn()) return; //bad state
	var dropdown = document.getElementsByClassName('dropdown')
	if (dropdown.length == 0) {
		glyphicon.click();
		dropdown = document.getElementsByClassName('dropdown');
		if (dropdown.length == 0)
			return false;
	}
	menu = dropdown[0].childNodes[0];
	for (var child of menu.childNodes[0].childNodes) {
		child.removeEventListener = function () {}; // to avoid remove by menu deletion
	}
	uploadButton.classList.remove("upload-button");
	uploadButton.classList.add("dropdown-item");
	menu.firstChild.insertBefore(uploadButton, menu.firstChild.firstChild);
	menu.classList.add('account-menu');
	menu.parentNode.removeChild(menu)

	menuContainer = document.createElement("div");
	menuContainer.classList.add("account-menu-container");
	glyphicon.click();
	header.getElementsByClassName('header-right')[0].innerHTML += '<a _ngcontent-c1="" onclick="toggleMenu()" class="account-button" >My account</span></a>';
	header.getElementsByClassName('header-right')[0].appendChild(menuContainer);
	menu.onclick = toggleMenu;
	return true;
}

function destroyAccountMenu() {
	let accountButton = document.getElementsByClassName('account-button')[0];
	if (accountButton == undefined)
		return;
	accountButton.parentNode.removeChild(accountButton)

}

function toggleMenu() {
	if (menu.parentNode == undefined)
		menuContainer.appendChild(menu);
	else
		menu.parentNode.removeChild(menu)
}


var loginButton = undefined;

function addLoginButton() {
	if (loginButton == undefined) {
		openLeftMenu();
		loginButton = document.getElementsByClassName('login-button')[0];
		loginButton.parentNode.removeChild(loginButton)
		loginButton.removeEventListener = function () {};
	}
	header.getElementsByClassName('header-right')[0].appendChild(loginButton);
}

function removeLoginButton() {
	if (loginButton !== undefined && loginButton.parentNode != null) {
		loginButton.parentNode.removeChild(loginButton)
	}
}



//check login state and adapt page
function checkState() {
	let loggedState = isLoggedIn();
	if (currentLoggedInState !== loggedState) { //has changed
		if (loggedState) {
			removeLoginButton();
			if (!createAccountMenu()) //fail
				return;
		} else {
			addLoginButton();
			destroyAccountMenu();
		}
		closeLeftMenu();
		currentLoggedInState = loggedState;
	}
}

function onPathChange(path) {
	console.log(path);
	if (path == "/" || path == "/videos/local" || path == "/videos/trending" || path == "/videos/recently-added") {
		var intro = document.createElement("div");
		intro.id = "intro";
		intro.innerHTML = "Let's give a tribute to Vine legacy with a Vine-like peertube instance.";
		var learnMore = document.createElement("a");
		learnMore.innerHTML = " Learn more.";
		learnMore.href = "about";
		learnMore.routerlink = "/about"
		intro.appendChild(learnMore);
		var marginContent = document.getElementsByClassName("margin-content")[0];
		marginContent.insertBefore(intro, marginContent.firstChild);
	} else if (path == "/login") {
		var create = document.getElementsByClassName("create-an-account")[0];
		create.innerHTML = "or create a new account";
		create.href = "signup";
	} else if (path.indexOf("videos/watch/") >= 0) {
		setPlayerLoop()
	} else if (path == "/videos/upload") {
		var vfile = document.getElementById("videofile");
		if (vfile !== null) {
			vfile.onclick = function () {
				alert("Bidule is a platform for short videos, less than 10sec, and is still experimental. You can send an email to phie@phie.ovh in case of issues.");
			}
		}
	}
}

function setPlayerLoop() {
	if (window.location.pathname.indexOf("videos/watch/") < 0) return;
	var player = document.getElementsByClassName("vjs-tech")[0];
	if (player == undefined) // to be sure player is there :(
		setTimeout(setPlayerLoop, 1000)
	else player.loop = true;
}

window.history.oldPushStart = window.history.pushState;
window.history.pushState = function (arg1, arg2, arg3) {
	window.history.oldPushStart(arg1, arg2, arg3);
	setTimeout(function () {
		onPathChange(arg3) //wait a bit for page to load
	}, 100);
}
setInterval(checkState, 100);
checkState()
if (window.location.pathname == "/videos/local" || window.location.pathname == "/")
	trendingButton.click();
else
	onPathChange(window.location.pathname)
//window.location.assign("/videos/trending")