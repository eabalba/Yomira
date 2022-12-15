
jQuery(document).ready(function(){
  jQuery('a[href="#enquire"]').click(function(event) {
    event.preventDefault();
    document.querySelector('dialog').showModal()
  })
  jQuery('a[href="https://yomira.com/contact/"]').click(function(event) {
    event.preventDefault();
    document.querySelector('dialog').showModal()
  })
  jQuery('a[href="https://yomira.com/contact"]').click(function(event) {
    event.preventDefault();
    document.querySelector('dialog').showModal()
  })
})


/*--=========== SLICK ============--*/
    /*--=== Slider for Suggestions block ===--*/
    function suggestedYachtsSlider(){
      jQuery('.suggestions-slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: false,
        infinite: false,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow:2,
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow:1,
            }
          },
        ]
      });
    }
/*--=== Slider for yacht overview block ===--*/
jQuery(document).ready(function(){
  
    jQuery('.slider-for').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      asNavFor: '.slider-nav',
      swipeToSlide: true,
      dots: false,
    });
    if(jQuery('.slider-for video').length){
      if(jQuery('.slider-for .slick-active video').length){
        jQuery('.slider-for .slick-active video').get(0).play();
      }
      jQuery('.slider-for').on('afterChange', function(event, slick, currentSlide, nextSlide){
        jQuery('.slick-slide video').get(0).pause();
        if(jQuery('.slick-active video').length){
          jQuery('.slick-active video').get(0).play();
        }
      });
      };
    jQuery('.slider-nav').slick({
      slidesToShow: 7,
      slidesToScroll: 1,
      asNavFor: '.slider-for',
      dots: false,
      arrows: true,
      focusOnSelect: true,
      swipeToSlide: true,
      centerMode: true,
      responsive: [
        {
          breakpoint: 1500,
          settings: {
            slidesToShow:5,
          }
        },
        {
          breakpoint: 1200,
          settings: {
            slidesToShow:3,
          }
        },
        {
          breakpoint: 1040,
          settings: {
            slidesToShow:5,
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow:3,
          }
        },
       
      ]
    });
    /*--=== Slider for Charter Destination block ===--*/
    jQuery('.charter-country-slider').slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      arrows: true,
      infinite:false,
      dots:true,
      swipeToSlide: true,
      focusOnSelect: true,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow:3
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow:2,
          }
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow:1,
          }
        }
      ]
    });

   
  
    /*--=== Slider for Cruising areas block ===--*/
    /*jQuery('.cruising-area-slider').slick({
      dots: true,
      arrows: true,
      infinite: true,
      speed: 600,
      slidesToShow: 1,
    });*/

  
    /*--=== Slider for Crew block ===--*/
    jQuery('.crew-list-slider').slick({
      rows:2,
      slidesToShow: 3,
      slidesToScroll: 1,
      dots: true,
      infinite:false,
      arrows:true,
      focusOnSelect: true,
      responsive: [

        
        {
          breakpoint: 992,
          settings: {
            slidesToShow:4,
          }
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow:3,
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow:2,
          }
        },
      ]
    });

    suggestedYachtsSlider();
    
    jQuery('.testimonial-slider').slick({
      dots: true,
      arrows: false
    })

/*--=== Slider for About Locations block ===--*/
    jQuery('.image-carousel-slider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      infinite:false,
      dots:true,
      swipeToSlide: true,
      focusOnSelect: true
    });

  /*-- SORT YACHTS --*/
  
  
    jQuery('#sort').change(function(){
      var value =  jQuery(this).val();
      var order = jQuery(this).find(':selected').attr('data-order');
      var yachtList = jQuery(".yacht");
      if(order == 'asc'){
        yachtList.sort(function(a, b){
          return jQuery(a).data(value)-jQuery(b).data(value)
      });
      } else{
        yachtList.sort(function(a, b){
          return jQuery(b).data(value)-jQuery(a).data(value)
      });
      }
      jQuery('.yacht-list').html(yachtList); 
      
    });

    jQuery('.filter').change(function(){
      jQuery('.yacht').removeClass('hide');
        var guests = jQuery('#guests').val();
        var season = jQuery('.season .custom-select-opener span').html();
        var location = jQuery('.location .custom-select-opener span').html();
        if(season == 'Winter'){
          jQuery('.yacht[data-winter=""]').addClass('hide');
          if(location !== 'Anywhere'){
            jQuery('.yacht:not([data-winter*="' + location + '"])').addClass('hide');
          }
        } else if(season == 'Summer'){
          jQuery('.yacht[data-summer=""]').addClass('hide');
          if(location !== 'Anywhere'){
            jQuery('.yacht:not([data-summer*="' + location + '"])').addClass('hide');
          }
        } 
        else if(season == 'Any'){
          if(location !== 'Anywhere'){
            jQuery('.yacht').addClass('hide');
            jQuery('.yacht[data-summer*="' + location + '"]').removeClass('hide');
            jQuery('.yacht[data-winter*="' + location + '"]').removeClass('hide');
          }
        } 
  
       
    });
    function movetabs(){

      if (jQuery(window).width() < 960) {
        jQuery('.tab-wrap').each(function(){
          var tab = jQuery(this).attr('data-tabheading');
          jQuery('#' + tab).appendTo(this);
        });
      } else {
        jQuery('.tab-wrap').each(function(){
          var tab = jQuery(this).attr('data-tabheading');
          jQuery('#' + tab).appendTo('.specification-column');
        });
      }
    }
    movetabs();
    jQuery(window).on('resize', function() {
      movetabs();
    });

 
});
 
  
  /*--========= TABBED CONTENT ===========--*/
  function openTab(evt, tabName) {
    var i, x, tablinks;
  
    x = document.getElementsByClassName("specification-tab-content");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab");
    for (i = 0; i < x.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" current-tab", "");
    }
    
    evt.currentTarget.className += " current-tab";
    document.getElementById(tabName).style.display = "block";
  }
  
  /*--============= Food Menu Selector ==============--*/
  function foodTab(evt, foodMenu, focus) {
    var i,j, x, y, tablinks;
  
    y = document.getElementsByClassName("food-menu-on-focus");
    for (j = 0; j < y.length; j++) {
      y[j].style.display = "none";
    };
    x = document.getElementsByClassName("food-tab-content");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    };
  
    tablinks = document.getElementsByClassName("food-tab");
    for (i = 0; i < x.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active-tab", "");
    };
  
    document.getElementById(focus).style.display = "block";
    document.getElementById(foodMenu).style.display = "block";
    evt.currentTarget.className += " active-tab";
  }
  
  /*--============= Crew Gallery Selector ==============--*/
  function focusCrew(evt, crewName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("icon-content");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("crew-icon");
    for (i = 0; i < x.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active-icon", "");
    }
    document.getElementById(crewName).style.display = "block";
    evt.currentTarget.className += " active-icon";
  }

  /*--========= LOCATIONS TABBED CONTENT ===========--*/
  function adventuresTab(evt, tabName, mediaContent) {
    var i, x, y, tablinks, expanded;
  
    x = document.getElementsByClassName("adventures-tab-content");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    y = document.getElementsByClassName("adventures-media-content");
    for (i = 0; i < y.length; i++) {
      y[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("adventures-tab");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" current-adventures-tab", "");
    }



    evt.currentTarget.className += " current-adventures-tab";
    document.getElementById(tabName).style.display = "block";
    document.getElementById(mediaContent).style.display = "block";
  }




//Map tabs
jQuery('.location-map-pin').click(function(){
  jQuery('.pin').removeClass('active');
  jQuery(this).addClass('active');
  jQuery('.destination__tab').removeClass('active');
  var tab = jQuery(this).attr('id');
  jQuery('.' + tab).addClass('active');
})


jQuery('.chartered-tab').click(function(){
  var season = jQuery(this).data('season');
  jQuery('.chartered-tab').removeClass('current-chartered-tab');
  jQuery(this).addClass('current-chartered-tab');

  if(season == 'all'){
    jQuery('.suggestion-column').removeClass('hide');
  } else{
    jQuery('.suggestion-column').addClass('hide');
    jQuery('.suggestion-column.' + season).removeClass('hide');
  }
  jQuery('.suggestions-slider').slick('unslick');
  suggestedYachtsSlider();

})





function showCountries(country){
  const charterToggle = document.getElementById('charterToggle-' + country);
  if(charterToggle.classList.contains('open')){
    charterToggle.classList.remove('open');
    charterToggle.querySelector('span').innerHTML  = "Show";
  }else{
    charterToggle.classList.add('open');
    charterToggle.querySelector('span').innerHTML  = "Hide";
    document.querySelector('#country-' + country).scrollIntoView({
        behavior: 'smooth'
    });
    
  }
  const charterCountries = document.getElementById('country-' + country);
  if(charterCountries.classList.contains('onDisplay')){
    charterCountries.classList.remove('onDisplay')
  }else{
    charterCountries.classList.add('onDisplay')
  }

}



window.addEventListener('load', (event) => { 
  const yachtSelect = document.querySelector('.yacht-select')

  if (yachtSelect) {
    const customYachtSelect = document.querySelector('.yacht-select .customSelect')

    customYachtSelect.customSelect.value = 'length'
    customYachtSelect.customSelect.select.dispatchEvent(new Event("change"));

  }
})