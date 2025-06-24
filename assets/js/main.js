/*
	Broadcast by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/

// Gestion du loader (pieuvre tournante par exemple)
window.addEventListener('load', function () {
	setTimeout(function () {
		document.body.classList.add('loaded');
	}, 1000); // délai de 1 seconde après le chargement
});

(function($) {

	$(function() {

		var	$window = $(window),
			$body = $('body');

		// Désactiver les animations/transitions avant chargement
		$body.addClass('is-loading');

		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-loading');
			}, 100);
		});

		// Placeholder polyfill
		$('form').placeholder();

		// Priorité des éléments importants sur medium
		skel.breakpoints({
			xlarge: '(max-width: 1680px)',
			large:  '(max-width: 1280px)',
			medium: '(max-width: 980px)',
			small:  '(max-width: 736px)',
			xsmall: '(max-width: 480px)'
		});

		skel.on('+medium -medium', function() {
			$.prioritize(
				'.important\\28 medium\\29',
				skel.breakpoint('medium').active
			);
		});

		// Menu mobile
		$('#menu')
			.append('<a href="#menu" class="close"></a>')
			.appendTo($body)
			.panel({
				delay: 500,
				hideOnClick: true,
				hideOnSwipe: true,
				resetScroll: true,
				resetForms: true,
				side: 'right'
			});

		// Banner vidéo
		var $banner = $('#banner');

		if ($banner.length > 0) {

			// Fix IE
			if (skel.vars.IEVersion < 12) {

				$window.on('resize', function() {

					var wh = $window.height() * 0.60,
						bh = $banner.height();

					$banner.css('height', 'auto');

					window.setTimeout(function() {
						if (bh < wh)
							$banner.css('height', wh + 'px');
					}, 0);

				});

				$window.on('load', function() {
					$window.triggerHandler('resize');
				});
			}

			// Vidéo dynamique
			var video = $banner.data('video');

			if (video)
				$window.on('load.banner', function() {
					$window.off('load.banner');

					if (!skel.vars.mobile
					&& !skel.breakpoint('large').active
					&& skel.vars.IEVersion > 9)
						$banner.append('<video autoplay loop><source src="' + video + '.mp4" type="video/mp4" /><source src="' + video + '.webm" type="video/webm" /></video>');
				});

			// Bouton "découvrir"
			$banner.find('.more').addClass('scrolly');
		}

		// Onglets (flex-tabs)
		$('.flex-tabs').each(function() {

			var t = $(this),
				tab = t.find('.tab-list li a'),
				tabs = t.find('.tab');

			tab.click(function(e) {
				var x = $(this),
					y = x.data('tab');

				tab.removeClass('active');
				x.addClass('active');

				tabs.removeClass('active');
				t.find('.' + y).addClass('active');

				e.preventDefault();
			});

		});

		// Smooth scroll
		if ($(".scrolly").length) {
			var $height = $('#header').height();
			$('.scrolly').scrolly({ offset: $height });
		}

	});

})(jQuery);
	window.addEventListener('load', function () {
		var c = document.getElementById('c-footer');
		if (!c) return; // sécurise si le footer est absent

		var $ = c.getContext('2d'),
			w = c.width = c.offsetWidth,
			h = c.height = c.offsetHeight,
			pieuvreImg = new Image();

		pieuvreImg.src = 'images/Logo.png';
		// Initialiser le son d'éclatement
		var bubbleSound = new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/630634/bubble.mp3');
		bubbleSound.preload = 'auto';

		var i, bubblesNumber = w * h > 300000 ? 100 : 50,
			objects = [],
			maxRadius = w * h > 300000 ? 30 : 20,
			maxYVelocity = 1.5;

		// Palette réaliste (transparente, lumineuse, type bulle)
		const realisticColors = [
			'rgba(255, 255, 255, 0.05)',
			'rgba(255, 255, 255, 0.08)',
			'rgba(200, 225, 255, 0.1)',
			'rgba(180, 200, 255, 0.12)',
			'rgba(255, 255, 255, 0.06)'
		];

		function randomInRange(min, max) {
			return Math.random() * (max - min) + min;
		}

		function Vector(x, y) {
			this.x = x || 0;
			this.y = y || 0;
		}

		Vector.prototype.add = function (v) {
			this.x += v.x;
			this.y += v.y;
			return this;
		};

		Vector.prototype.multiply = function (value) {
			this.x *= value;
			this.y *= value;
			return this;
		};

		Vector.prototype.getMagnitude = function () {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		};

		function Fragment(position, velocity, radius, color) {
			this.position = position;
			this.velocity = velocity;
			this.startSpeed = this.velocity.getMagnitude();
			this.radius = radius;
			this.color = color;
		}

		Fragment.prototype.update = function (world) {
			this.velocity.multiply(world.physicalProperties.friction);
			this.position.add(this.velocity);
			this.radius *= this.velocity.getMagnitude() / this.startSpeed;
			if (this.radius < 0.1) {
				world.objects.splice(world.objects.indexOf(this), 1);
			}
		};

		Fragment.prototype.render = function ($) {
			$.beginPath();
			$.fillStyle = this.color;
			$.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
			$.fill();
		};

		function Bubble(x, y, speed, radius, fragments, swing, color) {
			this.x = x;
			this.y = y;
			this.startX = this.x;
			this.speed = speed;
			this.radius = radius;
			this.fragments = fragments;
			this.swing = swing;
			this.color = color;
		}

		Bubble.prototype.update = function (world) {
			this.x = this.startX + Math.cos(this.y / 80) * this.swing;
			this.y += this.speed;
			if (this.y + this.radius < 0) {
				this.y = world.physicalProperties.height + this.radius;
			}
		};

		Bubble.prototype.render = function ($) {
			$.beginPath();
			$.fillStyle = this.color;
			$.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			$.fill();
		};

		Bubble.prototype.pop = function (world) {
			world.objects.splice(world.objects.indexOf(this), 1);
			for (var i = 0; i < this.fragments; i++) {
				world.objects.push(
					new Fragment(
						new Vector(this.x, this.y),
						new Vector(randomInRange(-2, 2), randomInRange(-2, 2)),
						randomInRange(2, this.radius / 4),
						this.color
					)
				);
			}
		};
		function Pieuvre(x, y, speed, size, swing) {
			this.x = x;
			this.y = y;
			this.startX = this.x;
			this.speed = speed;
			this.size = size;
			this.swing = swing;
			this.img = pieuvreImg;
		}
		
		Pieuvre.prototype.update = function(world) {
			this.x = this.startX + Math.cos(this.y / 80) * this.swing;
			this.y += this.speed;
			if (this.y + this.size < 0) {
				this.y = world.physicalProperties.height + this.size;
			}
		};
		
		Pieuvre.prototype.render = function($) {
			$.save();
			$.globalAlpha = 0.6; // effet un peu fantomatique
			$.drawImage(this.img, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
			$.restore();
		};
		function World(physicalProperties, objects, ctx, background) {
			this.physicalProperties = physicalProperties;
			this.objects = objects;
			this.ctx = ctx;
			this.background = background;
			this.frameID = 0;
		}

		World.prototype.update = function () {
			for (var i = 0; i < this.objects.length; i++) {
				this.objects[i].update(this);
			}
		};

		World.prototype.render = function () {
			this.ctx.clearRect(0, 0, this.physicalProperties.width, this.physicalProperties.height);
			if (this.background) {
				this.ctx.fillStyle = this.background;
				this.ctx.fillRect(0, 0, this.physicalProperties.width, this.physicalProperties.height);
			}
			for (var i = 0; i < this.objects.length; i++) {
				this.objects[i].render(this.ctx);
			}
		};

		World.prototype.animate = function () {
			this.update();
			this.render();
			this.frameID = requestAnimationFrame(this.animate.bind(this));
		};

		for (i = 0; i < bubblesNumber; i++) {
			if (i % 40 === 0) { // ~7% des bulles sont des pieuvres
				objects.push(
					new Pieuvre(
						Math.random() * w,
						Math.random() * h,
						-randomInRange(0.3, 1),
						randomInRange(20, 60), // taille
						randomInRange(-30, 30)
					)
				);
			} else {
				objects.push(
					new Bubble(
						Math.random() * w,
						Math.random() * h,
						-randomInRange(0.5, maxYVelocity),
						randomInRange(5, maxRadius),
						randomInRange(7, 10),
						randomInRange(-40, 40),
						realisticColors[Math.floor(Math.random() * realisticColors.length)]
					)
				);
			}
		}

		var world = new World(
			{
				width: c.width,
				height: c.height,
				friction: 0.997
			},
			objects,
			$,
			'transparent'
		);

		$.globalCompositeOperation = 'lighter';
		world.animate();

		// Interaction souris (clic)
		c.addEventListener('click', function (e) {
			const rect = c.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			for (var i = 0; i < world.objects.length; i++) {
				var o = world.objects[i];
				if (
					typeof o.pop === 'function' &&
					mouseX > o.x - o.radius && mouseX < o.x + o.radius &&
					mouseY > o.y - o.radius && mouseY < o.y + o.radius
				) {
					o.pop(world);
					bubbleSound.currentTime = 0;
					bubbleSound.play();
				}
			}
		});

		// Interaction tactile
		c.addEventListener('touchstart', function (e) {
			const rect = c.getBoundingClientRect();
			const touchX = e.touches[0].clientX - rect.left;
			const touchY = e.touches[0].clientY - rect.top;

			for (var i = 0; i < world.objects.length; i++) {
				var o = world.objects[i];
				if (
					typeof o.pop === 'function' &&
					touchX > o.x - o.radius && touchX < o.x + o.radius &&
					touchY > o.y - o.radius && touchY < o.y + o.radius
				) {
					o.pop(world);
					bubbleSound.currentTime = 0;
					bubbleSound.play();
				}
			}
		});

		// Resize dynamique
		window.addEventListener('resize', function () {
			w = world.physicalProperties.width = c.width = c.offsetWidth;
			h = world.physicalProperties.height = c.height = c.offsetHeight;
			$.globalCompositeOperation = 'lighter';
		});
	});