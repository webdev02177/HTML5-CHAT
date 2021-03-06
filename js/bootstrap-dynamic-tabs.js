/*!
 * Bootstrap Dynamic Tabs v1.0.3 (https://github.com/JayrAlencar/bootstrap-dynamic
 */
isMobile = function() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};


(function ( $ ) {
	var tabs = [];
	$.fn.bootstrapDynamicTabs = function(options) {
		var settings = $.extend({
			// These are the defaults.K
		}, options );
		this.append($('<ul/>', {class: 'nav nav-tabs'}));

		if(this.find('.tab-content').length===0){
			this.append($('<div/>', {class: 'tab-content'}));
		}

		$(document).on('click','ul.nav.nav-tabs li', function(e) {
			e.stopPropagation();
			$(document).trigger('tabChanged', $.fn.getCurrent() );
		});
		return this;
	};

	$.fn.closeAll = function(){
		tabs = [];
		this.find('.nav-tabs').empty();
		this.find('.tab-content').empty();
	};

	$.fn.addTab = function(options){
		//console.log('ADD TAB');

		var settings = $.extend({
			title: '',
			closable: true,
			room:false,
			roomid:0,
			label:'',
			istemp:false,
			selected:true
		}, options );

		if(!settings.id){
			settings.id = (settings.title);
		} else{
			settings.id = (settings.id);
		}
		var tabAlreadyExist = false;

		if(tabs.indexOf(settings.id)>=0) {
			tabAlreadyExist = true;
			var aba = this.find('.nav-tabs').find('li').find('a[href="#' + settings.id + '"]');
			aba.tab('show');
			$(settings.id).tab('show');
			//console.log('TAB ALREADY ');

		} else {
			tabs.push(settings.id);
			var btn_close = $('<button/>',{
				class: 'close',
				type: 'button'
			}).html('<i class="fa fa-times" aria-hidden="true"></i>').click(function() {
				var closer = $(this);
				// test if last to be closed

				var closable = $('a i.fa.fa-home').length + $('a img.home-tab').length;
				if (closable<=1 && ($(this).parent().data('room'))) {
					return;
				}
				// bug
				var activeTabClosed= $(this).parent();
				var roomClosed = {id:activeTabClosed.data('id'), roomid: activeTabClosed.data('roomid'),
					room:activeTabClosed.data('room'), label:activeTabClosed.data('label'), istemp:activeTabClosed.data('istemp')
				};

				$(document).trigger('tabClosed', roomClosed);
				var a = closer.parent();
				var href = a.attr('href');
				a.parent().remove();
				var ativo = $(href).hasClass('active');
				$(href).remove();
				var idx = href.substring(1);
				tabs.splice(tabs.indexOf(idx),1);
				if(ativo){
					$('.nav-tabs li:eq(0) a').tab('show');
				}
				$(document).trigger('tabChanged', $.fn.getCurrent());
			});
			if (settings.selected) {
				this.find('.active').removeClass('active');
			}

			var ancora = $('<a/>',{
				href: '#'+settings.id,
				'data-toggle': 'tab',
				'data-room': settings.room,
				'data-roomid': settings.roomid,
				'data-id':settings.id,
				'data-label':settings.label,
				'data-istemp':settings.istemp
			});

			if(settings.closable){
				ancora.mousedown(function(e) {
					if(e.which === 2){
						var a = $(this);
						var href = a.attr('href');
						a.parent().remove();
						var ativo = $(href).hasClass('active');
						$(href).remove();
						var idx = href.substring(1);
						tabs.splice(tabs.indexOf(idx),1);
						if(ativo){
							$('.nav-tabs li:eq(0) a').tab('show');
						}
						return false;
					}
				});
			}

			if(settings.icon){
				ancora.append($('<i/>').addClass(settings.icon)).append(' ');
			}
			if(settings.closable){
				ancora.append(btn_close);
			}
			ancora.append(settings.title);

			if (settings.selected) {
				this.find('.nav-tabs:eq(0)').append($('<li/>', {class:'active'}).append(ancora));
				this.find('.tab-content').append($('<div/>', {
					class:'tab-pane active',
					id: settings.id
				}));
			} else {
				this.find('.nav-tabs').append($('<li/>', {class:''}).append(ancora));
				this.find('.tab-content').append($('<div/>', {
					class:'tab-pane ',
					id: settings.id
				}));
			}

			var pagina = this.find('.tab-content').find('#'+settings.id);
			if(settings.text){
				pagina.text(settings.text);
			}
			if(settings.html){
				pagina.html(settings.html);
			}
			// make it draggable !
			if (!isMobile()) {
				this.find('.nav.nav-tabs').sortable();
			}
		}
		if (!tabAlreadyExist) {
			//$(document).trigger('tabChanged', $.fn.getCurrent() );
		}


		if (!settings.selected) {
			//$.fn.getCurrent().removeClass('active');
		}
		return this;
	};

	$.fn.selectById = function(id) {
		var $tab = $('li a[data-id="room_' + id + '"]');
		$tab.click();
		return ($tab.length>0);
	};
	$.fn.getById = function(id) {
		var $tab = $('li a[data-id="room_' + id + '"]');
		if ($tab.length) {
			return ($tab);
		}
		var $tab = $('li a[data-id="' + id + '"]');
		return $tab;
	};



	$.fn.getCurrent = function() {
		var active = $("ul.nav.nav-tabs li.active a");
		var o = {id:active.data('id'), roomid: active.data('roomid'), room:active.data('room'), label:active.data('label'), istemp:active.data('istemp')};
		return o;
	};


	$.fn.closeById = function(id){
		var a = this.find('.nav-tabs').find('a[href="#'+id+'"]');
		var href = a.attr('href');
		a.parent().remove();
		var active = $(href).hasClass('active');
		if (!href) {
			return;
		}
		$(href).remove();
		var idx = href.substring(1);
		tabs.splice(tabs.indexOf(idx),1);
		if(active){
			$('.nav-tabs li:eq(0) a').tab('show');
		}
		$(document).trigger('tabChanged', $.fn.getCurrent() );
	};

	$.fn.closeActive = function(){
		var a = this.find('.nav-tabs').find('.active').find('a');
		var href = a.attr('href');
		a.parent().remove();
		var ativo = $(href).hasClass('active');
		$(href).remove();
		var idx = href.substring(1);
		tabs.splice(tabs.indexOf(idx),1);
		if(ativo){
			$('.nav-tabs li:eq(0) a').tab('show');
		}
		$(document).trigger('tabChanged', $.fn.getCurrent() );
	};
}( jQuery ));
