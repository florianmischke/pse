jQuery(function($) {
  var elementTemplate = $('a.element').last()
  jQuery.getJSON("elements.json", function(elements) {
    // var json = $.extend(true, {}, elements, window.language);
    var json = elements
    $.each(json.elements, function(key, value) {
      element = elementTemplate.clone()
      element.attr('id','element-'+value.symbol.toLowerCase())
      element.attr('data-i',value.number)
      element.addClass(value.category)
      element.css({
        "grid-column-start": ""+value.xpos,
        "grid-row-start": ""+value.ypos
      })
      element.attr('data-phase',value.phase.toLowerCase())
      element.find('.title').html(value.symbol)
      element.find('.number').html(value.number)
      element.find('.subtitle').html(value.name)
      element.find('.mass').html('<i class="fas fa-weight-hanging"></i> '+value.atomic_mass.toFixed(3))
      element.find('.shells').html('<i class="fas fa-atom"></i> '+value.shells.join('/'))
      if(value.summary.indexOf('radioactive') != -1 || parseInt(value.number) >= 83) element.addClass('radioactive')
      description = '<p>'+value.summary+'</p>'
      description += '<a href="'+value.source+'" target="_blank"><i class="fas fa-external-link-alt"></i> Source</a>'
      table = $('<table class="table table-striped table-sm"/>')
      if(value.period) $('<tr><th>Period</th><td>'+value.period+'</td></tr>').appendTo(table);
      if(value.atomic_mass) $('<tr><th>Atomic mass</th><td>'+value.atomic_mass+'</td></tr>').appendTo(table);
      if(value.melt) {
        melt_kelvin = value.melt
        melt_celsius = Math.round(melt_kelvin - 273.15)
        $('<tr><th>Melting Point</th><td>'+melt_kelvin+' K ('+melt_celsius+' °C)</td></tr>').appendTo(table);
      }
      if(value.boil) {
        boil_kelvin = value.boil
        boil_celsius = Math.round(boil_kelvin - 273.15)
        $('<tr><th>Boiling Point</th><td>'+boil_kelvin+' K ('+boil_celsius+' °C)</td></tr>').appendTo(table);
      }
      if(value.density) $('<tr><th>Density</th><td>'+value.density+' g/cm<sup>3</sup></td></tr>').appendTo(table);
      if(value.appearance) $('<tr><th>appearance</th><td>'+value.appearance+'</td></tr>').appendTo(table);
      if(value.category) $('<tr><th>category</th><td>'+value.category+'</td></tr>').appendTo(table);
      if(value.color) $('<tr><th>Color</th><td>'+value.color+'</td></tr>').appendTo(table);
      element.find('.description').html(description).prepend(table)
      $('#pse').append(element);
    })
  })
  $('#elementModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
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
    jQuery.getJSON('language/'+languageIdent+".json", function(language) {
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
      $('a.element:not(.nav-item)').each(function(key, value) {
        var i = parseInt($(this).attr('data-i')) - 1
        if(typeof language.elements[i] !== 'undefined')
          $(this).find('.subtitle').html(language.elements[i].name)
      })
      $('a.element.nav-item').each(function(key, value) {
        console.log(key)
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
})
