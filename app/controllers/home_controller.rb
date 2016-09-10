class HomeController < ApplicationController

  require 'google/apis/drive_v2'
  require 'google/api_client/client_secrets'

  def index

    # # access_token = "244187580448-t291it58t1q7rvg0lt1gec3b4is7aorf.apps.googleusercontent.com"
    # access_token = "AMaj9sjPieGBgWIth1x-35hH"

    # user = Legato::User.new(access_token)

    # users = user.accounts
    # profile - user.accounts.first.profiles

    # byebug

    # query = Exit.realtime
    # query.realtime? #=> true
    # query.tracking_scope #=> 'rt'


    # byebug

    # client_secrets = Google::APIClient::ClientSecrets.load
    # auth_client = client_secrets.to_authorization
    # auth_client.update!(
    #   :scope => 'https://www.googleapis.com/auth/drive.metadata.readonly',
    #   :redirect_uri => 'http://www.example.com/oauth2callback'
    # )

  end

end
