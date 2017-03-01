function collapsibleCheckboxTree() {
	$('ul#example').collapsibleCheckboxTree({
		checkParents : false, // When checking a box, all parents are checked (Default: true)
		checkChildren : true, // When checking a box, all children are checked (Default: false)
		shiftClickEffectChildren : true, // When shift-clicking a box, all children are checked or unchecked (Default: true)
		uncheckChildren : true, // When unchecking a box, all children are unchecked (Default: true)
		includeButtons : true, // Include buttons to expand or collapse all above list (Default: true)
		initialState : 'collapse' // Options - 'expand' (fully expanded), 'collapse' (fully collapsed) or default
	});
	if ($(window).width() > 992) {
		$("#tree-selector").css("height",
				parseInt($("#mid-block-f").height()) - 270) /*   un-hardcode this*/
	} else {
		$("#tree-selector").css("height",
				parseInt($("#mid-block-f").height()) - 320) /*   un-hardcode this*/
	}

	$("#expand").css("display", "none")
	$("#collapse").css("display", "none")
	$("#default").css("display", "none")

}

function retrievePlayersRequest(callback) {
	console.log("retrievePlayersRequest called")
	$.ajax({
		type : "GET",
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		url : serverUrl + "/retrievePlayers",
		data: {
			userName: QueryString.username,
			loginKey: QueryString.loginKey
		},
		success : function(result) {
			//console.log(JSON.parse(result).list)
			generateHTML(JSON.parse(result), function() {
				retrieveFavorites();
				callback();
			})

		}
	});
}

function logoutClicked() {
	console.log("logout called")
	$.ajax({
		type : "POST",
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		url : serverUrl + "/logout",
		data: {
			userName: QueryString.username,
			loginKey: QueryString.loginKey
		},
		success : function(result) {
			console.log('logged out successfully')

		}
	});
}

function applySettingsButtonClicked() {
	console.log("apply settings clicked")
	var receiveEmails = $('.email-notifs').find('.off').length ^ 1
	var receiveTexts = $('.text-notifs').find('.off').length ^ 1
	var suspendNotifs = 0
	if ($('.disable-n').find('.off').length) {
		suspendNotifs = 0
	} else {
		suspendNotifs = parseInt($('.disable-time').val())
	}
	$.ajax({
		type : "POST",
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		data : jQuery.param({
			receiveEmails : receiveEmails,
			receiveTexts : receiveTexts,
			suspendNotifs : suspendNotifs
		}),
		url : serverUrl + "/updateSettings",
		success : function(result) {
			console.log("settings have been updated")
		}
	});
}
	
function applyFavsButtonClicked() {
	console.log("apply favs button clicked")
	var favorites = []
	var checkedElts = $("#example").find("[checked='checked']")
	for (var i=0; i<checkedElts.length;i++) {
		if (checkedElts[i].parentElement.childElementCount < 3) { //if it is NOT a team or league (players only have 2 children, not 3)
			favorites.push(checkedElts[i].parentElement.textContent.replace(/^\s+/,""))
		}
		
	}
	favorites = favorites.join("|") //encodeURI or encodeURIcomponent if necessary
	favorites = favorites.replace("'", "''") 
	console.log(favorites)
	$.ajax({
		type : "POST",
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		url : serverUrl + "/sendFavorites",
		data: {
				favorites: favorites,
				username: QueryString.username,
				loginKey: QueryString.loginKey
		},
		success : function() {
			console.log("post favorites success")
		}
	});
	
}

function generateHTML(result, callback) {

	console.log("generate html called")

	var timerStart = Date.now();
	for (var i=0; i<result.list.length; i++) {
		if ($("#example").find("#" + result.list[i].league.split(" ").join("").replace("/","").replace(".","")).length > 0) {
			if ($("#example").find("#" + result.list[i].league.split(" ").join("").replace("/","").replace(".","")).find("#team").find("#" + result.list[i].team.split(" ").join("").replace("/","").replace(".","")).length > 0) {
				if ($("#example").find("#" + result.list[i].league.split(" ").join("").replace("/","").replace(".","")).find("#team").find("#" + result.list[i].team.split(" ").join("").replace("/","").replace(".","")).find("#player").find("#" + result.list[i].player.split(" ").join("").replace("/","").replace("'", "").replace(".","").replace("?","")).length > 0) {
					//do nothing
				} else {
					$("#example").find("#" + result.list[i].league.split(" ").join("").replace("/","").replace(".","")).find("#team").find("#" + result.list[i].team.split(" ").join("").replace("/","").replace(".","")).find("#player").append("<li id='" + result.list[i].player.split(" ").join("").replace("'", "").replace(".","").replace("?","") + "'><input type='checkbox' name='' />" + result.list[i].player + "</li>")
				}
			} else {
				$("#example").find("#" + result.list[i].league.split(" ").join("").replace("/","").replace(".","")).find("#team").append("<li id='" + result.list[i].team.split(" ").join("").replace(".","") + "'><input type='checkbox' name=''  />" + result.list[i].team + "<ul id='player'></ul></li>")
				$("#example").find("#" + result.list[i].league.split(" ").join("").replace("/","").replace(".","")).find("#team").find("#" + result.list[i].team.split(" ").join("").replace("/","").replace(".","")).find("#player").append("<li id='" + result.list[i].player.split(" ").join("").replace("'","").replace(".","").replace("?","") + "'><input type='checkbox' name='' />" + result.list[i].player + "</li>")
			}
		} else {
			$("#example").append("<li id='" + result.list[i].league.split(" ").join("").replace("/","").replace(".","") + "'><input type='checkbox' name='' />" + result.list[i].league + "<ul id='team'></ul></li>")
			$("#example").find("#" + result.list[i].league.split(" ").join("").replace("/","").replace(".","")).find("#team").append("<li id='" + result.list[i].team.split(" ").join("").replace(".","") + "'><input type='checkbox' name='' />" + result.list[i].team + "<ul id='player'></ul></li>")
			$("#example").find("#" + result.list[i].league.split(" ").join("").replace("/","").replace(".","")).find("#team").find("#player").append("<li id='" + result.list[i].player.split(" ").join("").replace("'","").replace(".","").replace("?","") + "'><input type='checkbox' name='' />" + result.list[i].player + "</li>")
		}
	}
	$('ul#example').collapsibleCheckboxTree({
		checkParents : false, // When checking a box, all parents are checked (Default: true)
		checkChildren : true, // When checking a box, all children are checked (Default: false)
		shiftClickEffectChildren : true, // When shift-clicking a box, all children are checked or unchecked (Default: true)
		uncheckChildren : true, // When unchecking a box, all children are unchecked (Default: true)
		includeButtons : true, // Include buttons to expand or collapse all above list (Default: true)
		initialState : 'collapse' // Options - 'expand' (fully expanded), 'collapse' (fully collapsed) or default
	});
	$("button#expand").css("display", "none")
	$("button#collapse").css("display", "none")
	$("button#default").css("display", "none")
	console.log("table generated in", Date.now() - timerStart)

	callback();
} 

function retrieveFavorites() {
	console.log("retrieve favorites called")
	$.ajax({
		type : "GET",
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		data: {
			userName: QueryString.username,
			loginKey: QueryString.loginKey
		},
		url : serverUrl + "/retrieveFavorites",
		success : function(result) {
			console.log(JSON.parse(result))
			checkBoxes(JSON.parse(result).list)
		}
	});
}



function checkBoxes(favorites) {

	console.log("checkboxes called")
	var boxTimer = Date.now();


	var favs = []
	favorites.forEach(function(f) {
		favs.push(f.player)
	})


	console.log(favs)
	window.$log = favs
	var allBoxes = $("#example").find("[type='checkbox']")
	console.log('size is ' + allBoxes.length)
	for (var i=0; i<allBoxes.length; i++) {
		if (favs.indexOf(allBoxes[i].parentElement.textContent.trim()) > -1) {
			console.log("found a match " + allBoxes[i].parentElement.textContent.trim())
			$(allBoxes[i]).attr('checked','checked')
		}
	}

	console.log("boxes checked in", Date.now() - boxTimer)

}

function btnLeftClicked() {
	console.log("btn left clicked")
	if (!leftExpanded) {
		leftExpanded = true;
		$('.btn-left').toggleClass('clicked');
		$('.btn-left').toggleClass('hovered');
		$("#btn_cont").css("border", "none")
		$(".btn-right").hide();
		$(".about-box").hide();
		$(".btn-left").animate({
			top : "-=" + (parseInt($(".btn-left").offset().top) - parseInt($(
			".header-row")
			.height()))
			+ "px",
			left : "-="
				+ (parseInt($(
				".btn-left")
				.offset().left))
				+ "px"
		})
		$("#mid-block-f").css("display", "block")
		$("#mid-block-f")
		.css(
				"height",
				(parseInt($(window).height())
						- parseInt($(
						".header-row")
						.height()) - parseInt($(
						".footer").height()))
						/ 2
						+ $(window).height()
						/ 4)
						$("#mid-block-f")
						.css(
								"top",
								parseInt($(".header-row")
										.height())
										+ (parseInt($(window)
												.height()
												- (parseInt($(
												".header")
												.height())
												+ parseInt($(
												".footer")
												.height()) + ((parseInt($(
														window)
														.height())
														- parseInt($(
																".header-row")
																.height()) - parseInt($(
																".footer")
																.height())) / 2 + $(
																		window)
																		.height() / 4))) / 2))
																		$("#mid-block-f").css(
																				"width",
																				$(window).width() - $(window).width()
																				/ 5)
																				$("#mid-block-f").css("left",
																						$(window).width() / 10)

	} else {
		leftExpanded = false;
		$('.btn-left').toggleClass('clicked');
		$('.btn-left').toggleClass('hovered');
		$("#btn_cont").css("border", "2px solid #fff")
		$(".btn-right").show();
		$(".about-box").show();

		$("#mid-block-f").hide();
		$(".btn-left")
		.animate(
				{
					top : "+="
						+ (parseInt(leftInitOffset.top)
								- parseInt($(
								".header-row")
								.height()) - 2)
								+ "px",
								left : "+="
									+ (parseInt(leftInitOffset.left) - 2)
									+ "px"
				})
	}

}

function btnRightClicked() {
	console.log("btn right clicked")
	if (!rightExpanded) {
		rightExpanded = true;
		$(".btn-right").toggleClass('clicked');
		$(".btn-right").toggleClass('hovered');
		$("#btn_cont").css("border", "none")
		$(".btn-left").hide();
		$(".about-box").hide();

		$(".btn-right").animate({
			top : "-=" + (parseInt($(".btn-right").offset().top + parseInt($("#btn_cont").height()) - parseInt($(".footer").offset().top) + 20)) + "px",
			left : "+=" + (parseInt($(window).width() - parseInt($(".btn-right").offset().left) - parseInt($(".btn-right").width()) - 80)) + "px"
		})
		$("#mid-block-s").css("display", "block")
		$("#mid-block-s").css("height", (parseInt($(window).height()) - parseInt($(".header-row").height()) - parseInt($(".footer").height())) / 2 + $(window).height() / 4)
		$("#mid-block-s")
		.css(
				"top",
				parseInt($(".header-row").height())
				+ (parseInt($(window).height()
						- (parseInt($(".header").height()) + parseInt($(".footer").height()) + ((parseInt($(window).height())
								- parseInt($(".header-row").height()) - parseInt($(".footer").height())) / 2 + $(window).height() / 4))) / 2))
								$("#mid-block-s").css("width", $(window).width() - $(window).width() / 5)
								$("#mid-block-s").css("left", $(window).width() / 10)

	} else {
		rightExpanded = false;
		$(".btn-right").toggleClass('clicked');
		$(".btn-right").toggleClass('hovered');
		$("#btn_cont").css("border", "2px solid #fff");
		$(".btn-left").show();
		$(".about-box").show();

		$("#mid-block-s").hide();
		$(".btn-right")
		.animate(
				{
					top : "-="
						+ (parseInt($(window).height()) - parseInt(rightInitOffset.top) - parseInt($(".footer").height()) - parseInt($(".header-row").height()) + ((parseInt($(
								window).width()) < 1641) ? 11 : -5)) + "px",
								left : "-=" + (parseInt(rightInitOffset.left) - parseInt($(".btn-right").width()) - 80) + "px"
				})
	}
}

function btnCancelClicked() {
	console.log("btn cancel clicked")
	if (leftExpanded) {
		leftExpanded = false;
		$('.btn-left').toggleClass('clicked');
		$('.btn-left').toggleClass('hovered');
		$("#btn_cont").css("border", "2px solid #fff")
		$(".btn-right").show();
		$(".about-box").show();

		$("#mid-block-f").hide();
		$(".btn-left").animate({
			top : "+=" + (parseInt(leftInitOffset.top) - parseInt($(".header-row").height())) + "px",
			left : "+=" + (parseInt(leftInitOffset.left)) + "px"
		})
	}
	if (rightExpanded) {
		rightExpanded = false;
		$(".btn-right").toggleClass('clicked');
		$(".btn-right").toggleClass('hovered');
		$("#btn_cont").css("border", "2px solid #fff");
		$(".btn-left").show();
		$(".about-box").show();

		$("#mid-block-s").hide();
		$(".btn-right").animate(
				{
					top : "-="
						+ (parseInt($(window).height()) - parseInt(rightInitOffset.top) - parseInt($(".footer").height()) - parseInt($(".header-row").height()) + ((parseInt($(
								window).width()) < 1641) ? 11 : -5)) + "px",
								left : "-=" + (parseInt(rightInitOffset.left) - parseInt($(".btn-right").width()) - 80) + "px"
				})
	}
}
