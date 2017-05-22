set :application, "kpi"
set :branch, ENV['branch'] || 'master'
set :exclude_dir, ["build",".svn", ".git", ".gitignore", "Capfile", "README.md", "readme.txt", "README.txt", "Changelog.txt", "CHANGELOG.txt", "CHANGELOG.md"]
set :include_dir, '.'
set :linked_dirs, ["public/uploads"]
set :log_level, :error
set :repo_url, "git@github.com:AdFabConnect/kpi.git"
set :scm, :copy
set :stages, %w(Continuous Test Preproduction Production)
set :use_sudo, false

namespace :deploy do
  before :starting, :branchhosting
  before :starting, :htaccess
  before :publishing, :copyconfig
  before :finishing, :clean
  after :finished, :varnish
end