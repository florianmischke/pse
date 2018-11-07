jQuery(function($) {
  $(function(){
    $('.selectpicker').selectpicker();
  });
  var elementTemplate = $('a.element')
  jQuery.getJSON("elements.json", function(json) {
    // console.log(json); // this will show the info it in firebug console
    $.each(json.elements, function(key, value) {
      element = elementTemplate.clone()
      element.attr('id','element-'+value.symbol.toLowerCase())
      element.addClass(value.category)
      element.css({
        "grid-column-start": ""+value.xpos,
        "grid-row-start": ""+value.ypos
      })
      element.attr('data-phase',value.phase.toLowerCase())
      element.find('.title').html(value.symbol)
      element.find('.number').html(value.number)
      element.find('.subtitle').html(value.name)
      element.find('.mass').html(value.atomic_mass)
      element.find('.shells').html(value.shells.join('/'))
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
  $('#pse').liveFilter('#search', '.card', {
    filterChildSelector: 'h6'
  });
})
