(function($) {

  var cruyff;

  $.cruyff = cruyff = {
    settings : {
      appName : 'app',
      element : '',
      error500page : '/500.html',
      error400page : '/400.html',
      error422page : '/422.html',
    },

    ajax : function(options, el) {
      if ((el) && (el.is('form'))) {
        var fileInputs = $('input:file', el).length > 0;
        var mp = 'multipart/form-data';
        var multipart = (el.attr('enctype') == mp || el.attr('encoding') == mp);
        if ((fileInputs) && (multipart)) {
          return el.ajaxSubmit(options);
        }
      }
      $.cruyff.setRequestFormat(options);
      return $.ajax(options);
    },

    elementUrl : function(el) {
      return el.attr('href') || el.attr('action');
    },

    setRequestFormat : function(options) {
      url = options['url'] || '';
      if (url.substring(url.length-5, url.length) != '.html') {
        url = url + '.html';
      }
      options['url'] = url;
    },

    render : function(selector, data) {
      $(selector).html(data);
    },
  };

  //Override rails.js ajax call
  $.rails.ajax = function(options) {
    $.cruyff.ajax(options, $.cruyff.settings.element);
  };

  $('[pass]').live('ajax:beforeSend', function(xhr, settings) {	 	
    $.cruyff.settings.element = $(this);
  });

  $('[pass]').live('ajax:complete', function(xhr, status) {
    $.bbq.pushState($.cruyff.settings.appName + '=' + $.cruyff.elementUrl($.cruyff.settings.element));
  });

  $('[pass]').live('ajax:success', function(xhr, data, status) {
    $.cruyff.render($(this).attr('pass'), data);
  });

  $('[pass]').live('ajax:error', function(xhr, error, status) {
    el = $(this).attr('pass');
    console.log('error');console.log(error);
    console.log('on');console.log(xhr);
    console.log('status');console.log(status);
    $.ajax({
      url: $.cruyff.settings.error500page,
      success: function(data){
        $.cruyff.render(el, data);
      }
    });
  })

  //$.fn.cruyffUrl = $.bbq.getState('app');

})( jQuery );

