server "#{fetch(:DEPLOY_TEST_SERVER)}", user: "#{fetch(:DEPLOY_TEST_USER)}", roles: %w{app db web}
if "#{fetch(:BRANCH)}" == "master"
  set :current_domain, "#{fetch(:application)}.#{fetch(:DEPLOY_TEST_DOMAIN}"
else
  set :current_domain, "test-#{fetch(:branch)}.#{fetch(:DEPLOY_TEST_DOMAIN}"
end
set :default_domain, "#{fetch(:application)}.#{fetch(:DEPLOY_TEST_DOMAIN}"
set :default_deploy_to, "/var/www/vhosts/#{fetch(:default_domain)}"
set :deploy_to, "/var/www/vhosts/#{fetch(:current_domain)}"
set :keep_releases, 1