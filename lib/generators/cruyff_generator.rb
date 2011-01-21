require 'rails/generators'

class CruyffGenerator < Rails::Generators::Base
  def self.source_root
    File.join(File.dirname(__FILE__), 'templates')
  end
  
  def install_cruyff
    copy_file(
      'jquery.cruyff.js',
      'public/javascripts/jquery.cruyff.js'
    )
  end
end
