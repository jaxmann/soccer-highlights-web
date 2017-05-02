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
	var loginKey = makeId();
	thisUsername = $("#signup-username").val();
	thisPhoneNum = $("#signup-phone").val();
	thisEmail = $("#signup-email").val();
	thisPass = $("#signup-password").val();
	var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
	var emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
	
	if (thisUsername.length < 5) {
		//console.log(thisUsername)
		//console.log(thisUsername.length)
		$("#create").css("background-color","#f27a6a");
		$("#create").val("Username Must be at Least 5 Characters Long");
		setTimeout(function() {
			$("#create").css("background-color","#4286f4");
			$("#create").val("Create Account");
		}, 4000)
	} else if (!emailRe.test(thisEmail)) {
		$("#create").css("background-color","#f27a6a");
		$("#create").val("Please Enter a Valid Email Address");
		setTimeout(function() {
			$("#create").css("background-color","#4286f4");
			$("#create").val("Create Account");
		}, 4000)
	} else if (!thisPhoneNum.match(phoneno)) {
		$("#create").css("background-color","#f27a6a");
		$("#create").val("Please Enter a Valid Phone Number");
		setTimeout(function() {
			$("#create").css("background-color","#4286f4");
			$("#create").val("Create Account");
		}, 4000)
	} else if (thisPass.length < 1) {
		$("#create").css("background-color","#f27a6a");
		$("#create").val("Please Enter a Longer Password");
		setTimeout(function() {
			$("#create").css("background-color","#4286f4");
			$("#create").val("Create Account");
		}, 4000)
	} else {
		$("#create").css("background-color","#4286f4");
		$("#create").val("Processing...");
		$.ajax({
			type : "POST",
			contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
			data : jQuery.param({
				userName : $("#signup-username").val(),
				email : $("#signup-email").val(),
				passHash : sodium.to_hex(sodium.crypto_generichash(32, salt + $("#signup-password").val())),
				passSalt : salt,
				phoneNumber : $("#signup-phone").val(),
				loginKey: loginKey
			}),
			url : serverUrl + "/signup",
			success : function(result) {
				if (result === 'true') {
					$("#create").css("background-color","#f27a6a");
					$("#create").val("Please Check Your Email for a Confirmation Email");
					setTimeout(function() {
						$("#create").css("background-color","#4286f4");
						$("#create").val("Create Account");
					}, 4000)
//					console.log("attempting redirect...")
//					window.location.replace("/settings?username=" + thisUsername + "&loginKey=" + loginKey);
				} 
				if (result === 'false') {
					console.log("username/email/phone already exists");
					$("#create").css("background-color","#f27a6a");
					$("#create").val("One of these login details is already in use");
					setTimeout(function() {
						$("#create").css("background-color","#4286f4");
						$("#create").val("Create Account");
					}, 4000)
				}

			}
		});
	}


}


function resetClicked() {
	var emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
	
	console.log("reset password clicked")
	var thisEmail = $("#reset-email").val(); 
	
	if (!emailRe.test(thisEmail)) {
		$("#reset").css("background-color","#f27a6a");
		$("#reset").val("Please Enter a Valid Email Address");
		setTimeout(function() {
			$("#reset").css("background-color","#4286f4");
			$("#reset").val("Reset password");
		}, 4000)
	} else {
		$.ajax({
			type : "GET",
			contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
			data : jQuery.param({
				email : $("#reset-email").val(),
			}),
			url : serverUrl + "/reset",
			success : function(result) {
				console.log("a password recovery email has been sent")
				$("#reset").css("background-color","#60ad0c");
				$("#reset").val("Check your email for a reset link");
				setTimeout(function() {
					$("#reset").css("background-color","#4286f4");
					$("#reset").val("Reset password");
				}, 4000)
				
			}
		});
	}
	
	
}

function loginClicked() {
	var loginKey = makeId();
	console.log("login clicked")
	thisUsername = $("#signin-username").val();
	$.ajax({
		type : "GET",
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		data : {
			userName : $("#signin-username").val(),
		},
		url : serverUrl + "/checkUser",
		success : function(result) {
			if (result !== 'false') { //if user exists
				//console.log(sodium.to_hex(sodium.crypto_generichash(32, result + $("#signin-password").val())));
				$.ajax({
					type : "GET",
					data : jQuery.param({
						userName : $("#signin-username").val(),
						passHash : sodium.to_hex(sodium.crypto_generichash(32, result + $("#signin-password").val())),
						loginKey: loginKey
					}),
					url : serverUrl + "/login",
					success : function(result) {
						if (result === 'true') {
							console.log("attempting redirect...")
							window.location.replace("/settings?username=" + thisUsername + "&loginKey=" + loginKey);
						} else if (result === 'credentials') {
							console.log("invalid password");
							$("#login").css("background-color","#f27a6a");
							$("#login").val("Incorrect username or password");
							setTimeout(function() {
								$("#login").css("background-color","#4286f4");
								$("#login").val("Log In");
							}, 4000)
						} else if (result == 'confirmation') {
							console.log("unconfirmed account");
							$("#login").css("background-color","#f27a6a");
							$("#login").val("Please Confirm Your Account Before Logging in");
							setTimeout(function() {
								$("#login").css("background-color","#4286f4");
								$("#login").val("Log In");
							}, 4000) 
						} else {
							console.log("this should never happen");
						}
					}
				});
			} else {
				console.log("user did not exist - no salt found");
				$("#login").css("background-color","#f27a6a");
				$("#login").val("Incorrect username or password");
				setTimeout(function() {
					$("#login").css("background-color","#4286f4");
					$("#login").val("Log In");
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

