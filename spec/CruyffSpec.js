describe('Cruyff',function() {
  it('should override rails handleRemote function',function(){
    spyOn($.fn, 'handleRemoteCrud');
    $.fn.handleRemote('element');
    expect($.fn.handleRemoteCrud).wasCalled();
  })

  xit('should call ajax success function for hyperlink with data-remote',function(){
    $.jasmine.inject('<a href="spec/fixtures/view.html" data-remote="true">remote_link</a>');
    var call_success;
    var remote_link = $('a[data-remote]');    
    remote_link.live('ajax:success', function(e, data, status, xhr) { 
      call_success = true;
    }).trigger('click');
    expect(call_success).toBeTruthy();
  })
});
