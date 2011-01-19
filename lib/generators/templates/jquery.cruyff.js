jQuery(function ($) {
  $.fn.extend({
    handleRemoteCrud: function(element) {

    },
    crudSetup: function(element) {
      this.crudSettings.url = element.attr('action') || element.attr('href');
      this.crudSettings.method = element.attr('method') || element.attr('data-method');
      return this.crudSettings;
    },
    crudSettings: {
      url: "",
      method: ""
    },
    handleRemote: function(element) {
      this.handleRemoteCrud(element);
    }

  });
});
