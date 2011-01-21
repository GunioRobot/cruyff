module Cruyff
  module Generators
    class InstallGenerator < ::Rails::Generators::Base
      desc "This generator downloads and installs jQuery, jQuery-ujs HEAD, and (optionally) the newest jQuery UI"
      class_option :ui, :type => :boolean, :default => false, :desc => "Include jQueryUI"
      class_option :version, :type => :string, :default => "1.4.4", :desc => "Which version of jQuery to fetch"
      @@default_version = "1.4.4"

      def remove_prototype
        %w(controls.js dragdrop.js effects.js prototype.js).each do |js|
          remove_file "public/javascripts/#{js}"
        end
      end

      def download_jquery
        say_status("fetching", "jQuery (#{options.version})", :green)
        get_jquery(options.version)
      rescue OpenURI::HTTPError
        say_status("warning", "could not find jQuery (#{options.version})", :yellow)
        say_status("fetching", "jQuery (#{@@default_version})", :green)
        get_jquery(@@default_version)
      end

      def download_jquery_ui
        if options.ui?
          say_status("fetching", "jQuery UI (latest 1.x release)", :green)
          get "http://ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui.js",     "public/javascripts/jquery-ui.js"
          get "http://ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui.min.js", "public/javascripts/jquery-ui.min.js"
        end
      end

      def download_ujs_driver
        say_status("fetching", "jQuery UJS Cruyff adapter (github HEAD)", :green)
        get "https://github.com/andref5/cruyff/raw/master/lib/generators/cruyff/templates/rails.js", "public/javascripts/rails.js"
      end

      def download_cruyff
        say_status("fetching", "jQuery Cruyff plugin (github HEAD)", :green)
        get "https://github.com/andref5/cruyff/raw/master/lib/generators/cruyff/templates/jquery.cruyff.js", "public/javascripts/jquery.cruyff.js"
      end

      def download_jquery_bbq
        say_status("fetching", "jQuery BBQ plugin: Back Button & Query Library (github HEAD)", :green)
        get "https://github.com/cowboy/jquery-bbq/raw/master/jquery.ba-bbq.js", "public/javascripts/jquery.ba-bbq.js"
      end

      def download_jquery_form
        say_status("fetching", "jQuery Form plugin (github HEAD)", :green)
        get "https://github.com/malsup/form/raw/master/jquery.form.js", "public/javascripts/jquery.form.js"
      end

    private

      def get_jquery(version)
        get "http://ajax.googleapis.com/ajax/libs/jquery/#{version}/jquery.js",     "public/javascripts/jquery.js"
        get "http://ajax.googleapis.com/ajax/libs/jquery/#{version}/jquery.min.js", "public/javascripts/jquery.min.js"
      end

    end
  end
end
