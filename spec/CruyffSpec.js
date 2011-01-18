describe('Cruyff',function(){
  it('should render success ajax call',function(){
    $.jasmine.inject('<a href="spec/fixtures/view" data-remote="true">remote_link</a>');
    var remote_link = $('a[data-remote]');
    expect(remote_link.data('events')).toContain('click');
  })
});
