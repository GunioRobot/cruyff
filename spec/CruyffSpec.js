describe('Cruyff',function() {
  var form,
      form_multipart,
      hyperlink;

  beforeEach(function() {
    $.jasmine.inject('<div id="ajax-content"></div>');

    $.jasmine.inject('<form id="form_id" action="spec/fixtures/view.html"\
                            method="post"\
                            data-remote="true">\
                      </form>');
    form = $('form[data-remote]');

    $.jasmine.inject('<a id="hyperlink_id" href="spec/fixtures/view.html"\
                         data-remote="true" pass="#ajax-content">remote_link</a>');
    hyperlink = $('a[data-remote]');
  });

  describe('Cruyff Setup', function() {
    it('overrides rails ajax call', function() {
      spyOn($.cruyff, 'ajax');
      $.rails.ajax('options');
      expect($.cruyff.ajax).toHaveBeenCalled();
    });

    it('calls jquery ajax',function() {
      var callback = jasmine.createSpy();
      spyOn($, 'ajax').andCallFake(callback);
      $.cruyff.ajax('options');
      expect($.ajax).toHaveBeenCalled();
    });

    it('setups element',function(){
      runs(function() {
        hyperlink.trigger('click');
      });
      waits(100);
      runs(function() {
        expect($.cruyffSettings.element[0].id).toEqual("hyperlink_id");
      });
    });
  });

  describe('Render Ajax response', function() {
    it('renders success response',function(){
      runs(function() {
        hyperlink.trigger('click');
      });
      waits(100);
      runs(function() {
        expect($('#ajax-content').html()).toMatch('view html');
      });
    });

    it('renders error response',function(){
      $.cruyffSettings.error500page = "spec/fixtures/500.html";
      hyperlink.attr('href', 'bad/url');
      runs(function() {
        hyperlink.trigger('click');
      });
      waits(100);
      runs(function() {
        expect($('#ajax-content').html()).toMatch("We're sorry, but something went wrong");
      });
    });

  });

  describe('Upload files', function() {
    beforeEach(function() {
      $.jasmine.inject('<form id="form_multipart" action="spec/fixtures/view.html"\
                              method="post"\
                              enctype="multipart/form-data"\
                              pass="#ajax-content"\
                              data-remote="true">\
                          <input type="file">\
                        </form>');
      form_multipart = $('#form_multipart');
    });

    it('uploads files by jquery-form',function() {
      var call_ajax_submit = jasmine.createSpy();
      spyOn(form_multipart, 'ajaxSubmit').andCallFake(call_ajax_submit);
      var call_ajax = jasmine.createSpy();
      spyOn($, 'ajax').andCallFake(call_ajax);
      $.cruyff.ajax('options', form_multipart);
      expect(call_ajax_submit).toHaveBeenCalled();
      expect(call_ajax).not.toHaveBeenCalled();
    });
  });

  describe('Bookmark Ajax', function() {
    it('gets next url', function() {
      expect($.cruyff.nextUrl(hyperlink)).toEqual('spec/fixtures/view.html');
      expect($.cruyff.nextUrl(form)).toEqual('spec/fixtures/view.html');
    });

    it('bookmarks ajax success calls',function() {
      runs(function() {
        hyperlink.trigger('click');
      });
      waits(100);
      runs(function() {
        expect($.bbq.getState($.cruyffSettings.appName)).toEqual('spec/fixtures/view.html');
      });
    });

    it('bookmarks ajax error calls',function(){
      hyperlink.attr('href', 'bad/url');
      runs(function() {
        hyperlink.trigger('click');
      });
      waits(100);
      runs(function() {
        expect($.bbq.getState($.cruyffSettings.appName)).toEqual('bad/url');
      });
    });

    it('sets app name',function() {
      runs(function() {
        $.cruyffSettings.appName = 'setted_app_name';
        hyperlink.trigger('click');
      });
      waits(100);
      runs(function() {
        expect($.bbq.getState('setted_app_name')).toEqual('spec/fixtures/view.html');
      });
    });

    xit('loads browser url',function() {
      $.bbq.pushState('app=spec/fixtures/view.html');
      expect($.fn.cruyffUrl).toEqual('spec/fixtures/view.html');
    });

  });

});
