import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../API_BASE_URL.js";

const API_URL = `${API_BASE_URL}`;
 //const API_URL = ${process.env.React_APP_API_URL}

export default function ConnectionCard() {

    const [connected, setConnected] = useState(false);
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);

    useEffect(() => {
        loadConnection();
    }, []);

    const loadConnection = async () => {
        const token = localStorage.getItem("jwtToken");

        if (!token){
            setLoading(false)
            console.error("Please login first")
            return;
        }
        try {
            const response = await fetch(

                `${API_URL}/api/integrations/hubspot/status`,

                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Unable to load HubSpot status");
            }

            const data = await response.json();

            setConnected(data.connected);
            setAccount(data.account);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const connectHubSpot = async () => {
        const token = localStorage.getItem("jwtToken");

        if (!token) {
            console.error("Please log in first.");
            return;
        }

        try {
            setConnecting(true);

            const response = await fetch(
                `${API_URL}/api/integrations/hubspot/connect`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            if (!response.ok) {
                const errorText = await response.text();

                throw new Error(
                    `HubSpot connection failed (${response.status}): ${errorText}`
                );
            }

            const data = await response.json();

            if (!data.authorizationUrl) {
                throw new Error("Authorization URL was not returned.");
            }

            window.location.href = data.authorizationUrl;

        } catch (error) {
            console.error(error);
            setConnecting(false);
        }
    };

    if (loading) {
        return (
            <div className="integration-card">
                <div className="loading-text">
                    Loading HubSpot connection...
                </div>
            </div>
        );
    }

    return (
        <div className="integration-card">

            <div className="card-header">

                <div>
                    <h2>HubSpot Connection</h2>

                    <p>
                        Connect your HubSpot account to send qualified
                        leads automatically.
                    </p>
                </div>

                <div
                    className={
                        connected
                            ? "connection-status connected"
                            : "connection-status disconnected"
                    }
                >
                    <span />
                    {connected ? "Connected" : "Not connected"}
                </div>

            </div>

            {connected ? (

                <div className="connected-content">

                    <div className="account-info">

                        <div className="account-icon">
                            H
                        </div>

                        <div>
                            <strong>
                                {account?.name || "HubSpot Account"}
                            </strong>

                            <span>
                {account?.email || "Connected account"}
              </span>
                        </div>

                    </div>

                    <div className="connection-actions">

                        <button
                            className="secondary-button"
                            onClick={loadConnection}
                        >
                            Refresh
                        </button>

                        <span className="secure-label">
              🔒 OAuth secured
            </span>

                    </div>

                </div>

            ) : (

                <div className="connect-content">

                    <div className="connect-description">
                        <div className="feature-check">✓</div>

                        <div>
                            <strong>
                                Connect your HubSpot CRM
                            </strong>

                            <p>
                                Authorize your HubSpot account to allow
                                your application to create contacts,
                                deals and companies.
                            </p>
                        </div>
                    </div>

                    <button
                        className="primary-button"
                        onClick={connectHubSpot}
                        disabled={connecting}
                    >
                        {connecting
                            ? "Connecting..."
                            : "Connect HubSpot"}
                    </button>

                </div>

            )}

        </div>
    );
}
