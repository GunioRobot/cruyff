jQuery(function ($) {
  $.fn.extend({
    handleRemoteCrud: function(element) {
      //var setting = this.loadSettings();

    },
    crudSettings: function (element) {
      return element.attr('href') || element.attr('action');
    },

    handleRemote: function(element) {
      this.handleRemoteCrud(element);
    }

  });
});
