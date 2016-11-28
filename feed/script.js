// Initialize Firebase
var config = {
  apiKey: "AIzaSyCvBclxH0fGMBzFRpPZ6vytpMtHroxVFB0",
  authDomain: "imad-feed.firebaseapp.com",
  databaseURL: "https://imad-feed.firebaseio.com",
  storageBucket: "",
  messagingSenderId: "429855910954"
};
firebase.initializeApp(config);
// console.log('hello');
var preObject = document.getElementById('feed');
var feedObject = firebase.database().ref().child('feeds');
var user;

feedObject.on('value', function (snap) {
 	render(snap.val());
	// console.log(snap.val());
});

function render(data) {
	var source   = $("#feeds-template").html();
	var template = Handlebars.compile(source);

	var rendered = template({feeds:data.reverse()});
	$("#feed").html(rendered);

	var expanded = localStorage.getItem('expanded');

	if(expanded) {
		$('[data-id="' + expanded +'"]').next().show();
	}
}

var provider = new firebase.auth.GoogleAuthProvider();

firebase.auth().onAuthStateChanged(function(loggedInUser) {
  if (loggedInUser) {
    user = loggedInUser;
    // User is signed in.
  } else {
    // No user is signed in.
  }
});


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
		$('.login-button').text(user.displayName);
		$('.logout-button').show();
  } else {
    // No user is signed in.
  }
});

function login() {
	firebase.auth().signInWithPopup(provider).then(function(result) {
	  // This gives you a Google Access Token. You can use it to access the Google API.
	  var token = result.credential.accessToken;
	  // The signed-in user info.
	  user = result.user;
	  // ...
	  // console.log(user);

	  $('.login-button').text(user.displayName);
	  $('.logout-button').slideToggle();
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

function logout() {
	firebase.auth().signOut().then(function() {
		$('.login-button').text("Login");
		$('.logout-button').slideToggle();
		user = undefined;
	}, function(error) {
	  // An error happened.
	});
}

function getDate() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;

	var h = today.getHours();
    var m = today.getMinutes();

	var yyyy = today.getFullYear();
	if(dd<10){
	    dd='0'+dd
	} 
	if(mm<10){
	    mm='0'+mm
	} 
	return dd+"-"+mm+"-"+yyyy+" "+h+":"+m;
}

$(document).on("click", ".like", function() {
	var id = $(this).closest(".dialog").data('id');
	// console.log(id);
	if (!user) {
		alert("A wise man one said, Log in you should, like you can.");
		return;
	}
	var like = {};
	like[user.uid] = true;
	feedObject.child(id).child("likes").set(like);
});

$(document).on("click", ".comment:not(.expanded)", function() {
	$(this).addClass("expanded");
	$('.comments-container').slideUp();
	$(this).closest(".dialog").next().slideDown();

	var id = $(this).closest(".dialog").data('id');
	localStorage.setItem("expanded", id);
});

$(document).on("click", ".comment.expanded", function() {
	$(this).closest(".dialog").next().slideUp();
	$(this).removeClass("expanded");
	localStorage.removeItem("expanded");
});

$(document).on("click", ".add-comment", function() {
	var text = $(this).prev().val();
	var id = $(this).closest(".comments-container").prev().data('id');
	// console.log(id);
	if (!user) {
		alert("You shall not Comment. Unless you are logged in of course.");
		return;
	}
	var comment = {
		name: user.displayName,
		uid: user.uid,
		text: text,
		timestamp: getDate()
	};
	// console.log(comment);
	// comment[user.uid] = true;
	feedObject.child(id).child("comments").push(comment);
});

Handlebars.registerHelper("len", function(json) { 
	if (json) return Object.keys(json).length;
	return 0;
});

