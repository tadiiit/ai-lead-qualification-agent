import React from "react";
import { useNavigate } from "react-router-dom";
import "./CRMintegration.css"

const integrations = [
    {
        id: "hubspot",
        name: "HubSpot",
        description: "Connect your HubSpot account to sync CRM data.",
        logo: "https://cdn.simpleicons.org/hubspot/FF7A59",
        available: true,
    },
    {
        id: "zoho",
        name: "Zoho CRM",
        description: "Manage leads and customer relationships.",
        logo: "https://cdn.simpleicons.org/zoho/E42527",
        available: false,
    },
    {
        id: "salesforce",
        name: "Salesforce",
        description: "Connect your sales pipeline and customer data.",
        logo: "https://cdn.simpleicons.org/salesforce/00A1E0",
        available: false,
    },
    {
        id: "pipedrive",
        name: "Pipedrive",
        description: "Manage deals and sales activities.",
        logo: "https://cdn.simpleicons.org/pipedrive/2D9B63",
        available: false,
    },
];

export default function CRMIntegrations() {
    const navigate = useNavigate();

    const handleConnect = (crm) => {
        if (crm.id === "hubspot") {
            navigate("/integrations/crm/hubspot");
        }
    };

    return (
        <main className="crm-page">
            <div className="crm-container">
                <header className="crm-header">
                    <h1>CRM Integrations</h1>
                    <p>
                        Connect your CRM tools to manage your customer data
                        in one place.
                    </p>
                </header>

                <section className="crm-grid">
                    {integrations.map((crm) => (
                        <article className="crm-card" key={crm.id}>
                            <div className="crm-card-header">
                                <div className="crm-logo">
                                    <img src={crm.logo} alt={`${crm.name} logo`} />
                                </div>

                                <span
                                    className={`crm-status ${
                                        crm.available ? "available" : "coming-soon"
                                    }`}
                                >
                  {crm.available ? "Available" : "Coming Soon"}
                </span>
                            </div>

                            <h2>{crm.name}</h2>
                            <p className="crm-description">{crm.description}</p>

                            {crm.available ? (
                                <button
                                    className="crm-button connect-button"
                                    onClick={() => handleConnect(crm)}
                                    type="button"
                                >
                                    Connect HubSpot
                                </button>
                            ) : (
                                <button
                                    className="crm-button disabled-button"
                                    type="button"
                                    disabled
                                >
                                    Coming Soon
                                </button>
                            )}
                        </article>
                    ))}
                </section>
            </div>
        </main>
    );
}

