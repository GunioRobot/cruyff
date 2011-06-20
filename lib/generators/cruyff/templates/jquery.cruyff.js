(function($) {

  var cruyff;

  $.cruyff = cruyff = {
    settings : {
      urlDesc : 'url',
      error500page : '/500.html',
      error400page : '/400.html',
      error422page : '/422.html',
      loadingImage : 'images/loading.gif',
      setUpElements : false,
    },

    element : '',
    cache : {},
    callCache : {},

    handleRemote : function(element, selector) {
      $.cruyff.startLoading(selector);
      $.cruyff.element = element;
      _rails_handle_remote(element);
    },

    ajax : function(options, el) {
      $.cruyff.setRequestFormat(options);
      if ((el) && (el.is('form'))) {
        var fileInputs = $('input:file', el).length > 0;
        var mp = 'multipart/form-data';
        var multipart = (el.attr('enctype') == mp || el.attr('encoding') == mp);
        if ((fileInputs) && (multipart)) {
          return el.ajaxSubmit(options);
        }
      }
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

    startHistory : function(selector) {
      $(window).bind('hashchange', function(e) {
        var browser_url = $.bbq.getState($.cruyff.settings.urlDesc);
        if (browser_url && $.cruyff.callCache[browser_url]) {
          $.cruyff.startLoading();
          $.cruyff.render(selector, $.cruyff.cache[browser_url], browser_url);
        }
        $.cruyff.callCache[browser_url] = true;
      });
    },

    start : function(url, selector) {
      $.cruyff.startLoading(selector);
      $.cruyff.settings.setUpElements = true;
      $.cruyff.startHistory(selector);
      var urlDesc = $.cruyff.settings.urlDesc;
      var browserUrl = $.bbq.getState(urlDesc);
      if (browserUrl && browserUrl != "") {
        url = browserUrl;
      }
      $.cruyff.ajax({
        url: url,
        complete : function(xhr, status) {
          $.cruyff.complete(xhr, status, url); 
        },
        success : function(data, xhr, status) {
          $.cruyff.success(xhr, data, status, selector, url);
        },
        error : function(xhr, error, status) {
          $.cruyff.error(xhr, error, status, selector);
        },
      }, null); 
    },

    fragment : function(selector, html) {
      return jQuery('<div>').append(html).find(selector).html() || html;
    },

    render : function(selector, data, url) {
      var html = $.cruyff.fragment(selector, data);
      $(selector).html(html);
      if ($.cruyff.settings.setUpElements) {
        $.cruyff.setUpElements(selector);
      }
      $.cruyff.cache[url] = html;
      $.cruyff.callCache[url] = false;
      $.cruyff.finishLoading(selector);
      $.cruyff.ready(selector);
    },

    ready : function(selector) {
    },

    complete : function(xhr, status, url) {
      $.bbq.pushState($.cruyff.settings.urlDesc + '=' + url);
    },

    success : function(xhr, data, status, selector, url) {
      $.cruyff.render(selector, data, url);
    },

    error : function(xhr, error, status, selector) {
      console.log('error');console.log(error);
      console.log('on');console.log(xhr);
      console.log('status');console.log(status);
      var url = $.cruyff.settings.error500page;
      $.ajax({
        url: url,
        success: function(data) {
          $.cruyff.render(selector, data, url);
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
    $.cruyff.ajax(options, $.cruyff.element);
  };

  $('[pass]').live('ajax:complete', function(xhr, status) {
    $.cruyff.complete(xhr, status, ($(this).attr('href') || $(this).attr('action')));
  });

  $('[pass]').live('ajax:success', function(xhr, data, status) {
    $.cruyff.success(xhr, data, status, $(this).attr('pass'), ($(this).attr('href') || $(this).attr('action')));
  });

  $('[pass]').live('ajax:error', function(xhr, error, status) {
    $.cruyff.error(xhr, error, status, $(this).attr('pass'));
  });

})( jQuery );

