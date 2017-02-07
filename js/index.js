function makeId() {
	var text = "";
	var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

	for( var i=0; i < 32; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

function createAccountClicked() {
	console.log("create account clicked")
	var salt = makeId();
	thisUsername = $("#signup-username").val();
	$.ajax({
		type : "POST",
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		data : jQuery.param({
			userName : $("#signup-username").val(),
			email : $("#signup-email").val(),
			passHash : sodium.to_hex(sodium.crypto_generichash(32, salt + $("#signup-password").val())),
			passSalt : salt,
			phoneNumber : $("#signup-phone").val()
		}),
		url : serverUrl + "/signup",
		success : function(result) {
			if (result === 'true') {
				console.log("attempting redirect...")
				window.location.replace("/settings?username=" + thisUsername);
			} 
			if (result === 'false') {
				console.log("username/email/phone already exists");
				$("#create").css("background-color","#f27a6a");
				$("#create").val("One of these login details is already in use");
				setTimeout(function() {
					$("#create").css("background-color","#4286f4");
					$("#create").val("Create account");
					}, 4000)
			}
				
		}
	});
}


function resetClicked() {
	console.log("reset password clicked")
	$.ajax({
		type : "GET",
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		data : jQuery.param({
			email : $("#signup-email").val(),
		}),
		url : serverUrl + "/reset",
		success : function(result) {
			console.log("a password recovery email has been sent")
			//we also need a way for users to validate their email addresses to they can't spam people by entering their emails
			//or only send 1 email ever, on login? 
		}
	});
}

function loginClicked() {
	console.log("login clicked")
	thisUsername = $("#signup-username").val();
	$.ajax({
		type : "GET",
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		data : {
			userName : $("#signup-username").val(),
		},
		url : serverUrl + "/checkUser",
		success : function(result) {
			if (result !== 'false') { //if user exists
				console.log(sodium.to_hex(sodium.crypto_generichash(32, result + $("#signin-password").val())));
				$.ajax({
					type : "GET",
					data : jQuery.param({
						userName : $("#signup-username").val(),
						passHash : sodium.to_hex(sodium.crypto_generichash(32, result + $("#signin-password").val())),
					}),
					url : serverUrl + "/login",
					success : function(result) {
						if (result === 'true') {
							console.log("attempting redirect...")
							window.location.replace("/settings?username=" + thisUsername );
						} 
						if (result === 'false') {
							console.log("invalid password");
							$("#login").css("background-color","#f27a6a");
							$("#login").val("Incorrect username or password");
							setTimeout(function() {
								$("#login").css("background-color","#4286f4");
								$("#login").val("Login");
								}, 4000)
						}
					}
				});
			} else {
				console.log("user did not exist - no salt found");
				$("#login").css("background-color","#f27a6a");
				$("#login").val("Incorrect username or password");
				setTimeout(function() {
					$("#login").css("background-color","#4286f4");
					$("#login").val("Login");
					}, 4000)
			}
		}
	});
}

function showDivs(n) {
	var i;
	var x = document.getElementsByClassName("mySlides");
	if (n > x.length) {
		slideIndex = 1
	}
	if (n < 1) {
		slideIndex = x.length
	}
	;
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
	}
	x[slideIndex - 1].style.display = "block";
}

function carousel() {
	var i;
	var x = document.getElementsByClassName("mySlides");
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
	}
	slideIndex++;
	if (slideIndex > x.length) {
		slideIndex = 1
	}
	x[slideIndex - 1].style.display = "block";
	setTimeout(carousel, 10000); // Change image every 2 seconds
}

function plusDivs(n) {
	showDivs(slideIndex += n);
}

