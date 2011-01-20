describe('Cruyff',function() {
  var cruyffSettings,
      element;

  it('should call ajax success function',function(){
    spyOn($.fn, 'cruyffSetup').andReturn({url:'spec/fixtures/view.html'});
    //spyOn($.fn, 'ajaxSuccess');
    $.jasmine.inject('<a href="spec/fixtures/view.html"\
                         data-remote="true">remote_link</a>');
    element = $('a[data-remote]');
    element.trigger('click');
    //expect($.fn.ajaxSuccess).wasCalled();
    //spyOn($.fn, 'ajaxSubmit');
    //$.fn.handleRemote('element');
    //expect($.fn.ajaxSubmit).wasCalled();
    /*
    $.jasmine.inject('<a href="spec/fixtures/view.html" data-remote="true">remote_link</a>');
    var call_success;
    var remote_link = $('a[data-remote]');    
    remote_link.live('ajax:success', function(e, data, status, xhr) { 
      call_success = true;
    }).trigger('click');
    expect(call_success).toBeTruthy();
    */
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
      $.ajaxSettings = {dataType: 'xml'};
      cruyffSettings = $.fn.cruyffSetup(element);
      expect(cruyffSettings.dataType).toEqual('xml');
    });

    it('should setup data',function(){
      expect(cruyffSettings.data).toBeNull();
    });
  });

  describe('Setup from form', function() {
    beforeEach(function() {
      $.jasmine.inject('<form action="spec/fixtures/view.html"\
                              data-type="json"\
                              method="post"\
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
      expect(cruyffSettings.method).toEqual('post');
    });

    it('should setup data type from form',function(){
      expect(cruyffSettings.dataType).toEqual('json');
    });

    it('should setup data type from ajax Settings',function(){
      element.attr('data-type', '');
      $.ajaxSettings = {dataType: 'xml'};
      cruyffSettings = $.fn.cruyffSetup(element);
      expect(cruyffSettings.dataType).toEqual('xml');
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
  });

});
