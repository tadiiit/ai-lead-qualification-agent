import React, { useState } from "react";

export default function LeadSyncCard() {

    const [enabled, setEnabled] = useState(true);
    const [minimumScore, setMinimumScore] = useState(80);

    const saveSettings = async () => {

        console.log({
            enabled,
            minimumScore
        });

        // Later:
        // PUT /api/integrations/hubspot/settings
    };

    return (
        <div className="integration-card">

            <div className="card-header">

                <div>
                    <h2>Hot Lead Automation</h2>

                    <p>
                        Automatically send qualified leads to HubSpot.
                    </p>
                </div>

                <label className="switch">

                    <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                    />

                    <span className="slider" />

                </label>

            </div>

            {enabled && (

                <div className="settings-content">

                    <label className="field-label">
                        Minimum lead score
                    </label>

                    <div className="score-input">

                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={minimumScore}
                            onChange={(e) =>
                                setMinimumScore(e.target.value)
                            }
                        />

                        <span>/ 100</span>

                    </div>

                    <p className="field-help">
                        Leads with a score equal to or higher than this
                        value will be sent to HubSpot.
                    </p>

                    <div className="automation-preview">

                        <span>Example</span>

                        <strong>
                            Score 92 → Send to HubSpot
                        </strong>

                    </div>

                    <button
                        className="secondary-button"
                        onClick={saveSettings}
                    >
                        Save Settings
                    </button>

                </div>
            )}

        </div>
    );
}
