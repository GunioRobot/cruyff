describe('Cruyff',function() {
  var form,
      form_multipart,
      hyperlink;

  beforeEach(function() {
    $.jasmine.inject('<div id="ajax-content"></div>');

    $.jasmine.inject('<form id="form_id" action="spec/fixtures/view"\
                            method="post"\
                            data-remote="true" pass="ajax-content">\
                      </form>');
    form = $('form[data-remote]');

    $.jasmine.inject('<a id="hyperlink_id" href="spec/fixtures/view"\
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

    it('sets request format',function() {
      spyOn($, 'ajax');
      spyOn($.cruyff, 'setRequestFormat');
      $.cruyff.ajax({url: 'some/url'});
      expect($.cruyff.setRequestFormat).toHaveBeenCalledWith({url: 'some/url'});
    });

    it('gets url with format', function() {
      var options = {url: 'some/url'};
      $.cruyff.setRequestFormat(options);
      expect(options['url']).toEqual('some/url.html');
      $.cruyff.setRequestFormat(options);
      expect(options['url']).toEqual('some/url.html');
    });

    it('gets reponse fragment html', function() {
      var fragment = $.cruyff.fragment('#ajax-content', '<html><div id="ajax-content">only-inner-data</div><html>');
      expect(fragment).toEqual('only-inner-data');
      var fragment = $.cruyff.fragment('#ajax-content', 'data');
      expect(fragment).toEqual('data');
    });

    it('renders fragment data', function() {
      $.cruyff.render('#ajax-content', '<html><div id="ajax-content">data</div><html>');
      expect($('#ajax-content').html()).toMatch('data');
    });

    it('setups cruyff element',function() {
      runs(function() {
        hyperlink.trigger('click');
      });
      waits(100);
      runs(function() {
        expect($.cruyff.settings.element[0].id).toEqual("hyperlink_id");
      });
    });

    it('starts all elements',function() {
      $.jasmine.inject('<div id="main"><form id="form_to_start" action="#" method="#"></form></div>');
      $.jasmine.inject('<div id="main"><a id="link_to_start" href="#">remote_link</a></div>');

      $.cruyff.startAllElements('#main');

      var form_to_start = $('#form_to_start');
      var link_to_start = $('#link_to_start');

      expect(link_to_start.attr('data-remote')).toEqual('true');
      expect(link_to_start.attr('pass')).toEqual('#main');
      expect(form_to_start.attr('data-remote')).toEqual('true');
      expect(form_to_start.attr('pass')).toEqual('#main');

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
      $.cruyff.settings.error500page = "spec/fixtures/500.html";
      hyperlink.attr('href', 'bad/url');
      runs(function() {
        hyperlink.trigger('click');
      });
      waits(100);
      runs(function() {
        expect($('#ajax-content').html()).toMatch("We're sorry, but something went wrong");
      });
    });

    it('loads success url',function() {
      runs(function() {
        $.cruyff.load('spec/fixtures/view', '#ajax-content');
      });
      waits(100);
      runs(function() {
        expect($('#ajax-content').html()).toMatch('view html');
      });
    });

    it('loads error url',function() {
      runs(function() {
        $.cruyff.load('bad/url', '#ajax-content');
      });
      waits(100);
      runs(function() {
        expect($('#ajax-content').html()).toMatch("We're sorry, but something went wrong");
      });
    });
  });

  describe('Upload files', function() {
    beforeEach(function() {
      $.jasmine.inject('<form id="form_multipart" action="spec/fixtures/view"\
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
    it('bookmarks ajax success calls',function() {
      runs(function() {
        hyperlink.trigger('click');
      });
      waits(100);
      runs(function() {
        expect($.bbq.getState($.cruyff.settings.appName)).toEqual('spec/fixtures/view');
      });
    });

    it('bookmarks ajax error calls',function(){
      hyperlink.attr('href', 'bad/url');
      runs(function() {
        hyperlink.trigger('click');
      });
      waits(100);
      runs(function() {
        expect($.bbq.getState($.cruyff.settings.appName)).toEqual('bad/url');
      });
    });

    it('sets app name',function() {
      runs(function() {
        $.cruyff.settings.appName = 'setted_app_name';
        hyperlink.trigger('click');
      });
      waits(100);
      runs(function() {
        expect($.bbq.getState('setted_app_name')).toEqual('spec/fixtures/view');
      });
    });

    it('loads browser url',function() {
      spyOn($.cruyff, 'load');
      $.bbq.pushState('app=spec/fixtures/view');
      $.cruyff.loadBrowserUrl('#ajax-content');
      expect($.cruyff.load).toHaveBeenCalledWith('spec/fixtures/view', '#ajax-content');
    });

  });

});
