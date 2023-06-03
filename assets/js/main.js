/*
Theme Name: Profilekit
Description: Bootstrap Personal Portfolio Resume Template
Author: Erilisdesign
Theme URI: https://preview.erilisdesign.com/html/profilekit/
Author URI: https://themeforest.net/user/erilisdesign
Version: 1.0.0
License: https://themeforest.net/licenses/standard
*/

/*------------------------------------------------------
[Table of contents]

1. Loader
2. Website slider
3. Navigation
4. Back to top
5. Layout resize
6. Backgrounds
7. Masonry
8. Lightbox
9. Countdown
10. Subscribe Form
11. Contact Form
12. Bootstrap
13. Typed text
14. Slider
------------------------------------------------------*/

(function($){
  "use strict";

  // Vars
  var $html = $('html'),
    $body = $('body'),
    slideAnimaionRun = false,
    $siteNavbar = $('.site-navbar'),
    $siteNavbarCollapse = $('.site-navbar #navbarCollapse'),
    $siteNavbarToggler = $('.site-navbar .navbar-toggler-alternative'),
    siteNavbar_base = $siteNavbar.attr('data-navbar-base') ? $siteNavbar.attr('data-navbar-base') : '',
    siteNavbar_toggled = $siteNavbar.attr('data-navbar-toggled') ? $siteNavbar.attr('data-navbar-toggled') : '',
    siteNavbar_scrolled = $siteNavbar.attr('data-navbar-scrolled') ? $siteNavbar.attr('data-navbar-scrolled') : '',
    siteNavbar_expand = 992,
    siteNavbar_dropdownHover = true,
    $btn_backToTop = $('.btn-back-to-top'),
    $websiteSliderInner = $('.website-slider-inner'),
    $websiteSliderItem = $('.website-slider-item');

  // Analyze Devices and Browsers
  window.isMobile = false;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) { window.isMobile = true; }

  //Detect Browser
  window.isMSIE = navigator.userAgent.match('MSIE');
  window.isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream !== null;

  function getWindowWidth(){
    return Math.max($(window).width(), window.innerWidth);
  }

  function getWindowHeight(){
    return Math.max($(window).height(), window.innerHeight);
  }

  function getDocumentWidth(){
    return Math.max($(document).width(), document.body.clientWidth);
  }

  // [1. Loader]
  window.addEventListener( 'load', function(){
    document.querySelector('body').classList.add('loaded');
  });

  // [2. Website slider]
  function websiteSlider_layout(){
    if( !$websiteSliderItem.length > 0 )
      return;

    var websiteSliderItemLength = $websiteSliderItem.length,
      websiteSliderItemsWidth = websiteSliderItemLength * getDocumentWidth();

    $websiteSliderItem.css( 'width', getDocumentWidth() );
    $websiteSliderInner.css( 'width', websiteSliderItemsWidth );

    $websiteSliderItem.each(function(){
      var height = $(this).find('.website-slider-item-inner').innerHeight();

      $(this).css( 'height', height );
    });
  }

  function websiteSlider_resize(){
    if( !$websiteSliderItem.length > 0 )
      return;

    if( slideAnimaionRun )
      return;

    var $currentSlide = $('.website-slider-item.active').length > 0 ? $('.website-slider-item.active') : $websiteSliderItem.first(),
      position = $currentSlide.length > 0 ? $currentSlide.index() : 0,
      move = position * getDocumentWidth(),
	  currentSlide_height = parseInt( $currentSlide.find('.website-slider-item-inner').innerHeight(), 10 ),
      websiteSliderInner_padding = parseInt( $websiteSliderInner.css('padding-bottom'), 10 ),
      websiteSliderInner_height = currentSlide_height + websiteSliderInner_padding;
    if ( position > 0 ){
      move = move * -1;
    }

    $websiteSliderInner.css({
      'height': websiteSliderInner_height,
      'transform': 'translate3d('+move+'px, 0px, 0px)'
    });
  }

  function websiteSlider_showSlide(target){
    if( !$(target).length > 0 && !$(target).hasClass('website-slider-item') )
      return;

    if( slideAnimaionRun )
      return;

    if ( $(target).hasClass('active') )
      return;

    slideAnimaionRun = true;

    var position = $(target).index(),
      move = position * getDocumentWidth(),
      target_height = parseInt( $(target).find('.website-slider-item-inner').innerHeight(), 10 ),
      websiteSliderInner_padding = parseInt( $websiteSliderInner.css('padding-bottom'), 10 ),
      websiteSliderInner_height = target_height + websiteSliderInner_padding,
      $lastSlide = $('.website-slider-item.active');
    if ( position > 0 ){
      move = move * -1;
    }

    if( $(window).scrollTop() === 0 ){
      $websiteSliderItem.removeClass('last active');
      $lastSlide.addClass('last');
      $websiteSliderInner.css({
        'height': websiteSliderInner_height,
        'transform': 'translate3d('+move+'px, 0px, 0px)'
      });
      $('.site-navbar li a').removeClass('active');
      $('.website-slider-nav li a').removeClass('active');
      $('.site-navbar a[href="'+target+'"]').addClass('active');
      $('.website-slider-nav a[href="'+target+'"]').addClass('active');
      setTimeout(function(){
        $(target).addClass('active');

        slideAnimaionRun = false;
      }, 800);
    } else {
      smoothScroll(0);

      setTimeout(function(){
        $websiteSliderItem.removeClass('last active');
        $lastSlide.addClass('last');
        $websiteSliderInner.css({
          'height': websiteSliderInner_height,
          'transform': 'translate3d('+move+'px, 0px, 0px)'
        });
        $('.site-navbar li a').removeClass('active');
        $('.website-slider-nav li a').removeClass('active');
        $('.site-navbar a[href="'+target+'"]').addClass('active');
        $('.website-slider-nav a[href="'+target+'"]').addClass('active');
        setTimeout(function(){
          $(target).addClass('active');

          slideAnimaionRun = false;
        }, 800);
      }, 800);
    }
  }

  function websiteSlider_showFirstSlide(){
    if( !$websiteSliderItem.length > 0 )
      return;

    var windowHash = window.location.hash ? window.location.hash : '',
      loadSlide;

    if( windowHash !== '#' && windowHash !== '#!' && $(windowHash).length > 0 && $(windowHash).hasClass('website-slider-item') ){
      loadSlide = windowHash;
    } else {
      loadSlide = '#' + $websiteSliderItem.first().attr('id');
    }

    websiteSlider_showSlide(loadSlide);
  }

  // [3. Navigation]
  function profilekit_navigation(){

    // Close all submenus when dropdown is hiding
    $('.navbar-nav > .dropdown').on('hide.bs.dropdown', function () {
      var $submenus = $(this).find('.dropdown-submenu');

      $submenus.removeClass('show dropdown-target');
      $submenus.find('.dropdown-menu').removeClass('show');
    });

    // Add hovered class
    $('.navbar-nav > .dropdown').on('shown.bs.dropdown', function() {
      if (window.innerWidth > 991) {
        $(this).addClass('hovered');
      } else {
        $(this).removeClass('hovered');
      }
    });

    // Enable clicks inside dropdown
    $(document).on('click', '.navbar-nav > .dropdown', function (e) {
      e.stopPropagation();
    });

    // Dropdown
    var navbarDropdown = document.querySelectorAll('.navbar-nav > .dropdown, .navbar-nav .dropdown-submenu');

    [].forEach.call(navbarDropdown, function(dropdown) {
      'mouseenter mouseleave click'.split(' ').forEach(function(event) {
        dropdown.addEventListener(event, function(e) {
          if (window.innerWidth >= siteNavbar_expand && siteNavbar_dropdownHover === true ) {
            // Hover

            var _this = this;

            if( event === 'mouseenter' ){
              if( _this.classList.contains('dropdown') ){
                var toggle = _this.querySelector('[data-toggle="dropdown"]');

                if( _this.classList.contains('show') ){
                  $(toggle).dropdown('hide');
                  $(toggle).blur();
                } else {
                  $(toggle).dropdown('show');

                  e.stopPropagation();
                }
              } else if( _this.classList.contains('dropdown-submenu') ){
                if( $(_this).parent().find('.dropdown-target') ){
                  $(_this).parent().find('.dropdown-target.dropdown-submenu').removeClass('show dropdown-target');
                }

                _this.classList.add('hovered', 'show', 'dropdown-target');
              }
            } else {
              if( _this.classList.contains('dropdown') ){
                var toggle = _this.querySelector('[data-toggle="dropdown"]');

                $(toggle).dropdown('hide');
                $(toggle).blur();
              } else if( _this.classList.contains('dropdown-submenu') ){
                _this.classList.remove('show', 'dropdown-target');
              }
            }
          } else {
            // Click

            if( event === 'click' && e.target.classList.contains('dropdown-toggle') && e.target.parentNode.classList.contains('dropdown-submenu') ){
              if( e.target.parentNode.classList.contains('dropdown') ){
                return true;
              }

              e.stopPropagation();
              e.preventDefault();

              var _this = e.target,
                ddSubmenu = _this.parentNode,
                ddMenu = _this.nextElementSibling;

              if( ddSubmenu.classList.contains('show') ){

                ddSubmenu.classList.remove('show', 'dropdown-target');
                ddMenu.classList.remove('show');

                if( ddMenu.querySelectorAll('.dropdown-target').length > 0 ){
                  var submenuNodeList = ddMenu.querySelectorAll('.dropdown-target.dropdown-submenu'), i;

                  for (i = 0; i < submenuNodeList.length; ++i) {
                    submenuNodeList[i].classList.remove('show', 'dropdown-target');
                    submenuNodeList[i].querySelector('.dropdown-menu').classList.remove('show');
                  }
                }
              } else {
                if( ddSubmenu.parentNode.querySelectorAll('.dropdown-target').length > 0 ){
                  var submenuNodeList = ddSubmenu.parentNode.querySelectorAll('.dropdown-target.dropdown-submenu'), i;

                  for (i = 0; i < submenuNodeList.length; ++i) {
                    submenuNodeList[i].classList.remove('show', 'dropdown-target');
                    submenuNodeList[i].querySelector('.dropdown-menu').classList.remove('show');
                  }
                }

                ddSubmenu.classList.add('hovered', 'show', 'dropdown-target');
                ddMenu.classList.add('show');
              }
            }
          }
        });
      });
    });

    // Navigation collapse
    $siteNavbarCollapse.on( 'show.bs.collapse', function(){
      $siteNavbar.addClass('navbar-toggled-show');
      $siteNavbarToggler.blur();
      profilekit_navChangeClasses('toggled');
    });

    $siteNavbarCollapse.on( 'hidden.bs.collapse', function(){
      $siteNavbar.removeClass('navbar-toggled-show');
      $siteNavbarToggler.blur();

      if ( $siteNavbar.hasClass('scrolled') ){
        profilekit_navChangeClasses('scrolled');
      } else {
        profilekit_navChangeClasses();
      }
    });

    // Clickable Links
    $(document).on( 'click', 'a.scrollto, .site-navbar a[href^="#"]', function(e){
      var target;

      // Make sure this.hash has a value before overriding default behavior
      if ( this.hash !== '' && this.hash !== '#!' && $( this.hash ).length > 0 ){
        target = this.hash;
      } else {
        return false;
      }

      if( target !== '' ){
        // Prevent default anchor click behavior
        e.preventDefault();

        if( $( target ).length > 0 && $( target ).hasClass('website-slider-item') ){
          websiteSlider_showSlide(target);

          $(this).blur();
        } else {
          var targetPosition = parseInt( Math.max( document.querySelector(target).offsetTop, $(target).offset().top ), 10 );

          smoothScroll(targetPosition);
          $(this).blur();
        }
      }

      return false;
    });

    // Back to top
    $(document).on( 'click', '.btn-back-to-top', function(e){
      e.preventDefault();

      smoothScroll(0);

      $(this).blur();
    });

    // Close nav on click outside of '.sitenav-collapse-inner'
    $(document).on( 'click touchstart', function(e){
      if ( $siteNavbar.is(e.target) || $(e.target).closest('.site-navbar').hasClass('site-navbar') || $(e.target).hasClass('navbar-toggler') || $(e.target).hasClass('navbar-toggler-alternative') ){
        return;
      }

      if ( $siteNavbarToggler.attr('aria-expanded') === 'true' ){
        $siteNavbarToggler.trigger('click');
      }
    });

    // Arrow keys support - left/right
    document.addEventListener( 'keydown', function(e){
      if( !$websiteSliderItem.length > 0 )
        return;

      if ($('input,select,textarea').is(':focus')){
        return;
      }

      if( ( !e.keyCode == 37 || !e.keyCode == 39 ) && e.repeat )
        return;

      var currentPart = $('.website-slider-item.active'),
        target;
      if( currentPart.length === 0 ){
        currentPart = $('.website-slider-item').first();
      }

      if( e.keyCode == 37 && !e.repeat ){ // prev
        target = currentPart.prev().attr('id');
      } else if( e.keyCode == 39 && !e.repeat ){ // next
        target = currentPart.next().attr('id');
      }

      if( target ){
        websiteSlider_showSlide( '#'+ target );
      }
    });

  }

  function smoothScroll(targetPosition){
    $(window).scrollTo(targetPosition,800);
  }

  function profilekit_navOnScroll(){
    if ( $siteNavbar.length > 0 ){
      var currentPos = $(window).scrollTop();
      if( $body.hasClass('flyer-animated') ){
        currentPos = $flyerInner.scrollTop();
      }

      if ( currentPos > 0 ){
        if ( $siteNavbar.hasClass('scrolled') ){
          return;
        }

        $siteNavbar.addClass('scrolled').removeClass('scrolled-0');

        if( $siteNavbar.hasClass('navbar-toggled-show') ){
          profilekit_navChangeClasses('toggled');
        } else {
          profilekit_navChangeClasses('scrolled');
        }
      } else {
        $siteNavbar.removeClass('scrolled').addClass('scrolled-0');

        if( $siteNavbar.hasClass('navbar-toggled-show') ){
          profilekit_navChangeClasses('toggled');
        } else if( $body.hasClass('flyer-open') ){
          profilekit_navChangeClasses('flyer');
        } else {
          profilekit_navChangeClasses();
        }
      }
    }
  }

  var nav_event_old;
  function profilekit_navChangeClasses(nav_event){
    if( nav_event_old === nav_event && !( nav_event == '' || nav_event == undefined ) )
      return;

    if( nav_event === 'toggled' && siteNavbar_toggled ){
      $siteNavbar.removeClass('navbar-light navbar-dark', siteNavbar_base, siteNavbar_scrolled);
      $siteNavbar.addClass(siteNavbar_toggled);
    } else if( nav_event === 'scrolled' && siteNavbar_scrolled ){
      $siteNavbar.removeClass('navbar-light navbar-dark', siteNavbar_base, siteNavbar_toggled);
      $siteNavbar.addClass(siteNavbar_scrolled);
    } else if( nav_event === 'flyer' && $siteNavbar.hasClass('scrolled') && siteNavbar_scrolled ){
      $siteNavbar.removeClass('navbar-light navbar-dark', siteNavbar_base, siteNavbar_toggled);
      $siteNavbar.addClass(siteNavbar_scrolled);
    } else {
      if(siteNavbar_base){
        $siteNavbar.removeClass('navbar-light navbar-dark', siteNavbar_toggled, siteNavbar_scrolled);
        $siteNavbar.addClass(siteNavbar_base);
      }
    }

    if( $siteNavbar.hasClass('navbar-light') ){
      $('[data-on-navbar-light]').each(function(){
        var el = $(this);

        if( el.attr('data-on-navbar-dark') ){
          el.removeClass(el.attr('data-on-navbar-dark'));
        }
        if( el.attr('data-on-navbar-light') ){
          el.addClass(el.attr('data-on-navbar-light'));
        }
      });
    } else if( $siteNavbar.hasClass('navbar-dark') ){
      $('[data-on-navbar-dark]').each(function(){
        var el = $(this);

        if( el.attr('data-on-navbar-light') ){
          el.removeClass(el.attr('data-on-navbar-light'));
        }
        if( el.attr('data-on-navbar-dark') ){
          el.addClass(el.attr('data-on-navbar-dark'));
        }
      });
    }

    nav_event_old = nav_event;
  }

  // [4. Back to top]
  function profilekit_backToTop(){
    if( $btn_backToTop.length > 0 ){
      var currentPos = $(window).scrollTop();
      if( $body.hasClass('flyer-animated') ){
        currentPos = $flyerInner.scrollTop();
      }

      if( currentPos > 400 ){
        $btn_backToTop.addClass('show');
      } else {
        $btn_backToTop.removeClass('show');
      }
    }
  }

  // [5. Layout Resize]
  function profilekit_layoutResize(){
    if( getWindowWidth() >= 1200 ){
      if ( $siteNavbarToggler.attr('aria-expanded') === 'true' ){
        $siteNavbar.removeClass('navbar-toggled-show');
        $siteNavbarCollapse.removeClass('show');
        $siteNavbarToggler.attr('aria-expanded','false');
        $siteNavbarToggler.addClass('collapsed');
        profilekit_navChangeClasses();
      }
    }
  }

  // [6. Backgrounds]
  function profilekit_backgrounds(){

    // Image
    var $bgImage = $('.bg-image-holder');
    if($bgImage.length){
      $bgImage.each(function(){
        var $self = $(this);
        var src = $self.children('img').attr('src');

        $self.css('background-image','url('+src+')').children('img').hide();
      });
    }

    // Video Background
    if ( $body.hasClass('mobile') ){
      $('.video-wrapper').css('display','none');
    }

  }

  // [7. Masonry]
  function profilekit_masonryLayout(){
    if ($('.masonry-container').length > 0) {
      var $masonryContainer = $('.masonry-container'),
        $columnWidth = $masonryContainer.data('column-width');

      if($columnWidth == null){
        var $columnWidth = '.masonry-item';
      }

      $masonryContainer.isotope({
        filter: '*',
        animationEngine: 'best-available',
        resizable: false,
        itemSelector : '.masonry-item',
        masonry: {
          columnWidth: $columnWidth
        },
        animationOptions: {
          duration: 750,
          easing: 'linear',
          queue: false
        }
      });

      // layout Isotope after each image loads
      $masonryContainer.imagesLoaded().progress( function() {
        $masonryContainer.isotope('layout');
      });

      // Update wensite slider layout after a Isotope layout and all positioning transitions have completed.
      var clear_isotope_websiteSlider_layout;
      var clear_isotope_websiteSlider_resize;

      $masonryContainer.on( 'layoutComplete', function( event, filteredItems ){
        clear_isotope_websiteSlider_layout = setTimeout( websiteSlider_layout(), 20 );
        clear_isotope_websiteSlider_resize = setTimeout( websiteSlider_resize(), 20 );
      });
    }

    $('nav.masonry-filter a').on('click', function(e) {
      e.preventDefault();

      var selector = $(this).attr('data-filter');
      $masonryContainer.isotope({ filter: selector });
      $('nav.masonry-filter a').removeClass('active');
      $(this).addClass('active');

      return false;
    });
  }

  // [8. Lightbox]
  function profilekit_lightbox(){
    if(!$().featherlight){
      console.log('Featherlight: featherlight not defined.');
      return true;
    }

    $.extend($.featherlight.defaults, {
      closeIcon: '<i class="fas fa-times"></i>'
    });

    $.extend($.featherlightGallery.defaults, {
      previousIcon: '<i class="fas fa-chevron-left"></i>',
      nextIcon: '<i class="fas fa-chevron-right"></i>'
    });

    $.featherlight.prototype.afterOpen = function(){
      $body.addClass('featherlight-open');
    };

    $.featherlight.prototype.afterContent = function(){
      var title = this.$currentTarget.attr('data-title');
      var text = this.$currentTarget.attr('data-text');

      if( !title && !text )
        return;

      this.$instance.find('.caption').remove();

      var title = title ? '<h4 class="title-gallery">' + title + '</h4>' : '',
        text = text ? '<p class="text-gallery">' + text + '</p>' : '';

      $('<div class="caption">').html( title + text ).appendTo(this.$instance.find('.featherlight-content'));
    };

    $.featherlight.prototype.afterClose = function(){
      $body.removeClass('featherlight-open');
    };
  }

  // [9. Countdown]
  function profilekit_countdown(){
    var countdown = $('.countdown[data-countdown]');

    if (countdown.length > 0){
      countdown.each(function(){
        var $countdown = $(this),
          finalDate = $countdown.data('countdown');
        $countdown.countdown(finalDate, function(event){
          $countdown.html(event.strftime(
            '<div class="countdown-container row"> <div class="col-6 col-sm-auto"><div class="countdown-item"><div class="number">%-D</div><span class="title">Day%!d</span></div></div><div class="col-6 col-sm-auto"><div class="countdown-item"><div class="number">%H</div><span class="title">Hours</span></div></div><div class="col-6 col-sm-auto"><div class="countdown-item"><div class="number">%M</div><span class="title">Minutes</span></div></div><div class="col-6 col-sm-auto"><div class="countdown-item"><div class="number">%S</div><span class="title">Seconds</span></div></div></div>'
          ));
        });
      });
    }
  }

  // [10. Subscribe Form]
  function profilekit_subscribeForm(){
    var $subscribeForm = $('.subscribe-form');

    if ( $subscribeForm.length > 0 ){
      $subscribeForm.each( function(){
        var el = $(this),
          elResult = el.find('.subscribe-form-result');

        el.find('form').validate({
          submitHandler: function(form) {
            elResult.fadeOut( 500 );

            $(form).ajaxSubmit({
              target: elResult,
              dataType: 'json',
              resetForm: true,
              success: function( data ) {
                elResult.html( data.message ).fadeIn( 500 );
                if( data.alert != 'error' ) {
                  $(form).clearForm();
                  setTimeout(function(){
                    elResult.fadeOut( 500 );
                  }, 5000);
                };
              }
            });
          }
        });

      });
    }
  }

  // [11. Contact Form]
  function profilekit_contactForm(){
    var $contactForm = $('.contact-form');

    if ( $contactForm.length > 0 ){
      $contactForm.each( function(){
        var el = $(this),
          elResult = el.find('.contact-form-result');

        el.find('form').validate({
          submitHandler: function(form) {
            elResult.fadeOut( 500 );

            $(form).ajaxSubmit({
              target: elResult,
              dataType: 'json',
              success: function( data ) {
                elResult.html( data.message ).fadeIn( 500 );
                if( data.alert != 'error' ) {
                  $(form).clearForm();
                  setTimeout(function(){
                    elResult.fadeOut( 500 );
                  }, 5000);
                };
              }
            });
          }
        });

      });
    }
  }

  // [12. Bootstrap]
  function profilekit_bootstrap(){

    // Botostrap Tootltips
    $('[data-toggle="tooltip"]').tooltip();

    // Bootstrap Popovers
    $('[data-toggle="popover"]').popover();

  }

  // [13. Typed text]
  function profilekit_typedText(){
    var toggle = document.querySelectorAll('[data-toggle="typed"]');

    function init(el) {
      var elementOptions = el.dataset.options;
          elementOptions = elementOptions ? JSON.parse(elementOptions) : {};
      var defaultOptions = {
        typeSpeed: 40,
        backSpeed: 40,
        backDelay: 3000,
        loop: true
      }
      var options = Object.assign(defaultOptions, elementOptions);

      new Typed(el, options);
    }

    if (typeof Typed !== 'undefined' && toggle) {
      [].forEach.call(toggle, function(el) {
        init(el);
      });
    }

  }

  // [14. Slider]
  function profilekit_slider() {
    var $slider = $('.slider');

    if($slider.length > 0){

      if( !$slider.hasClass('slick-initialized') ){
        $slider.slick({
          slidesToShow: 1,
          infinite: true,
          nextArrow: '<button type="button" class="slick-next"><i class="fas fa-angle-right"></i></button>',
          prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-angle-left"></i></button>'
        });
      }

      if( 1199 >= getWindowWidth() && $slider.hasClass('slick-initialized') && $slider.hasClass('slick-destroy-xl') ){
        $slider.slick('unslick');
      }

      if( 991 >= getWindowWidth() && $slider.hasClass('slick-initialized') && $slider.hasClass('slick-destroy-lg') ){
        $slider.slick('unslick');
      }

      if( 767 >= getWindowWidth() && $slider.hasClass('slick-initialized') && $slider.hasClass('slick-destroy-md') ){
        $slider.slick('unslick');
      }

      if( 575 >= getWindowWidth() && $slider.hasClass('slick-initialized') && $slider.hasClass('slick-destroy-sm') ){
        $slider.slick('unslick');
      }

    }
  }

  $(document).ready(function($){
    $(window).scrollTop(0);
    websiteSlider_layout();

    profilekit_navigation();
    profilekit_navOnScroll();
    profilekit_backToTop();
    profilekit_layoutResize();
    profilekit_backgrounds();
    profilekit_masonryLayout();
    profilekit_lightbox();
    profilekit_countdown();
    profilekit_subscribeForm();
    profilekit_contactForm();
    profilekit_bootstrap();
    profilekit_typedText();
    profilekit_slider();
  });

  $(window).on( 'scroll', function(){
    profilekit_navOnScroll();
    profilekit_backToTop();
  });

  var clear_websiteSlider_layout;
  var clear_websiteSlider_resize;

  window.addEventListener( 'load', function(){
    websiteSlider_layout();
    websiteSlider_showFirstSlide();
  });

  $(window).on('resize', function(){
    profilekit_navOnScroll();
    profilekit_backToTop();
    profilekit_slider();

    clear_websiteSlider_layout = setTimeout( websiteSlider_layout(), 20 );
    clear_websiteSlider_resize = setTimeout( websiteSlider_resize(), 20 );
  });

})(jQuery);