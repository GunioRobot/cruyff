(function($) {

  var cruyffSettings = {
    url: "",
    method: "",
    dataType: "",
    data: ""
  };

  $.fn.handleRemoteCrud = function(element) {
    var s = this.cruyffSetup(element);

    //call ajaxSubmit from jquery.form because provides a file upload mechanism.
    element.ajaxSubmit({
      url: s.url,
      type: s.method || 'GET',
      data: s.data,
      dataType: s.dataType,
      /**
      * Rails.js Code 2011-01-12
      **/
      // stopping the "ajax:beforeSend" event will cancel the ajax request
      beforeSend: function(xhr, settings) {
        if (settings.dataType === undefined) {
          xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
        }
        return fire(element, 'ajax:beforeSend', [xhr, settings]);
      },
      success: function(data, status, xhr) {
        element.trigger('ajax:success', [data, status, xhr]);
        console.log("data\n" + data);
      },
      complete: function(xhr, status) {
        element.trigger('ajax:complete', [xhr, status]);
      },
      error: function(xhr, status, error) {
        element.trigger('ajax:error', [xhr, status, error]);
        console.log("error\n"+error)
      }
      /**
      * End Rails.js
      **/
    });
  };

  $.fn.cruyffSetup = function(element) {
    var s = cruyffSettings;

    /**
    * Rails.js Code 2011-01-12
    **/
    s.dataType = element.attr('data-type') || ($.ajaxSettings && $.ajaxSettings.dataType);
  
    if (element.is('form')) {
      s.method = element.attr('method');
      s.url = element.attr('action');
      s.data = element.serializeArray();
      // memoized value from clicked submit button
      var button = element.data('ujs:submit-button');
      if (button) {
        s.data.push(button);
        element.data('ujs:submit-button', null);
      }
    } else {
      s.method = element.attr('data-method');
      s.url = element.attr('href');
      s.data = null;
    }
    /**
    * End Rails.js
    **/

    return s;
  };

  function handleRemote(element) {
    $.fn.handleRemoteCrud(element);
  }
/**
* Rails.js Code 2011-01-12. I don't know how to override inner functions yet.
**/
	function fire(obj, name, data) {
		var event = new $.Event(name);
		obj.trigger(event, data);
		return event.result !== false;
	}
	// Handles "data-method" on links such as:
	// <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
	function handleMethod(link) {
		var href = link.attr('href'),
			method = link.attr('data-method'),
			csrf_token = $('meta[name=csrf-token]').attr('content'),
			csrf_param = $('meta[name=csrf-param]').attr('content'),
			form = $('<form method="post" action="' + href + '"></form>'),
			metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

		if (csrf_param !== undefined && csrf_token !== undefined) {
			metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
		}

		form.hide().append(metadata_input).appendTo('body');
		form.submit();
	}

	function disableFormElements(form) {
		form.find('input[data-disable-with]').each(function() {
			var input = $(this);
			input.data('ujs:enable-with', input.val())
				.val(input.attr('data-disable-with'))
				.attr('disabled', 'disabled');
		});
	}

	function enableFormElements(form) {
		form.find('input[data-disable-with]').each(function() {
			var input = $(this);
			input.val(input.data('ujs:enable-with')).removeAttr('disabled');
		});
	}

	function allowAction(element) {
		var message = element.attr('data-confirm');
		return !message || (fire(element, 'confirm') && confirm(message));
	}

	$('a[data-confirm], a[data-method], a[data-remote]').live('click.rails', function(e) {
		var link = $(this);
		if (!allowAction(link)) return false;

		if (link.attr('data-remote')) {
			handleRemote(link);
			return false;
		} else if (link.attr('data-method')) {
			handleMethod(link);
			return false;
		}
	});

	$('form').live('submit.rails', function(e) {
		var form = $(this);
		if (!allowAction(form)) return false;

		if (form.attr('data-remote')) {
			handleRemote(form);
			return false;
		} else {
			disableFormElements(form);
		}
	});

	$('form input[type=submit], form button[type=submit], form button:not([type])').live('click.rails', function() {
		var button = $(this);
		if (!allowAction(button)) return false;
		// register the pressed submit button
		var name = button.attr('name'), data = name ? {name:name, value:button.val()} : null;
		button.closest('form').data('ujs:submit-button', data);
	});
	
	$('form').live('ajax:beforeSend.rails', function(event) {
		if (this == event.target) disableFormElements($(this));
	});

	$('form').live('ajax:complete.rails', function(event) {
		if (this == event.target) enableFormElements($(this));
	});
/**
* End Rails.js
**/
})( jQuery );
