(function ($, window, document) {
	// The $ is now locally scoped
	// Listen for the jQuery ready event on the document
	$(function () {
		// on ready
		madValidation.init();
		LvivTechnology.Init();
		modalVideo.init();

		$(document).keyup(function(a) // esc btn
		{
			if ((a.keyCode == 27) && ($(modalVideo.className).hasClass(modalVideo.activeClass))) {
				modalVideo.close();
			} else if ((a.keyCode == 27) && ($(mobileNav.className).hasClass(mobileNav.activeClass))) {
				mobileNav.close();
			}
		});
	});

	$(window).on('load', function () {
		// on load
		mobileNav.init('.header__menu');
	});

	// code

	var mobileNav = {
		className: '.js_mobile-nav',
		copyClassName: '.js_mobile-nav_copy',
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

	var madValidation = {
		option: {
			formClass: '.md-form'
		},
		init: function() {
			var _self = this;
			var forms = document.querySelectorAll(_self.option.formClass);

			for (var i = 0; i < forms.length; i++) {
					forms[i].addEventListener('submit', _self.initActions);
			}
		},
		initActions: function(e){
			console.log(e);
			e.preventDefault();
			swal("Спасибо!", "Ваша заявка успешно отправлена - мы свяжемся с вами в ближайшее время!", "success");
		}
	}

	var globalController = new ScrollMagic.Controller();

	var LvivTechnology = {
		Init: function() {
			this.PageLoad();
			this.NavTransition();
			this.Scroll();
			this.AnimateSlogan();
			this.AnimateTitles();
			this.AnimateIcons();
			this.VideoText();
			this.StickyNav();
			// this.AnimateCanvas();
			this.SmoothScrolling();
			this.SelectCustom();
		},
		Scroll: function() {
			var tl = new TimelineMax();

			tl
				.to('#image-container #layer-2', 1, {opacity: 1})
				.to('#image-container #layer-3', 1, {opacity: 1});

			var pinIntroScene = new ScrollMagic.Scene({
				triggerElement: '#pin-container',
				triggerHook: 0,
				// duration: 1.5 * $(window).height()
				duration: '100%'
			})
			.setPin('#pin-container')
			.setTween(tl)
			.addTo(globalController);
		},
		SelectCustom: function() {
			$('select').selectize();
		},
		AnimateCanvas: function() {
			var canvases = document.getElementsByClassName('anim-canvas');

			[].forEach.call(canvases, function(canvas){
				createCanvas(canvas);
			});

			function createCanvas(canvas) {

				var ctx = canvas.getContext('2d');
				var shapes = [];
				var num = 50;
				var staticXpos;
				var staticYpos;
				var opt = {
					shapecolor: "#2e2e2e",
					radius: 5,
					distance: 200,
					circleopacity: 2,
					speed: .4
				};

				var w = canvas.width = window.innerWidth;
				var h = canvas.height = window.innerHeight;

				addEventListener('resize', function() {
					w = canvas.width = window.innerWidth;
					h = canvas.height = window.innerHeight;
				});
				//helper functions
				function random(min, max) {
					return Math.floor(Math.random() * (max - min + 1) + min);
				}

				function clearcanvas() {
					ctx.clearRect(0, 0, w, h);
				}

				function getCords(e) {
					var rect = canvas.getBoundingClientRect();
					return {
						x: e.clientX - rect.left,
						y: e.clientY - rect.top
					};
				}

				function createShapes(Xpos, Ypos) {
					this.x = Xpos ? Xpos : random(0, w);
					this.y = Ypos ? Ypos : random(0, h);
					this.speed = opt.speed;
					this.vx = Math.cos(random(0, 360)) * this.speed;
					this.vy = Math.sin(random(0, 360)) * this.speed;
					this.r = opt.radius;
					this.color = opt.shapecolor;
					this.opacity = opt.circleopacity;
					this.draw = function() {
						ctx.beginPath();
						ctx.globalCompositeOperation = 'source-over';
						ctx.globalAlpha = this.opacity;
						ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
						ctx.closePath();
						ctx.fillStyle = this.color;
						ctx.fill();

					};
					this.move = function() {
						this.x += this.vx;
						this.y += this.vy;
						if (this.x >= w || this.x <= 0) {
							this.vx *= -1;
						}
						if (this.y >= h || this.y <= 0) {
							this.vy *= -1;
						}
						this.x > w ? this.x = w : this.x;
						this.y > h ? this.y = h : this.y;
						this.x < 0 ? this.x = 0 : this.x;
						this.y < 0 ? this.y = 0 : this.y;
					};
				}

				function check(point1, rest) {
					for (var j = 0; j < rest.length; j++) {
						var yd = point1.y - rest[j].y;
						var xd = point1.x - rest[j].x;
						var d = Math.sqrt(xd * xd + yd * yd);
						if (d < opt.distance) {
							ctx.beginPath();
							ctx.globalAlpha = (1 - (d / opt.distance));
							ctx.globalCompositeOperation = 'destination-over';
							ctx.lineWidth = 1;
							ctx.moveTo(point1.x, point1.y);
							ctx.lineTo(rest[j].x, rest[j].y);
							ctx.strokeStyle = opt.shapecolor;
							ctx.lineCap = "round";
							ctx.closePath();
							ctx.stroke();
						}
					}
				}

				function loop() {
					clearcanvas();
					shapes[0].x = staticXpos;
					shapes[0].y = staticYpos;
					shapes[0].move();
					shapes[0].draw();
					for (var i = 1; i < shapes.length; i++) {
						shapes[i].move();
						shapes[i].draw();
						check(shapes[i], shapes);
					}
					window.requestAnimationFrame(loop);
				}

				function init() {
					for (var i = 0; i < num; i++) {
						shapes.push(new createShapes());
					}
					window.requestAnimationFrame(loop);
				}

				init();
			}
		},
		AnimateTitles: function() {
			var titles = $('.sc__title');

			titles.each(function() {
				var tl = new TimelineMax();
				tl.fromTo(this, 0.5, {x: -300, opacity: 0}, {x: 0, opacity: 1});

				var scene = new ScrollMagic.Scene({
					triggerElement: this,
					triggerHook: 0.3
				})
				.setTween(tl)
				.addTo(globalController);
			});
		},
		VideoText: function() {
			var vt = $('.video__text');

			vt.each(function() {
				var tl = new TimelineMax();
				tl.fromTo(this, 0.5, {y: 300, opacity: 0}, {y: 0, opacity: 1});

				var scene = new ScrollMagic.Scene({
					triggerElement: '#videosc .container',
					triggerHook: 'onLeave',
					offset: -200
				})
				.setTween(tl)
				.addTo(globalController);
			});
		},
		PageLoad: function() {
			setTimeout(function() {
				$("body").removeClass("is-pagetransition");
			}, 100);

			setTimeout(function() {
				$("body").addClass("is-pagetransitionend");
				$('.loader-overlay').hide();
			}, 1400);
		},
		StickyNav: function() {
			var a, b = 0,
					c = $(document),
					d = $(window),
					e = $(".js-navbar");

			a = Modernizr.touch ? 150 : 25, d.scroll(function() {
					var f = $(this).scrollTop();
					if (Math.abs(b - f) >= a && f > 0) {
							if (f > b) {
									c.height() - (c.scrollTop() + d.height()) > 50 ? e.addClass("is-hidden") : e.removeClass("is-hidden")
							} else e.removeClass("is-hidden");

							if (f > 700) {
								e.addClass("show-bg")
							} else {
								e.removeClass("show-bg");
							}

							b = f
					}
			})
		},
		NavTransition: function() {
			$(".menu__link, .header__logo").on("click", function(e) {
				e.preventDefault();

				var href = $(this).attr("href");

				$('.loader-overlay').show();
				$("body").removeClass("is-pagetransitionend");
				$("body").addClass("is-pagetransition");

				setTimeout(function() {
					window.location.href = href;
				}, 600)
			});
		},
		AnimateSlogan: function() {
			var slogan = $('#welcome-slogan'),
				animatedWord = slogan.find('.is-animate'),
				words = ['City', 'Живи', 'Працюй', 'Навчайся', 'Відпочивай'],
				timing = 4000;

			function iterateWords() {
				for(var i = 0; i < words.length; i++) {
					(function(index) {

						setTimeout(function() {
							(index === 0) ? animatedWord.css('color', '#fff') : animatedWord.css('color', '#f7901e');

							var splitWord = words[index].split('').map(function(el) {
								return '<i>' + el + '</i>';
							}).join('');

							animatedWord.html(splitWord).find('i').each(function(i) {
								var self = $(this);
								setTimeout(function() {
									self.addClass('is-visible');
								}, (i + 1) * 100);
							});
						}, index * timing);

					})(i);
				}
			}

			iterateWords();

			setInterval(function() {
				iterateWords();
			}, words.length * timing);
		},
		AnimateIcons: function() {
		if (!Modernizr.touchevents) {
				var b = new TimelineMax;

				b.add([TweenMax.to(".js-ic-a__icon--circle", 1, {
						marginLeft: "-41.5%",
						marginTop: "34%",
						rotation: 360
				}), TweenMax.to(".js-ic-a__icon--rhomb", 1, {
						marginLeft: "-15.5%",
						marginTop: "25%",
						rotation: 360
				}), TweenMax.to(".js-ic-a__icon--star", 1, {
						marginLeft: "9%",
						marginTop: "16%",
						rotation: 360
				}), TweenMax.to(".js-ic-a__icon--stop", 1, {
						marginLeft: "34%",
						marginTop: "7%",
						rotation: 360
				})]);
				new ScrollMagic.Scene({
						triggerElement: ".js-ic-a",
						duration: 400
				}).setTween(b).addTo(globalController)
			}
		},
		SmoothScrolling: function() {
			$(document).on('click touchstart', 'a.page-scroll', function (e) {
				e.preventDefault();
				$('.js_mobile-nav').removeClass('open');

				var $anchor = $(this);
				$('html, body').stop().animate({
					scrollTop: $($anchor.attr('href')).offset().top
				}, 1500);

			});
		}
	}

	var modalVideo = {
		$self: $(this),
		className: '.modal__video',
		linkClassName: '.modal__link',
		modalBtn: '.modal__close',
		activeClass: 'open',
		init: function () {
			$(document).on('click', this.linkClassName, function (e) {
				e.preventDefault();
				modalVideo.open($(this).data('url'));
			});
			$(document).on('click', this.modalBtn, function () {modalVideo.close();});
		},
		open: function (data_url) {
			$(this.className).addClass(this.activeClass);

			data_url = modalVideo.youtubeParser(data_url);
			data_url = "//www.youtube.com/embed/" + data_url + '?autoplay=1';

			$(this.className).prepend($("<iframe />")
				.attr({ width: '100%', height:'100%', src: data_url, frameborder: 0, "allowfullscreen": "" }));
		},
		close: function () {
			$(this.className).removeClass(this.activeClass);
			$(this.className).find('iframe').remove();
		},
		toggle: function () {
			$(this.className).hasClass(this.activeClass) ? this.close() : this.open();
		},
		youtubeParser: function(url){
			var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
			var match = url.match(regExp);
			return (match&&match[7].length==11)? match[7] : false;
		}
	};

}(window.jQuery, window, document));
