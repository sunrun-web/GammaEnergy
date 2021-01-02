(function($) {
	"use strict";

	//Make section and nav visible
	$(window).load(function(){
		$('section').addClass('visible');
		$('nav#main').addClass('visible');
	});
	
	//Link functions
	$('a').click(function(e){
		$('.active').removeClass('active');
		//Anchor link
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
		        $('html,body').animate({
		          scrollTop: target.offset().top
		        }, 500);
	      	}
	    }
	    //Transition link
	    if (this.getAttribute("href").charAt(0) !== "#" && this.getAttribute('class') !== 'item') {
			var link = $(this).attr('href');
			$('section').removeClass('visible');
			$('nav#main').removeClass('visible');
			setTimeout(goToLink,300,link);
		}  
		e.preventDefault();
	});

	//Go to link
	function goToLink(link){
		window.location = link;
	}

	//Fixed menu
	$('nav#main').affix({
      offset: {
        top: function() { return $(window).height()-80; }
      }
	});

	//Toggle menu
	$('.toggle-menu').click(function(e){
		e.stopPropagation();
		$('nav#main ul').toggleClass('open');
	});

	$('html').click(function(){
		$('nav#main ul').removeClass('open');
	});


	//Portfolio functions
	var overlayImage = $('.overlay img');
	var overlayIframe = $('.overlay iframe');
	var curItem;

	$('a.item').click(function(e){
		e.stopPropagation();
		e.preventDefault();
		$('.overlay').fadeIn();
		curItem = $(this);
		lightboxInit(curItem);

	});

	//Init lightbox
	function lightboxInit(el){

		overlayImage.fadeOut(0);
		overlayIframe.fadeOut(0);
		overlayIframe.attr('src', '');
		overlayImage.attr('src', '');

		var url = el.attr('href');
		var videoUrl = el.attr('data-video');
		var videoType = el.attr('data-type');
		var videoW = el.attr('data-width');
		var videoH = el.attr('data-height');
		var prevItemExists = el.parent().prev().find('a').hasClass('item');
		var nextItemExists = el.parent().next().find('a').hasClass('item');

		if(!prevItemExists){
			$('.overlay .prev').fadeOut(250);
		} else {
			$('.overlay .prev').fadeIn(250);
		}

		if(!nextItemExists){
			$('.overlay .next').fadeOut(250);
		} else {
			$('.overlay .next').fadeIn(250);
		}

		if(videoType){
			overlayIframe.css({ 'width' : videoW, 'height': videoH });
		}
		if(videoType == 'vimeo'){
			overlayIframe.attr('src', 'http://player.vimeo.com/video/'+videoUrl+'').load(function(){
				overlayIframe.fadeIn(600);
			});
		}
		if(videoType == 'youtube'){
			overlayIframe.attr('src', 'http://www.youtube.com/embed/'+videoUrl+'').load(function(){
				overlayIframe.fadeIn(600);
			});
		}
		else if(!videoType){
			overlayImage.attr('src', url).load(function(){
				overlayImage.fadeIn(600);
			});
		}
	}

	//Next button
	$('.overlay .next').click(function(){
		curItem = curItem.parent().next().find('a.item');
		$('.overlay .prev').fadeIn();
		if(curItem){
			overlayImage.fadeOut(600);
			overlayIframe.fadeOut(600);
			setTimeout(lightboxInit,600,curItem);
		}
	});

	//Previous button
	$('.overlay .prev').click(function(){
		curItem = curItem.parent().prev().find('a.item');
		$('.overlay .next').fadeIn();
		if(curItem){
			overlayImage.fadeOut(600);
			overlayIframe.fadeOut(600);
			setTimeout(lightboxInit,600,curItem);
		}
	});

	//Close button
	$('.overlay .fa-times').click(function(){
		overlayIframe.attr('src', '');
		overlayImage.attr('src', '');
		$('.overlay').fadeOut(300);
	});

	//Scroll function
	$('.posts-container').perfectScrollbar({
		wheelSpeed: 20,
 		suppressScrollY: true,
 		includePadding: true
	});

	$('.content').perfectScrollbar({
		suppressScrollX: true,
		wheelSpeed: 5
	});

	$('.posts .post').each(function(i){
		var count = i;
		$('.posts').css('width', 359*count+'px');
		$('.posts-container').perfectScrollbar('update');
	});

	$(window).resize(function(){
		isVisible();
		$('.posts-container').perfectScrollbar('update');
		$('.content').perfectScrollbar('update');
		$('body').find('.comments').perfectScrollbar('update');
	});

	var scrolledX = 0;

	$('.control-left').click(function(){
		var posts = $('.posts');
		var postsW = posts.width();
		if(scrolledX < 0){
			scrolledX = scrolledX + 259;
			posts.stop().animate({'left' : scrolledX}, 350);
		} else {
			
		}
		setTimeout(isVisible,350);
	});

	$('.control-right').click(function(){
		var posts = $('.posts');
		var postsW = posts.width();
		var wW = $(window).width();
		if((scrolledX) > (-postsW+wW+259)){
			scrolledX = scrolledX - 259
			posts.stop().animate({'left' : scrolledX}, 350);
		} else {
		}
		setTimeout(isVisible,350);
	});

	$('.posts-container').hover(function(){
		$('.controls-container').addClass('hover');
	}, function(){

	});

	$('.controls-container').hover(function(){

	}, function(){
		$('.controls-container').removeClass('hover');
	});

	isVisible();

	function isVisible(){
		$('.posts .post').each(function(i){
			if(isElementInViewport ($(this)))
				$(this).addClass('visible');
			else {
				$(this).removeClass('visible');
			}
		});	
	}

	$('.control-left, .control-right').hover(function(){
		$('.posts').removeClass('blurred');
	});

	var zIndex = $('.post-content').css('z-index');
	var post = $('.post-content');

	$('.post').click(function(){
		$('.posts .post').removeClass('active');
		$('.post-comments').removeClass('visible');
		var p = $(this).find('.content').html();
		var h = $(this).find('h3').html();
		var c = $(this).find('.data .comments').html();
		var d = $(this).find('.data .date').html();
		$(this).addClass('active');
		post.removeClass('visible').delay(300).show(0, function(){
			post = $('<div class="post-content"><div class="handle"><h2>'+h+'</h2><div class="fa fa-times close-content-container"></div></div><div class="content">'+p+'</div><div class="foot"><a href="#" class="info show-comments"><div class="glyphicon glyphicon-comment"></div> Comments ('+c+')</a><div class="info glyphicon glyphicon-calendar">'+d+'</div></div></div>');
			zIndex++;
			post.css({'z-index': zIndex});
			$('.post-content-container').append(post);
			post.find('.content').perfectScrollbar({
				suppressScrollX: true,
				wheelSpeed: 5,
				includePadding: true
			});
			post.addClass('visible');
			setTimeout(updateScrollbar, 300);
		});
	});

	function updateScrollbar() {
		$('.content').perfectScrollbar('update');
	}

	$('body').on('click', '.close-content-container', function(){
		$(this).parent().parent().removeClass('visible');
		$('.posts').removeClass('blurred');
		$('.post-comments').removeClass('visible');
	});

	$('.posts-container').hover(function(){
		$('.posts').removeClass('blurred');
	});

	//Check if post thumbnail is inside the viewport
	function isElementInViewport (el) {

	    if (el instanceof jQuery) {
	        el = el[0];
	    }

	    var rect = el.getBoundingClientRect();

	    return (
	        rect.top >= 0 &&
	        rect.left >= 0 &&
	        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && 
	        rect.right <= (window.innerWidth || document.documentElement.clientWidth) 
	    );
	}

	$('body').on('click', '.show-comments', function(e){
		$('.post-comments').addClass('visible');
		$('body').find('.comments').perfectScrollbar({
	 		suppressScrollX: true,
	 		includePadding: true
		});
		e.preventDefault();
	});

	$('body').on('click', '.write', function(e){
		$('.overlay').fadeIn(400);
		e.preventDefault();
	});

})(jQuery);
