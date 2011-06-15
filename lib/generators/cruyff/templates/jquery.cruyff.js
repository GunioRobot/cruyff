(function($) {

  var cruyff;

  $.cruyff = cruyff = {
    settings : {
      urlDesc : 'url',
      element : '',
      error500page : '/500.html',
      error400page : '/400.html',
      error422page : '/422.html',
      loadingImage : 'images/loading.gif',
      setUpElements : false,
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

    setRequestFormat : function(options) {
      url = options['url'] || '';
      if (url.substring(url.length-5, url.length) != '.html') {
        url = url + '.html';
      }
      options['url'] = url;
    },

    setUpElements : function(selector) {
      $(selector + ' a,form').each( function(){ 
        $(this).attr('data-remote', true);
        $(this).attr('pass', selector);
      });
    },

    startingAjax : function(selector) {
      $(selector).hide();
      var img = '<img id="cruyff-loading" class="loading" src="' + $.cruyff.settings.loadingImage + '"/>';
      $(selector).parent().append(img);
      console.log('x');
    },

    finishingAjax : function(selector) {
      $('#cruyff-loading').remove();
      $(selector).show();
    },

    start : function(urlDesc, url, selector) {
      $.cruyff.settings.setUpElements = true;
      $.cruyff.settings.urlDesc = urlDesc;
      var browserUrl = $.bbq.getState(urlDesc);
      if (browserUrl && browserUrl != "") {
        url = browserUrl;
      }
      $.cruyff.ajax({
        url: url,
        success: function(data, xhr, status) {
          $.cruyff.success(xhr, data, status, selector);
        },
        error: function(xhr, error, status) {
          $.cruyff.error(xhr, error, status, selector);
        },
      }, null); 
    },

    fragment : function(selector, html) {
      return jQuery('<div>').append(html).find(selector).html() || html;
    },

    render : function(selector, data) {
      var html = $.cruyff.fragment(selector, data);
      $(selector).html(html);
      if ($.cruyff.settings.setUpElements) {
        $.cruyff.setUpElements(selector);
      }
    },

    beforeSend : function(xhr, settings, el, selector) {
      $.cruyff.startingAjax(selector);
      $.cruyff.settings.element = el;
    },

    complete : function(xhr, status, el) {
      $.bbq.pushState($.cruyff.settings.urlDesc + '=' + (el.attr('href') || el.attr('action')));
    },

    success : function(xhr, data, status, selector) {
      $.cruyff.render(selector, data);
      $.cruyff.finishingAjax(selector);
    },

    error : function(xhr, error, status, selector) {
      console.log('error');console.log(error);
      console.log('on');console.log(xhr);
      console.log('status');console.log(status);
      $.ajax({
        url: $.cruyff.settings.error500page,
        beforeSend : function(xhr, settings) {
          $.cruyff.beforeSend(xhr, settings, null, selector);
        },
        success: function(data) {
          $.cruyff.render(selector, data);
        },
      });
    },
  };

  //Override rails.js ajax call
  $.rails.ajax = function(options) {
    $.cruyff.ajax(options, $.cruyff.settings.element);
  };

  $('[pass]').live('ajax:beforeSend', function(xhr, settings) {	 	
    $.cruyff.beforeSend(xhr, settings, $(this), $(this).attr('pass'));
  });

  $('[pass]').live('ajax:complete', function(xhr, status) {
    $.cruyff.complete(xhr, status, $(this));
  });

  $('[pass]').live('ajax:success', function(xhr, data, status) {
    $.cruyff.success(xhr, data, status, $(this).attr('pass'));
  });

  $('[pass]').live('ajax:error', function(xhr, error, status) {
    $.cruyff.error(xhr, error, status, $(this).attr('pass'));
  });

})( jQuery );

