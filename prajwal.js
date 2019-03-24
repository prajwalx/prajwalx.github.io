this.document.getElementById('age').innerHTML=((new Date).getFullYear()-1998)+'';
  function toggleNav(){
    var width=this.document.getElementById('mobileNav').style.width;   
    if(width=='86%'){
      this.document.getElementById('mobileNav').style.width='0%';
      $('.navbar-brand').css('visibility','visible');  
    } 
    else{
      this.document.getElementById('mobileNav').style.width='86%';
      $('.navbar-brand').css('visibility','hidden');  
    }
  }
  $('#fullNav').on('hide.bs.collapse', function () {
    this.document.getElementById('fullNav').style.display='none';
});
$('#fullNav').on('show.bs.collapse', function () {
  this.document.getElementById('fullNav').style.display='block';  
  $('.navbar-brand').css('visibility','visible');
// do something…
});
$(document).ready(function(){
	$('#menu-ico').click(function(){
		$(this).toggleClass('open');
	});
});
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();     
});

// https://stackoverflow.com/questions/15590236/fade-in-element-on-scroll-down-using-css
$(window).scroll(function () {

        /* Check the location of each desired element */
        $('.fadeInUp').each(function (i) {

            var top_of_object = $(this).position().top + 0;//$(this).outerHeight();
            var bottom_of_window = $(window).scrollTop() + $(window).height();
            var bottom_of_object = $(this).position().top + $(this).outerHeight();
            /* If the object-top is completely visible in the window, fade it up */
            if (bottom_of_window > top_of_object) {//going down
              $(this).css('animation-name','fadeInUp');
              $(this).css('-webkit-animation-name','fadeInUp');
            }
            else if(bottom_of_window < bottom_of_object){//going up
              $(this).css('animation-name','');
              $(this).css('-webkit-animation-name','');
            }

        });
        
        $('.navbar').each(function(i){
          var top_of_window = $(window).scrollTop() + 0;
          var bottom_of_bg  = $('.background').position().top + $('.background').outerHeight() - 100;
          if(top_of_window > bottom_of_bg){
            $(this).css('background','forestgreen');
          }
          else{
              $(this).css('background','transparent');
          }
        });
        
        $('.skill').each(function (i) {

            var top_of_object = $(this).position().top + 0;//$(this).outerHeight();
            var bottom_of_window = $(window).scrollTop() + $(window).height();
            // var bottom_of_object = $(this).position().top + $(this).outerHeight();
            /* If the object-top is completely visible in the window, fade it up */
            if ((bottom_of_window -700)> top_of_object) {//going down
              // console.log('add');
              $('.skill_html').css('animation-name','skill_slide_right');
              $('.skill_html').css('-webkit-animation-name','skill_slide_right');
            }
            else if((bottom_of_window -700) < top_of_object){//going up
              // console.log('remove');
              $('.skill_html').css('animation-name','');
              $('.skill_html').css('-webkit-animation-name','');
            }

        });
        
        $('.work').each(function (i) {
        
            var top_of_object = $(this).position().top + 0;//$(this).outerHeight();
            var bottom_of_window = $(window).scrollTop() + $(window).height();
            // var bottom_of_object = $(this).position().top + $(this).outerHeight();
            /* If the object-top is completely visible in the window, fade it up */
            if ((bottom_of_window )> top_of_object) {//going down
              // console.log('add');
              $(this).css('animation-name','workslideRight');
              $(this).css('-webkit-animation-name','workslideRight');
            }
            else if((bottom_of_window) < top_of_object){//going up
              // console.log('remove');
              $(this).css('animation-name','');
              $(this).css('-webkit-animation-name','');
            }
        
        });
        $('.work-content').each(function (i) {
        
            var top_of_object = $(this).position().top + 0;//$(this).outerHeight();
            var bottom_of_window = $(window).scrollTop() + $(window).height();
            // var bottom_of_object = $(this).position().top + $(this).outerHeight();
            /* If the object-top is completely visible in the window, fade it up */
            if ((bottom_of_window )> top_of_object) {//going down
              // console.log('add');
              $(this).css('animation-name','contentSlideLeft');
              $(this).css('-webkit-animation-name','contentSlideLeft');
            }
            else if((bottom_of_window) < top_of_object){//going up
              // console.log('remove');
              $(this).css('animation-name','');
              $(this).css('-webkit-animation-name','');
            }
        
        });

    });
    function smoothScrollTo(item) {
        $('html,body').animate({
            scrollTop: $(item).offset().top-($('.navbar').innerHeight())},
            1000);
    };    