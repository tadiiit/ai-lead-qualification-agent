import React from "react";


import HubSpotHeader from "../../../components/hubspot/HubSpotHeader.jsx";
import ConnectionCard from "../../../components/hubspot/ConnectionCard.jsx";
import LeadSyncCard from "../../../components/hubspot/LeadSyncCard.jsx";
import RecordCreationCard from "../../../components/hubspot/RecordCreationCard.jsx";
import EvaluationMappingCard from "../../../components/hubspot/EvaluationMappingCard.jsx";
import CustomPropertiesCard from "../../../components/hubspot/CustomPropertiesCard.jsx";
import DeliveryHistory from "../../../components/hubspot/DeliveryHistoryCard.jsx";
import DisconnectCard from "../../../components/hubspot/DisconnectCard.jsx";
import "../../../components/hubspot/HubSpotIntegration.css";

export default function HubSpotIntegration() {
    return (
        <div className="hubspot-page">
            <div className="hubspot-container">

                <HubSpotHeader/>

                <div className="hubspot-grid">

                    {/* Connection */}
                    <section className="hubspot-section full-width">
                        <ConnectionCard />
                    </section>

                    {/* Hot lead automation */}
                    <section className="hubspot-section">
                        <LeadSyncCard />
                    </section>

                    {/* Contact / Deal / Company */}
                    <section className="hubspot-section">
                        <RecordCreationCard />
                    </section>

                    {/* Evaluation result */}
                    <section className="hubspot-section">
                        <EvaluationMappingCard />
                    </section>

                    {/* Custom properties */}
                    <section className="hubspot-section">
                        <CustomPropertiesCard />
                    </section>

                    {/* Delivery history */}
                    <section className="hubspot-section full-width">
                        <DeliveryHistory />
                    </section>

                    {/* Disconnect */}
                    <section className="hubspot-section full-width">
                        <DisconnectCard />
                    </section>

                </div>
            </div>
        </div>
    );
}