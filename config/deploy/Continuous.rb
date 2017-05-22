server "#{fetch(:DEPLOY_CONTINUOUS_SERVER)}", user: "#{fetch(:DEPLOY_TEST_USER)}", roles: %w{app db web}
if "#{fetch(:branch)}" == "master"
  set :current_domain, "#{fetch(:application)}.#{fetch(:DEPLOY_CONTINUOUS_DOMAIN}"
else
  set :current_domain, "test-#{fetch(:BRANCH)}.#{fetch(:DEPLOY_CONTINUOUS_DOMAIN}"
end
set :default_domain, "#{fetch(:application)}.#{fetch(:DEPLOY_CONTINUOUS_DOMAIN}"
set :default_deploy_to, "/var/www/vhosts/#{fetch(:default_domain)}"
set :deploy_to, "/var/www/vhosts/#{fetch(:current_domain)}"
set :keep_releases, 1