// Initialize Firebase
var config = {
  apiKey: "AIzaSyCvBclxH0fGMBzFRpPZ6vytpMtHroxVFB0",
  authDomain: "imad-feed.firebaseapp.com",
  databaseURL: "https://imad-feed.firebaseio.com",
  storageBucket: "",
  messagingSenderId: "429855910954"
};
firebase.initializeApp(config);
console.log('hello');
var preObject = document.getElementById('feed');
var feedObject = firebase.database().ref().child('feeds');
var user;

feedObject.on('value', function (snap) {
 	render(snap.val());
	console.log(snap.val());
});

function render(data) {
	var source   = $("#feeds-template").html();
	var template = Handlebars.compile(source);

	var rendered = template({feeds:data.reverse()});
	$("#feed").html(rendered);
}

var provider = new firebase.auth.GoogleAuthProvider();
function login() {
	firebase.auth().signInWithPopup(provider).then(function(result) {
	  // This gives you a Google Access Token. You can use it to access the Google API.
	  var token = result.credential.accessToken;
	  // The signed-in user info.
	  user = result.user;
	  // ...
	  console.log(user);

	  $('.login-button').text(user.displayName);
	}).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // The email of the user's account used.
	  var email = error.email;
	  // The firebase.auth.AuthCredential type that was used.
	  var credential = error.credential;
	  // ...
	});	
}
function like() {

	// body...
}

$(document).on("click", ".like", function() {
	var id = $(this).closest(".dialog").data('id');
	console.log(id);
	if (!user) {
		alert("Log in to like and comment");
		return;
	}
	var like = {};
	like[user.uid] = true;
	feedObject.child(id).child("likes").set(like);
});

Handlebars.registerHelper("len", function(json) { 
	if (json) return Object.keys(json).length;
	return 0;
});