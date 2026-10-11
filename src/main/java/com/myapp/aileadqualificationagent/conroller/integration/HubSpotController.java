package com.myapp.aileadqualificationagent.conroller.integration;

import com.myapp.aileadqualificationagent.model.user.User;
import com.myapp.aileadqualificationagent.service.integration.hubspot.HubSpotAuthService;
import com.myapp.aileadqualificationagent.service.integration.hubspot.HubSpotOAuthStateService;
import com.myapp.aileadqualificationagent.service.integration.hubspot.HubSpotTokenResponse;
import com.myapp.aileadqualificationagent.service.user.UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URI;
import java.util.Map;

@RestController
@RequestMapping("/api/integrations/hubspot")
public class HubSpotController {
    private final HubSpotAuthService hubSpotAuthService;
    private final UserService userService;
    private final HubSpotOAuthStateService hubSpotOAuthStateService;

    public HubSpotController(HubSpotAuthService hubSpotAuthService, UserService userService, HubSpotOAuthStateService hubSpotOAuthStateService) {
        this.hubSpotAuthService = hubSpotAuthService;
        this.userService = userService;
        this.hubSpotOAuthStateService = hubSpotOAuthStateService;
    }

    @GetMapping("/connect")
    public ResponseEntity<?> connect(@AuthenticationPrincipal UserDetails details) throws IOException {

        if (details == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Please log in first"));
        }
         String email = details.getUsername();

         //Getting the user details from userservice
        User user = userService.getUser(email);

        //Generate and store a random oauth state for this user
          String state = hubSpotOAuthStateService.createState(user.getId());
        // Build HubSpot OAuth authorization URL
        String authorizationUrl = hubSpotAuthService.buildAuthorizationUrl(state);
        // and redirect the browser to HubSpot.
        return ResponseEntity.ok(
                java.util.Map.of(
                        "authorizationUrl", authorizationUrl
                )
        );
    }

    @GetMapping("/callback")
    public ResponseEntity<?> callback(
            @RequestParam String code,
            @RequestParam String state
    ) {

        try {
            // Validate OAuth state and retrieve the initiating user
            Long userId =
                    hubSpotOAuthStateService.validateAndConsumeState(state);

            User user = userService.getUserById(userId);

            // Exchange authorization code for HubSpot tokens
            HubSpotTokenResponse tokenResponse =
                    hubSpotAuthService.exchangeAuthorizationCode(code);

            // Save the HubSpot connection
            hubSpotAuthService.storeHubspot(tokenResponse, user);

            // Redirect to the React integration page
            return ResponseEntity.status(302)
                    .location(URI.create(
                            "http://localhost:5173/integrations/crm/hubspot?connected=true"
                    ))
                    .build();

        } catch (Exception ex) {
            // Log the actual exception on the server
            ex.printStackTrace();

            return ResponseEntity.status(302)
                    .location(URI.create(
                            "http://localhost:5173/integrations/crm/hubspot?connected=false"
                    ))
                    .build();
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> status(
            @AuthenticationPrincipal UserDetails details
    ) {
        if (details == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Please log in first"));
        }

        String email = details.getUsername();
        User user = userService.getUser(email);

        // Retrieve this user's HubSpot connection here.
        // Return the actual connection status.

        return ResponseEntity.ok(
                Map.of("connected", true)
        );
    }

}
