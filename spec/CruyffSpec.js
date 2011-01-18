describe('Cruyff',function() {
  var remote_link,
      link_url,
      remote_form,
      form_url;

  beforeEach(function () {
    $.jasmine.inject('<a href="spec/fixtures/view.html" data-remote="true">remote_link</a>');
    remote_link = $('a[data-remote]')[0];
    link_url = $.fn.crudSettings($(remote_link));

    $.jasmine.inject('<form action="spec/fixtures/view.html" data-remote="true"></form>');
    remote_form = $('form[data-remote]')[0];
    form_url = $.fn.crudSettings($(remote_form));
  });


  it('should override rails handleRemote function',function(){
    spyOn($.fn, 'handleRemoteCrud');
    $.fn.handleRemote('element');
    expect($.fn.handleRemoteCrud).wasCalled();
  })

  it('should get url from form',function(){
    expect(form_url).toEqual('spec/fixtures/view.html');
  })

  it('should get url from hiperlink',function(){
    expect(link_url).toEqual('spec/fixtures/view.html');
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
