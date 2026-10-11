import React, { useState } from "react";

export default function RecordCreationCard() {

    const [createContact, setCreateContact] = useState(true);
    const [createCompany, setCreateCompany] = useState(true);
    const [createDeal, setCreateDeal] = useState(true);

    return (
        <div className="integration-card">

            <div className="card-header">

                <div>
                    <h2>CRM Records</h2>

                    <p>
                        Choose what should be created in HubSpot
                        when a hot lead is delivered.
                    </p>
                </div>

            </div>

            <div className="record-options">

                <RecordOption
                    title="Create Contact"
                    description="Create or update the lead as a HubSpot contact."
                    checked={createContact}
                    onChange={setCreateContact}
                />

                <RecordOption
                    title="Create Company"
                    description="Create or associate the lead's company."
                    checked={createCompany}
                    onChange={setCreateCompany}
                />

                <RecordOption
                    title="Create Deal"
                    description="Create a sales deal for the qualified lead."
                    checked={createDeal}
                    onChange={setCreateDeal}
                />

            </div>

            <div className="association-preview">

                <span>Relationship</span>

                <div className="relationship-flow">

                    <div className="flow-item">
                        Contact
                    </div>

                    <span>→</span>

                    <div className="flow-item">
                        Company
                    </div>

                    <span>→</span>

                    <div className="flow-item">
                        Deal
                    </div>

                </div>

            </div>

            <button className="secondary-button">
                Save CRM Settings
            </button>

        </div>
    );
}

function RecordOption({
                          title,
                          description,
                          checked,
                          onChange
                      }) {

    return (
        <label className="record-option">

            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />

            <div>

                <strong>{title}</strong>

                <p>{description}</p>

            </div>

        </label>
    );
}
