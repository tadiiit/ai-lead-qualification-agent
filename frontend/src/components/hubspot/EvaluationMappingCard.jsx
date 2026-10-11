import React, { useState } from "react";

export default function EvaluationMappingCard() {

    const [sendScore, setSendScore] = useState(true);
    const [sendCategory, setSendCategory] = useState(true);
    const [sendReason, setSendReason] = useState(true);
    const [sendRecommendation, setSendRecommendation] = useState(true);

    return (
        <div className="integration-card">

            <div className="card-header">

                <div>
                    <h2>Evaluation Results</h2>

                    <p>
                        Send your application's lead evaluation
                        results to HubSpot.
                    </p>
                </div>

            </div>

            <div className="mapping-list">

                <MappingRow
                    name="Lead Score"
                    example="92 / 100"
                    checked={sendScore}
                    onChange={setSendScore}
                />

                <MappingRow
                    name="Lead Category"
                    example="HOT"
                    checked={sendCategory}
                    onChange={setSendCategory}
                />

                <MappingRow
                    name="Evaluation Reason"
                    example="High buying intent"
                    checked={sendReason}
                    onChange={setSendReason}
                />

                <MappingRow
                    name="AI Recommendation"
                    example="Contact immediately"
                    checked={sendRecommendation}
                    onChange={setSendRecommendation}
                />

            </div>

            <button className="secondary-button">
                Save Mapping
            </button>

        </div>
    );
}

function MappingRow({
                        name,
                        example,
                        checked,
                        onChange
                    }) {

    return (
        <label className="mapping-row">

            <input
                type="checkbox"
                checked={checked}
                onChange={(e) =>
                    onChange(e.target.checked)
                }
            />

            <div className="mapping-name">
                <strong>{name}</strong>
            </div>

            <div className="mapping-example">
                {example}
            </div>

        </label>
    );
}