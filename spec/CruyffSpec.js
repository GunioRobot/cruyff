describe('Cruyff',function() {
  var cryffSettings;

  it('should override rails handleRemote function',function(){
    spyOn($.fn, 'handleRemoteCrud');
    $.fn.handleRemote('element');
    expect($.fn.handleRemoteCrud).wasCalled();
  });

  describe('Setup hyperlink', function() {
    beforeEach(function() {
      $.jasmine.inject('<a href="spec/fixtures/view.html" data-method="delete" data-remote="true">remote_link</a>');
      cryffSettings = $.fn.cruyffSetup($('a[data-remote]'));
    });

    it('should setup url',function(){
      expect(cryffSettings.url).toEqual('spec/fixtures/view.html');
    });

    it('should setup method',function(){
      expect(cryffSettings.method).toEqual('delete');
    });
  });

  describe('Setup form', function() {
    beforeEach(function() {
      $.jasmine.inject('<form action="spec/fixtures/view.html" method="post" data-remote="true"></form>');
      cryffSettings = $.fn.cruyffSetup($('form[data-remote]'));
    });

    it('should setup url',function(){
      expect(cryffSettings.url).toEqual('spec/fixtures/view.html');
    });

    it('should setup method',function(){
      expect(cryffSettings.method).toEqual('post');
    });

  });

  xit('should call ajax success function for hyperlink with data-remote',function(){
    $.jasmine.inject('<a href="spec/fixtures/view.html" data-remote="true">remote_link</a>');
    var call_success;
    var remote_link = $('a[data-remote]');    
    remote_link.live('ajax:success', function(e, data, status, xhr) { 
      call_success = true;
    }).trigger('click');
    expect(call_success).toBeTruthy();
  });
});
