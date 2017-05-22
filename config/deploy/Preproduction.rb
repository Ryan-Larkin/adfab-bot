server "#{fetch(:DEPLOY_PREPRODUCTION_SERVER)}", user: "#{fetch(:DEPLOY_PREPRODUCTION_USER)}", roles: %w{app db web}
set :current_domain, "#{fetch(:DEPLOY_PREPRODUCTION_DOMAIN)}"
set :default_domain, "#{fetch(:DEPLOY_PREPRODUCTION_DOMAIN)}"
set :default_deploy_to, "/var/www/vhosts/#{fetch(:default_domain)}"
set :deploy_to, "/var/www/vhosts/#{fetch(:current_domain)}"