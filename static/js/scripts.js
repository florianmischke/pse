jQuery(function($) {
  $('#elementModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    console.log = button
    var name = '<small>Element #'+button.find('.number').text()+'</small>: '+button.find('.subtitle').text()+' ('+button.find('.title').text()+')'
    var description = button.find('.description').html()
    var modal = $(this)
    modal.find('.modal-title').html(name)
    modal.find('.modal-body').html(description)
  })

  function getUrlVars() {
      var vars = [], hash;
      var hashes = window.location.href.split('#')[0].slice(window.location.href.indexOf('?') + 1).split('&');
      for(var i = 0; i < hashes.length; i++)
      {
          hash = hashes[i].split('=');
          vars.push(hash[0]);
          vars[hash[0]] = hash[1];
      }
      return vars;
  }
  var langFromQueryString = getUrlVars()["language"]

  var userLanguage = navigator.language || navigator.userLanguage,
    supportedLanguagues = ['de_de', 'en_gb', 'en_us'];
  var languageMap = {
    "de": "de_de",
    "en": "en_gb"
  }

  if(typeof langFromQueryString !== 'undefined' && supportedLanguagues.indexOf(langFromQueryString) != -1) {
    window.language = langFromQueryString;
    console.log('Language set via query string')
  } else if(typeof userLanguage !== 'undefined' && supportedLanguagues.indexOf(userLanguage) != -1) {
    window.language = userLanguage
    console.log('Language set via browser settings')
  } else if(typeof userLanguage !== 'undefined' && supportedLanguagues.indexOf(languageMap[userLanguage]) != -1) {
    window.language = languageMap[userLanguage]
    console.log('Language set via languageMap and browser settings')
  } else {
    window.language = 'en_gb'
    console.log('Language set by app default')
  }

  $('.selectpicker').selectpicker('val', window.language);

  $('#language').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
    language = $(this).children().eq(clickedIndex).val()
    $(this).closest('form').submit()
  })

  function setAppLanguage(languageIdent, callback = function() {}) {
    jQuery.getJSON('static/json/language/'+languageIdent+".json", function(language) {
      $('title').text(language.title)
      $('a.navbar-brand').html(language.title)
      $('#legend').children().each(function(key, value) {
        var self = $(this).find('.name')
        self.html(language.groups[key].name)
        if(typeof language.groups[key].alt !== 'undefined') {
          self.attr({
            'data-toggle': 'tooltip',
            'data-placement': 'top',
            title: language.groups[key].alt
          }).addClass('text-underline-dashed').tooltip()
        }
      })
      $('.element:not(.nav-item)').each(function(key, value) {
        var i = parseInt($(this).attr('data-i')) - 1
        if(typeof language.elements[i] !== 'undefined')
          $(this).find('.subtitle').html(language.elements[i].name)
      })
      $('.element.nav-item:not(#example)').each(function(key, value) {
        // console.log(key)
        $(this).find('.subtitle').html(language.navItems[key].name)
      })
      return language
    })
  }
  setAppLanguage(window.language)

  $('#s').focus(function() {
    form = $(this).closest('form')
    parent = form.parent()
    offset = form.offset()
    width = form.width()
    clone = form.clone()
    form.attr({
      'offset-top':offset.top,
      'offset-left':offset.left,
    })
    form.addClass('o-0')
    backdrop = $('<div class="modal-backdrop fade"/>')
    backdrop.appendTo('body')
    clone.attr('id','search-form-clone').css({
      position: 'fixed',
      top: offset.top,
      left: offset.left,
      width: width,
      'z-index': '1200'
    }).appendTo(parent)
    clone.animate({
      top:'25%',
      left:'10%',
      width:'80vw'
    },500)
    backdrop.addClass('show')
    clone.find('.search-param').focus()
  })
  $(document).on('blur', '#search-form-clone .search-param', function() {
    backdrop.removeClass('show')
    clone.animate({
      top: offset.top,
      left: offset.left,
      width: width
    },500, function() {
      form.removeClass('o-0')
      clone.remove()
      backdrop.remove()
    })
  })

  $('[data-toggle="tooltip"]').tooltip()

  $('#themeSwitch').find('input').change(function() {
    $('body').toggleClass('dark-theme')
  })

  $('#minimalisticSwitch').find('input').change(function() {
    $('body').toggleClass('minimalistic')
  })

  var example = $('#example').clone()
  $('.element:not(.nav-item)').hover(function(e) {
    var element = $(this).children().clone()
    var classes = $(this).attr('class')
    $('#example').removeClass().addClass(classes)
    $('#example .card').html(element)
  }, function() {
    $('#example').removeClass().addClass(example.attr('class'))
    $('#example .card').html(example.children().clone())
  })

  $('[data-toggle="offcanvas"]').on('click', function () {
    $('.offcanvas-collapse').toggleClass('open')
  })

  $('#element-navbar .nav-link').click(function() {
    var element_name = $(this).attr('href').slice(1)
    var selector = '#element-'+element_name+' .card'
    $(selector).addClass('focus')
    $(window).scrollTop($(selector).offset().top - $(window).height()/2);
    $('#main').scrollLeft($(selector).offset().left - $(window).width()/2);
    setTimeout(function() {
      $(selector).removeClass('focus')
    }, 1500)
  })

  function setBackgroundGradientAngle() {
    $('.metal.metalloid, .metalloid.nonmetal').children('.card').each(function() {
      var self = $(this)
      let atan = Math.atan(self.height() / self.width());
      let angle = 180*atan/Math.PI
      let background = self.css('background')
      let new_background = background.replace(/(\d*deg)/, angle.toFixed(0)+'deg')
      // self.attr("style", "background: "+new_background+" !important")
      self.css("background", new_background)
    })
  }
  
  setBackgroundGradientAngle()
  $(window).resize(function() {
    waitForFinalEvent(function() {
      setBackgroundGradientAngle()
    }, 100, "some unique string");    
  })
  var waitForFinalEvent = (function () {
    var timers = {};
    return function (callback, ms, uniqueId) {
      if (!uniqueId) {
        uniqueId = "Don't call this twice without a uniqueId";
      }
      if (timers[uniqueId]) {
        clearTimeout (timers[uniqueId]);
      }
      timers[uniqueId] = setTimeout(callback, ms);
    };
  })();
})
