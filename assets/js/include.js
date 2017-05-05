jQuery(document).ready(function ($) {
	initSliders();
	initSearch();

	initSocialSidebar();
	$('.js__form-send').on('submit', formAjax);
	
	var scene = document.getElementById('scene');
	var parallax = new Parallax(scene);
});

jQuery(window).load(function () {
	mobileNav.init('.footer-menu');
});

var mobileNav = {
	className: '.js_mobile-nav',
	mobileMenuClassName: '.mobile-nav__menu',
	activeClass: 'open',
	init: function (mainMenuClassName) {
		if (!$(this.mobileMenuClassName).children().length) {
			$(mainMenuClassName).children().clone().prependTo(this.mobileMenuClassName);
		}

		$(document).on('click', '.burger', function () {
			mobileNav.toggle();
		});
	},
	open: function () {
		$(this.className).addClass(this.activeClass);
	},
	close: function () {
		$(this.className).removeClass(this.activeClass);
	},
	toggle: function () {
		$(this.className).hasClass(this.activeClass) ? this.close() : this.open();
	}
};

function initSliders(){
	$('.js_ideas__slider').owlCarousel({
		margin:0,
		nav:true,
		stagePadding:0,
		loop: true,
		mouseDrag :false,
		touchDrag: false,
		autoplay: true,
		autoplayTimeout: 4000,
		autoplayHoverPause: true,
		navText:['<i class="kf-icon kf-icon-left-open-big" aria-hidden="true"></i>','<i class="kf-icon kf-icon-right-open-big" aria-hidden="true"></i>'],
		responsive:{
			0:{
				items:1
			},
			800:{
				items:2
			},
			1200:{
				items: 3
			}
		}
	});
}

function initSearch(){
	$('.header__search').click( function(){
	  $('body').addClass('search-active');
	  $('.input-search').focus();
	});

	$('.search__close').click( function(){
	  $('body').removeClass('search-active');
	});
}

function InvalidMsg(textbox) {

    if (textbox.value == '') {
        textbox.setCustomValidity(textbox.getAttribute('title'));
    }
    else if(textbox.validity.typeMismatch){
        textbox.setCustomValidity(textbox.getAttribute('title'));
    }
    else {
        textbox.setCustomValidity('');
    }
    return true;
}

function customValid() {
	var _this = event.target;
	var errorClass = 'form__input--error';

	_this.setCustomValidity(' ');
	$(_this).addClass(errorClass);

	return true;
}

function formAjax() {
	event.preventDefault();
	console.log('formAjax start');
	var form = this;
	var data = $(form).serialize();
	var pathAction = $(form).attr('action');

	console.log(data);
  $.ajax({
    url: pathAction,
    data: data,
    type: 'POST',
    success: function (dataofconfirm) {
        $(form).siblings('.form__text--success').show('slow');
        $(form).find('input:not([type="submit"])').each(function(){
        	$(this).removeClass('form__input--error');
        	$(this).val('');
        })
    }
  });
}

function initSocialSidebar() {
	var SOCIAL_CLASS = '.js-socside';
	var SOCIAL_ART_CLASS = SOCIAL_CLASS + '-article';
	var SOCIAL_ACTIVE_CLASS = 'js-socside-show';
	var SOCIAL_ALWAYS_SHOW = SOCIAL_CLASS + '-always-show';
	var isAlwaysShow = false;

	if ($(SOCIAL_ALWAYS_SHOW).length) { isAlwaysShow = true; }

	if (!$(SOCIAL_CLASS).length) return;

	// start showing when we see the article
	var SOCIAL_ART_OBJ = $(SOCIAL_ART_CLASS);

	if (isAlwaysShow) {
		$(SOCIAL_CLASS).addClass(SOCIAL_ACTIVE_CLASS);
	} else {
		window.addEventListener("scroll", function(event) {

		  if (this.scrollY > $(SOCIAL_ART_CLASS).offset().top) {
		  	if (!$(SOCIAL_CLASS).hasClass(SOCIAL_ACTIVE_CLASS)) {
		  		$(SOCIAL_CLASS).addClass(SOCIAL_ACTIVE_CLASS);
		  	}
		  } else {
		  	if ($(SOCIAL_CLASS).hasClass(SOCIAL_ACTIVE_CLASS)) {
		  		$(SOCIAL_CLASS).removeClass(SOCIAL_ACTIVE_CLASS);
		  	}
		  }
		}, false);
	}
}