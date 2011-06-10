(function($) {

  $.cruyffSettings = {};  
  $.cruyffSettings.appName = "app";
  $.cruyffSettings.element;
  $.cruyffSettings.error500page = "/500.html";
  $.cruyffSettings.error400page = "/400.html";
  $.cruyffSettings.error422page = "/422.html";

  var cruyff;
  $.cruyff = cruyff = {
    ajax : function(options, el) {
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

    handleRemote: function(element) {
      $.cruyffSettings.element = $(this);
      var url = element.attr('href');
      element.attr('href', url + ".html");
      _railsHandleRemote(element);
      element.attr('href', url);
    },

    elementUrl : function(el) {
      return el.attr('href') || el.attr('action');
    }
  };

  //Override rails.js ajax call
  $.rails.ajax = function(options) {
    $.cruyff.ajax(options, $.cruyffSettings.element);
  };

  //Override rails.js handle remote
  var _railsHandleRemote = $.rails.handleRemote;
  $.rails.handleRemote = function(element) {
    $.cruyff.handleRemote(element);
  };

  $('[pass]').live('ajax:complete', function(xhr, status) {
    $.bbq.pushState($.cruyffSettings.appName + "=" + $.cruyff.elementUrl($.cruyffSettings.element));
  });

  $('[pass]').live('ajax:success', function(xhr, data, status) {
    $($(this).attr('pass')).html(data);
  });

  $('[pass]').live('ajax:error', function(xhr, error, status) {
    el = $(this).attr('pass');
    console.log("error");console.log(error);
    console.log("on");console.log(xhr);
    console.log("status");console.log(status);
    $.ajax({
      url: $.cruyffSettings.error500page,
      success: function(data){
        $(el).html(data);
      }
    });
  })

  //$.fn.cruyffUrl = $.bbq.getState("app");

})( jQuery );

