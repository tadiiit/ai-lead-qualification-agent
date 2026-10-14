import React, { useState } from "react";
import API_BASE_URL from "../../API_BASE_URL.js";

const API_URL = `${API_BASE_URL}/api/integrations/hubspot`;

export default function DisconnectCard() {

    const [loading, setLoading] = useState(false);

    const disconnect = async () => {

        const confirmed = window.confirm(
            "Are you sure you want to disconnect HubSpot? " +
            "Your application will stop sending leads to HubSpot."
        );

        if (!confirmed) {
            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                `${API_URL}/disconnect`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error("Unable to disconnect HubSpot");
            }

            window.location.reload();

        } catch (error) {

            console.error(error);

            alert(
                "Unable to disconnect HubSpot. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="danger-card">

            <div>

                <h2>Disconnect HubSpot</h2>

                <p>
                    Disconnecting will stop automatic lead delivery
                    to HubSpot. Your existing delivery history will
                    remain in your application.
                </p>

            </div>

            <button
                className="danger-button"
                onClick={disconnect}
                disabled={loading}
            >
                {loading
                    ? "Disconnecting..."
                    : "Disconnect HubSpot"}
            </button>

        </div>
    );
}