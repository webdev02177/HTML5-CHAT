(function($) {
	$.fn.drags = function(opt) {

		opt = $.extend({
			handle: "",
			cursor: "move",
			zIndex: 14999,
			onDrop: null,
			onMove: null
		}, opt);

		if (opt.handle === "") {
			var $el = this;
		} else {
			var $el = this.find(opt.handle);
		}

		$el.css('cursor', opt.cursor).on("mousedown", function(e) {
			if (opt.handle === "") {
				var $drag = $(this).addClass('draggable');
			} else {
				var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
			}
			var z_idx = $drag.css('z-index'),
				drg_h = $drag.outerHeight(),
				drg_w = $drag.outerWidth(),
				pos_y = $drag.offset().top + drg_h - e.pageY,
				pos_x = $drag.offset().left + drg_w - e.pageX;
			$drag.css('z-index', opt.zIndex).parents().on("mousemove", function(e) {
				var wndWidth = $drag.outerWidth();
				var wndHeight = $drag.outerHeight();
				var screenWidth = $(window).width();
				var screenHeight = $(window).height();
				var posTop = e.pageY + pos_y - drg_h;
				var posLeft = e.pageX + pos_x - drg_w;
				var viewLeft = $(document).scrollLeft();
				var viewTop = $(document).scrollTop();
				
				if (posLeft < viewLeft)
				{
					posLeft = viewLeft;
				}
				
				var i = (viewLeft + screenWidth - wndWidth);
				
				if (posLeft > i)
				{
					posLeft = i;
				}
				
				if (posTop < viewTop)
				{
					posTop = viewTop;
				}
				
				i = (viewTop + screenHeight - wndHeight);
				
				if (posTop > i)
				{
					posTop = i;
				}
				
				$('.draggable').offset({
					top: posTop,
					left: posLeft
				}).on("mouseup", function() {
					$(this).removeClass('draggable').css('z-index', z_idx);
				});
				
				if (typeof opt.onMove === "function") {
					opt.onMove();
				}
			});
			e.preventDefault(); // disable selection
		}).on("mouseup", function() {
			if (opt.handle === "") {
				$(this).removeClass('draggable');
			} else {
				$(this).removeClass('active-handle').parent().removeClass('draggable');
			}
			if (typeof opt.onDrop === "function") {
				opt.onDrop();
			}
		});

	}
})(jQuery);