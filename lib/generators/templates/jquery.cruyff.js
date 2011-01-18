jQuery(function ($) {
  $.fn.extend({
    handleRemoteCrud: function(element) {
      console.log(element);
    },

    handleRemote: function(element) {
      this.handleRemoteCrud(element);
    }

  });
});
