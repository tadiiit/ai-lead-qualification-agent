package com.myapp.aileadqualificationagent.service.integration.hubspot;

import com.myapp.aileadqualificationagent.config.HubSpotProperties;
import com.myapp.aileadqualificationagent.model.integration.HubSpotConnection;
import com.myapp.aileadqualificationagent.model.user.User;
import com.myapp.aileadqualificationagent.repository.integration.HubSpotConnectionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Instant;

@Service
public class HubSpotAuthService {

    private final HubSpotProperties properties;
    private final RestClient restClient;
    private final HubSpotConnectionRepository hubSpotConnectionRepository;

    @Value("${hubspot.client-id}")
    private String clientId;

    @Value("${hubspot.client-secret}")
    private String clientSecret;

    @Value("${hubspot.redirect-uri}")
    private String redirectUri;

    public HubSpotAuthService(HubSpotProperties properties, RestClient restClient, HubSpotConnectionRepository hubSpotConnectionRepository) {
        this.properties = properties;
        this.restClient = restClient;
        this.hubSpotConnectionRepository = hubSpotConnectionRepository;
    }

    public String buildAuthorizationUrl(String state) {

        return UriComponentsBuilder
                .fromUriString("https://app.hubspot.com/oauth/authorize")
                .queryParam("client_id",
                        properties.getClientId())
                .queryParam("redirect_uri", properties.getRedirectUri())
                .queryParam("scope", "crm.objects.contacts.write" +
                        "crm.objects.contacts.read")
                .queryParam("state", state)
                .build()
                .encode()
                .toUriString();
    }

    public HubSpotTokenResponse exchangeAuthorizationCode(String code) {

        // We will implement the HubSpot OAuth
        // token exchange here.

        return restClient.post()
                .uri("https://api.hubapi.com/oauth/v1/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(
                        "grant_type=authorization_code"
                                + "&client_id=" + clientId
                                + "&client_secret=" + clientSecret
                                + "&redirect_uri=" + redirectUri
                                + "&code=" + code
                )
                .retrieve()
                .body(HubSpotTokenResponse.class);
    }


    public void storeHubspot(HubSpotTokenResponse response , User user
    ){

        HubSpotConnection hubSpotConnection = new HubSpotConnection();
        hubSpotConnection.setUser(user);
        hubSpotConnection.setAccessToken(response.getAccessToken());
        hubSpotConnection.setRefreshToken(response.getRefreshToken());
       hubSpotConnection.setAccessTokenExpiresAt(Instant.now().plusSeconds(response.getExpiresIn()));

        hubSpotConnectionRepository.save(hubSpotConnection);

    }


}
