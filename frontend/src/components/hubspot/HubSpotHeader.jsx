import React from "react";

export default function HubSpotHeader() {
    return (
        <div className="hubspot-dashboard-header">

            <div className="header-left">

                <div className="hubspot-brand-icon">
                    H
                </div>

                <div>
                    <h1>HubSpot Integration</h1>

                    <p>
                        Manage your HubSpot CRM connection and lead delivery.
                    </p>
                </div>

            </div>

            <div className="integration-badge">
                <span className="online-dot" />
                CRM Integration
            </div>

        </div>
    );
}
