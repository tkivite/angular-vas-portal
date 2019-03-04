class UsersController < ApplicationController
    before_action :set_user, only: [:show, :update, :destroy]
  
    # GET /users
    def index
      @users = User.all
      begin  

        #these parameters will become configs
        api_key    = 'iPay-staging'
        api_secret = '3e8015a89d10b316f1ca7433516f5b3eb386817f80b5ed7fb7c45aa77be29f7e8b98404d9e727d64'
        timestamp = Time.now().iso8601
        store_name = "jkiarie"
        lipalater_core_base_url = "http://localhost:3000";
        request_method = "GET"
        request_string = "/partners_api/v1/partners/#{store_name}" 
        request_params = ""  

        # The request string we want to hash
        request_string1 = "#{request_method}\n#{request_string}\n#{request_params}\nApiKey=#{api_key}\nTimestamp=#{timestamp}\n"
                      
        # Create an HMAC
        hmac = OpenSSL::HMAC.digest(OpenSSL::Digest.new('sha256'), api_secret, request_string1)
        # Base 64 encode the HMAC
        base64_signature = Base64.encode64(hmac)
        # Remove whitespace, new lines and trailing equal 
        base64_signature = base64_signature.strip().chomp("=")   
        
        Rails.logger.info "Canonical Request String: #{request_string1}"
        Rails.logger.info "API Seceret: #{api_secret}"
        Rails.logger.info "Computed Signature: #{base64_signature}"
   
        response = RestClient.get "#{lipalater_core_base_url}#{request_string}",
         { content_type: :json, accept: :json, 'X-Authorization-Signature': "#{base64_signature}", 
        'X-Authorization-Timestamp': "#{timestamp}",'Authorization': "LIPALATER-HMAC-SHA256",'X-Authorization-ApiKey': "iPay-staging" }
        puts "----------------------------------------"
        puts "The response when fetching partners from core using canonical request: #{response}"
        puts "----------------------------------------"   
        body = response.body
        data = JSON.parse body  
        puts "The response body when fetching partners from core using canonical request: #{data}"
        @users = data           
            

      rescue StandardError => e
          puts "----------------------------------------"
          msg = "Error detected when fetching apps for a store. I'm sad!: #{e.inspect}"
          puts msg
          puts "------------------------------------------"
          @users = '{"data":"Errors"}'          
      end
      json_response(@users)
    end
  
    # POST /users
    def create
      @user = User.create!(user_params)
      json_response(@user, :created)
    end
  
    # GET /users/:id
    def show
      json_response(@user)
    end
  
    # PUT /users/:id
    def update
      @user.update(user_params)
      head :no_content
    end
  
    # DELETE /users/:id
    def destroy
      @user.destroy
      head :no_content
    end
  
    private
  
    def user_params
      # whitelist params
      params.permit(:title, :created_by)
    end
  
    def set_user
      @user = User.find(params[:id])
    end
    def get_apps_by_store
      
    end
  end