
# Cruyff

Cruyff is a Ajax CRUD solution for Rails applications.

# Installation

For automated installation, use the "cruyff-rails" generator:

    # Gemfile
    gem 'cruyff-rails', '>= 0.1.0'

And run this command (add `-ui` if you want jQuery UI):

    $ bundle install
    $ rails generate cruyff:install

This will remove the Prototype.js library from Rails, add latest jQuery library and fetch the adapter. Be sure to choose to overwrite the "rails.js" file.

### Manual installation

Download [jQuery][jquery], ["jquery.ba-bbq.js"][jquery.bbq], ["jquery.form.js"][jquery.form], ["jquery.cruyff.js"][jquery.cruyff] and ["rails.js"][adapter] and place them in your "javascripts" directory.

Configure the following in your application startup file:

    config.action_view.javascript_expansions[:defaults] = %w(jquery rails jquery.cruyff jquery.form jquery.ba-bbq)

Now the template helper `javascript_include_tag :defaults` will generate SCRIPT tags to load jQuery and rails.js.

## License 

(The MIT License)

Copyright (c) 2011

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[jquery]: http://docs.jquery.com/Downloading_jQuery
[adapter]: https://github.com/andref5/cruyff/raw/master/lib/generators/cruyff/templates/rails.js
[jquery.cruyff]: https://github.com/andref5/cruyff/raw/master/lib/generators/cruyff/templates/jquery.cruyff.js
[jquery.bbq]: https://github.com/cowboy/jquery-bbq/raw/master/jquery.ba-bbq.js
[jquery.form]: https://github.com/malsup/form/raw/master/jquery.form.js
