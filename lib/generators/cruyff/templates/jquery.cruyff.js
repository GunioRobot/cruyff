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

    handleRemote : function(element, selector) {
      $.cruyff.startLoading(selector);
      $.cruyff.settings.element = element;
      _rails_handle_remote(element);
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
      if (url.substring(url.length-6, url.length) != '.xhtml') {
        url = url + '.xhtml';
      }
      options['url'] = url;
    },

    setUpElements : function(selector) {
      $(selector + ' a,form').each(function() {
        var url = $(this).attr('href') || $(this).attr('action');
        if (url && url != '#' && url != '') {
          $(this).attr('data-remote', true);
          $(this).attr('pass', selector);
        }
      });
    },

    startLoading : function(selector) {
      $(selector).hide();
      if ($('#cruyff-loading').length == 0) {
        var img = '<img id="cruyff-loading" class="loading" src="' + $.cruyff.settings.loadingImage + '"/>';
        $(selector).parent().append(img);
      }
    },

    finishLoading : function(selector) {
      $('#cruyff-loading').remove();
      $(selector).show('slow');
    },

    start : function(urlDesc, url, selector) {
      $.cruyff.startLoading(selector);
      $.cruyff.settings.setUpElements = true;
      $.cruyff.settings.urlDesc = urlDesc;
      var browserUrl = $.bbq.getState(urlDesc);
      if (browserUrl && browserUrl != "") {
        url = browserUrl;
      }
      $.cruyff.ajax({
        url: url,
        complete : function(xhr, status) {
          $.cruyff.complete(xhr, status, url) 
        },
        success : function(data, xhr, status) {
          $.cruyff.success(xhr, data, status, selector);
        },
        error : function(xhr, error, status) {
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
      $.cruyff.finishLoading(selector);
      $.cruyff.ready(selector);
    },

    ready : function(selector) {
    },

    complete : function(xhr, status, url) {
      $.bbq.pushState($.cruyff.settings.urlDesc + '=' + url);
    },

    success : function(xhr, data, status, selector) {
      $.cruyff.render(selector, data);
    },

    error : function(xhr, error, status, selector) {
      console.log('error');console.log(error);
      console.log('on');console.log(xhr);
      console.log('status');console.log(status);
      $.ajax({
        url: $.cruyff.settings.error500page,
        success: function(data) {
          $.cruyff.render(selector, data);
        },
      });
    },
  };

  //Override rails.js handleRemote call
  var _rails_handle_remote = $.rails.handleRemote;
  $.rails.handleRemote = function(element) {
    var selector = $(element).attr('pass'); 
    if (selector) {
      $.cruyff.handleRemote(element, selector);
    } else {
      _rails_handle_remote(element);
    }
  };
  //Override rails.js ajax call
  $.rails.ajax = function(options) {
    $.cruyff.ajax(options, $.cruyff.settings.element);
  };

  $('[pass]').live('ajax:complete', function(xhr, status) {
    $.cruyff.complete(xhr, status, ($(this).attr('href') || $(this).attr('action')));
  });

  $('[pass]').live('ajax:success', function(xhr, data, status) {
    $.cruyff.success(xhr, data, status, $(this).attr('pass'));
  });

  $('[pass]').live('ajax:error', function(xhr, error, status) {
    $.cruyff.error(xhr, error, status, $(this).attr('pass'));
  });

})( jQuery );

