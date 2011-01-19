jQuery(function ($) {
  $.fn.extend({

    handleRemoteCrud: function(element) {
      var s = this.cruyffSetup(element);

      //call ajaxSubmit from jquery.form because provides a file upload mechanism.
      element.ajaxSubmit({
        url: s.url,
        type: s.method || 'GET',
        data: s.data,
        dataType: s.dataType,
        // rails.js => stopping the "ajax:beforeSend" event will cancel the ajax request
        beforeSend: function(xhr, settings) {
          if (settings.dataType === undefined) {
            xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
          }
          return $.fn.fire(element, 'ajax:beforeSend', [xhr, settings]);
        },
        success: function(data, status, xhr) {
          element.trigger('ajax:success', [data, status, xhr]);
        },
        complete: function(xhr, status) {
          element.trigger('ajax:complete', [xhr, status]);
        },
        error: function(xhr, status, error) {
          element.trigger('ajax:error', [xhr, status, error]);
        }
      });
    },

    cruyffSetup: function(element) {
      var s = this.cruyffSettings;

      /**
      * Rails.js Code 2011-01-12
      **/
      s.dataType = element.attr('data-type') || ($.ajaxSettings && $.ajaxSettings.dataType);
    
      if (element.is('form')) {
        s.method = element.attr('method');
        s.url = element.attr('action');
        s.data = element.serializeArray();
        // memoized value from clicked submit button
        var button = element.data('ujs:submit-button');
        if (button) {
          s.data.push(button);
          element.data('ujs:submit-button', null);
        }
      } else {
        s.method = element.attr('data-method');
        s.url = element.attr('href');
        s.data = null;
      }
      /**
      * End Rails.js Code
      **/

      return s;
    },

    cruyffSettings: {
      url: "",
      method: "",
      dataType: "",
      data: ""
    },

    //override rails.js handleRemote
    handleRemote: function(element) {
      this.handleRemoteCrud(element);
    }

  });
});
