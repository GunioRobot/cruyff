describe('Cruyff',function() {
  var cruyffSettings,
      element;

  beforeEach(function() {
    $.jasmine.inject('<div id="response"></div>');
  });

  describe('Setup from hyperlink', function() {
    beforeEach(function() {
      $.jasmine.inject('<a href="spec/fixtures/view.html"\
                           data-type="json"\
                           data-method="delete"\
                           data-remote="true">remote_link</a>');
      element = $('a[data-remote]');
      cruyffSettings = $.fn.cruyffSetup(element);
    });

    it('should setup url',function(){
      expect(cruyffSettings.url).toEqual('spec/fixtures/view.html');
    });

    it('should setup method',function(){
      expect(cruyffSettings.method).toEqual('delete');
    });

    it('should setup data type from hyperlink',function(){
      expect(cruyffSettings.dataType).toEqual('json');
    });

    it('should setup data type from ajax Settings',function(){
      element.attr('data-type', '');
      var _ajaxSettings = $.ajaxSettings;
      $.ajaxSettings = {dataType: 'xml'};
      cruyffSettings = $.fn.cruyffSetup(element);
      expect(cruyffSettings.dataType).toEqual('xml');
      $.ajaxSettings = _ajaxSettings;
    });

    it('should setup data',function(){
      expect(cruyffSettings.data).toBeNull();
    });

    it('should setup response',function(){
      expect(cruyffSettings.responseSelector).toEqual('#response');
      expect(cruyffSettings.response).toBeDefined();
    });

  });

  describe('Setup from form', function() {
    beforeEach(function() {
      $.jasmine.inject('<form action="spec/fixtures/view.html"\
                              data-type="json"\
                              method="get"\
                              data-remote="true">\
                          <input type="text" value="a1" name="post[title]" id="post_title">\
                          <input type="submit" value="Update" name="commit" id="post_submit">\
                        </form>');
      element = $('form[data-remote]');
      cruyffSettings = $.fn.cruyffSetup(element);
    });

    it('should setup url',function(){
      expect(cruyffSettings.url).toEqual('spec/fixtures/view.html');
    });

    it('should setup method',function(){
      expect(cruyffSettings.method).toEqual('get');
    });

    it('should setup data type from form',function(){
      expect(cruyffSettings.dataType).toEqual('json');
    });

    it('should setup data type from ajax Settings',function(){
      element.attr('data-type', '');
      var _ajaxSettings = $.ajaxSettings;
      $.ajaxSettings = {dataType: 'xml'};
      cruyffSettings = $.fn.cruyffSetup(element);
      expect(cruyffSettings.dataType).toEqual('xml');
      $.ajaxSettings = _ajaxSettings;
    });

    it('should setup data',function(){
      expect(cruyffSettings.data).toEqual([{name:'post[title]', value:'a1'}]);
    });

    it('should setup data with submit button',function(){
      element.data('ujs:submit-button', 'button');
      cruyffSettings = $.fn.cruyffSetup(element);
      expect(cruyffSettings.data).toEqual([{name:'post[title]', value:'a1'}, 'button']);
      expect(element.data('ujs:submit-button')).toBeNull();
    });

    it('should setup response',function(){
      expect(cruyffSettings.responseSelector).toEqual('#response');
      expect(cruyffSettings.response).toBeDefined();
    });

  });

  describe('Render Ajax Response', function() {
    beforeEach(function() {
      $.jasmine.inject('<a href="spec/fixtures/view.html"\
                           data-remote="true">remote_link</a>');
      element = $('a[data-remote]');
      cruyffSettings = $.fn.cruyffSetup(element);
    });

    it('should render success response',function(){
      runs(function() {
        $.fn.handleRemoteCrud(element);
      });
      waits(100);
      runs(function() {
        expect(cruyffSettings.response).toHaveHtml('view html');
      });
    });

    it('should render error response',function(){
      element.attr('href', 'bad/url');
      runs(function() {
        $.fn.handleRemoteCrud(element);
      });
      waits(100);
      runs(function() {
        expect(cruyffSettings.response.html()).toContain('NS_ERROR_DOM_BAD_URI');
      });
    });

  });

  describe('Bookmark Ajax calls', function() {
    beforeEach(function() {
      $.jasmine.inject('<a href="spec/fixtures/view.html"\
                           data-remote="true">remote_link</a>');
      element = $('a[data-remote]');
      cruyffSettings = $.fn.cruyffSetup(element);
    });

    it('should bookmark',function() {
      runs(function() {
        $.fn.handleRemoteCrud(element);
      });
      waits(100);
      runs(function() {
        expect($.bbq.getState('app')).toEqual('spec/fixtures/view.html');
      });
    });

    it('should load browser url',function() {
      $.bbq.pushState('app=spec/fixtures/view.html');
      expect($.fn.cruyffUrl).toEqual('spec/fixtures/view.html');
    });

  });

});
