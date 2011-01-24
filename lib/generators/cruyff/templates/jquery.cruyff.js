(function($) {

  var cruyffSettings = {
    url: "",
    method: "",
    dataType: "",
    data: "",
    responseSelector: "#response",
    response: [],
  };

  $.fn.cruyff = function() {
  };

  $.fn.cruyff.handleRemoteCrud = function(element) {
    var cs = $.fn.cruyff.setup(element);

    //call ajaxSubmit from jquery.form because provides a file upload mechanism.
    element.ajaxSubmit({
      url: cs.url,
      type: cs.method || 'GET',
      data: cs.data,
      dataType: cs.dataType,
      // stopping the "ajax:beforeSend" event will cancel the ajax request
      beforeSend: function(xhr, settings) {
        // dataType will set by rails app
        //if (settings.dataType === undefined) {
        //  xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
        //}
        return fire(element, 'ajax:beforeSend', [xhr, settings]);
      },
      success: function(data, status, xhr) {
        element.trigger('ajax:success', [data, status, xhr]);
        cs.response.html(data);
      },
      complete: function(xhr, status) {
        element.trigger('ajax:complete', [xhr, status]);
      },
      error: function(xhr, status, error) {
        element.trigger('ajax:error', [xhr, status, error]);
        $.fn.cruyff.renderError(cs.response, error);
      }
    });

    $.bbq.pushState("app=" + cs.url);

  };

  $.fn.cruyff.renderError = function(element, error) {
    element.html((error && error.toString()) || "server error");
  };

  $.fn.cruyff.setup = function(element) {
    var cs = cruyffSettings;

    cs.response = $(cs.responseSelector);
    
    /**
    * Rails.js Code 2011-01-12
    **/
    cs.dataType = element.attr('data-type') || ($.ajaxSettings && $.ajaxSettings.dataType);
  
    if (element.is('form')) {
      cs.method = element.attr('method');
      cs.url = element.attr('action');
      cs.data = element.serializeArray();
      // memoized value from clicked submit button
      var button = element.data('ujs:submit-button');
      if (button) {
        cs.data.push(button);
        element.data('ujs:submit-button', null);
      }
    } else {
      cs.method = element.attr('data-method');
      cs.url = element.attr('href');
      cs.data = null;
    }
    /**
    * End Rails.js
    **/

    return cs;
  };

  //Override rails.js handleRemote
  $.fn.railsUjs.handleRemote = function(element) {
    $.fn.cruyff.handleRemoteCrud(element);
  };

  //Wrapper to rails.js fire function
  function fire(obj, name, data) {
    $.fn.railsUjs.fire(obj, name, data);
  }

  //$.fn.cruyffUrl = $.bbq.getState("app");

})( jQuery );
