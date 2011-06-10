# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)
require "cruyff/version"

Gem::Specification.new do |s|
  s.name        = "cruyff"
  s.version     = Cruyff::VERSION
  s.platform    = Gem::Platform::RUBY
  s.authors     = ["Charger Tec"]
  s.email       = ["DM @andrefarina"]
  s.homepage    = "https://github.com/andref5/cruyff"
  s.summary     = %q{Ajax CRUD solution for Rails applications.}
  s.description = %q{Cruyff is a Ajax CRUD solution for Rails applications.}

  s.add_dependency("jquery-rails", "~> 1.0.7")

  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  s.require_paths = ["lib"]
end
