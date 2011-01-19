jQuery(function ($) {
  $.fn.extend({
    handleRemoteCrud: function(element) {

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
    handleRemote: function(element) {
      this.handleRemoteCrud(element);
    }

  });
});
