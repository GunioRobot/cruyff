jQuery(function ($) {
  $.fn.extend({
    handleRemoteCrud: function(element) {

    },
    cruyffSetup: function(element) {
      var s = this.cruyffSettings;
      s.url = element.attr('action') || element.attr('href');
      s.method = element.attr('method') || element.attr('data-method');
      return s;
    },
    cruyffSettings: {
      url: "",
      method: ""
    },
    handleRemote: function(element) {
      this.handleRemoteCrud(element);
    }

  });
});
