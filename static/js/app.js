$(document).foundation();

var logoHeight = $('.logo__main').outerHeight();

$(window).scroll(function (event) {
    var scroll = $(window).scrollTop();
	
	if (scroll > logoHeight) {
		$('.page__header').addClass('page__header--sticky');
	}else{
		$('.page__header').removeClass('page__header--sticky');
	}
});
//# sourceMappingURL=static/js/app.js.map
