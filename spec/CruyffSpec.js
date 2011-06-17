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

    it('overrides rails handleRemote call', function() {
      spyOn($.cruyff, 'handleRemote');
      $.rails.handleRemote(hyperlink);
      expect($.cruyff.handleRemote).toHaveBeenCalled();
    });
   
    it('not overrides rails handleRemote call', function() {
      spyOn($.cruyff, 'handleRemote');
      $.jasmine.inject('<a id="no_cruyff_link" href="#">link</a>');
      $.rails.handleRemote($('#no_cruyff_link'));
      expect($.cruyff.handleRemote).not.toHaveBeenCalled();
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
      expect(options['url']).toEqual('some/url.xhtml');
      $.cruyff.setRequestFormat(options);
      expect(options['url']).toEqual('some/url.xhtml');
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

    it('calls ready func', function() {
      spyOn($.cruyff, 'ready');
      runs(function() {
        hyperlink.trigger('click');
      });
      waits(100);
      runs(function() {
        expect($.cruyff.ready).toHaveBeenCalledWith('#ajax-content');
      });
    });

    it('renders loading content', function() {
      $.cruyff.startLoading('#ajax-content');
      expect($('#ajax-content').css('display')).toEqual('none');
      expect($('#cruyff-loading').length).toEqual(1);
      $.cruyff.finishLoading('#ajax-content');
      expect($('#ajax-content').css('display')).toEqual('block');
      expect($('#cruyff-loading').length).toEqual(0);
      runs(function() {
        spyOn($.cruyff, 'startLoading');
        spyOn($.cruyff, 'finishLoading');
        hyperlink.trigger('click');
      });
      waits(100);
      runs(function() {
        expect($.cruyff.startLoading).toHaveBeenCalledWith('#ajax-content');
        expect($.cruyff.finishLoading).toHaveBeenCalledWith('#ajax-content');
      });
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

    it('setups elements',function() {
      $.jasmine.inject('<div id="main"><form id="form_to_setup" action="/some/url"></form></div>');
      $.jasmine.inject('<div id="main"><a id="link_to_setup" href="/some/url">remote_link</a></div>');
      $.jasmine.inject('<div id="main"><form id="form_to_not_setup" action="#"></form></div>');
      $.jasmine.inject('<div id="main"><a id="link_to_not_setup" href="#">remote_link</a></div>');
      $.jasmine.inject('<div id="main"><a id="link_to_not_setup_2" href="">remote_link</a></div>');
      $.jasmine.inject('<div id="main"><a id="link_to_not_setup_3">remote_link</a></div>');

      $.cruyff.setUpElements('#main');

      expect($('#link_to_setup').attr('data-remote')).toEqual('true');
      expect($('#link_to_setup').attr('pass')).toEqual('#main');
      expect($('#form_to_setup').attr('data-remote')).toEqual('true');
      expect($('#form_to_setup').attr('pass')).toEqual('#main');
      expect($('#link_to_not_setup').attr('data-remote')).not.toBeDefined();
      expect($('#link_to_not_setup').attr('pass')).not.toBeDefined();
      expect($('#form_to_not_setup').attr('data-remote')).not.toBeDefined();
      expect($('#form_to_not_setup').attr('pass')).not.toBeDefined();
      expect($('#link_to_not_setup_2').attr('data-remote')).not.toBeDefined();
      expect($('#link_to_not_setup_2').attr('pass')).not.toBeDefined();
      expect($('#link_to_not_setup_3').attr('data-remote')).not.toBeDefined();
      expect($('#link_to_not_setup_3').attr('pass')).not.toBeDefined();
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

    it('starts success url',function() {
      runs(function() {
        $.bbq.pushState('start=');
        $.cruyff.settings.urlDesc = 'start';
        $.cruyff.start('start', 'spec/fixtures/view', '#ajax-content');
      });
      waits(100);
      runs(function() {
        expect($('#ajax-content').html()).toMatch('view html');
      });
    });

    it('setups elements on start',function() {
      runs(function() {
        spyOn($.cruyff, 'setUpElements');
        $.cruyff.start('start', 'spec/fixtures/view', '#ajax-content');
      });
      waits(100);
      runs(function() {
        expect($.cruyff.setUpElements).toHaveBeenCalledWith('#ajax-content');
      });
    });

    it('starts by broswer url',function() {
      runs(function() {
        $.bbq.pushState('start=spec/fixtures/view');
        $.cruyff.settings.urlDesc = 'start';
        $.cruyff.start('start', 'bad/url', '#ajax-content');
      });
      waits(100);
      runs(function() {
        expect($('#ajax-content').html()).toMatch('view html');
      });
    });

    it('starts error url',function() {
      runs(function() {
        $.bbq.pushState('start=');
        $.cruyff.settings.urlDesc = 'start';
        $.cruyff.start('start', 'bad/url', '#ajax-content');
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
        expect($.bbq.getState($.cruyff.settings.urlDesc)).toEqual('spec/fixtures/view');
      });
    });

    it('bookmarks ajax error calls',function(){
      hyperlink.attr('href', 'bad/url');
      runs(function() {
        hyperlink.trigger('click');
      });
      waits(100);
      runs(function() {
        expect($.bbq.getState($.cruyff.settings.urlDesc)).toEqual('bad/url');
      });
    });

    it('sets app name',function() {
      runs(function() {
        $.cruyff.settings.urlDesc = 'setted_url_desc';
        hyperlink.trigger('click');
      });
      waits(100);
      runs(function() {
        expect($.bbq.getState('setted_url_desc')).toEqual('spec/fixtures/view');
      });
    });
  });

});
