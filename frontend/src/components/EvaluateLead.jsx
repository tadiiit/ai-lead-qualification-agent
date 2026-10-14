import { useState } from "react";
import API_BASE_URL from "../API_BASE_URL.js";

function EvaluateLead({ lead, onClose }) {
    const evaluation = lead.evaluations?.[0];

    const [category, setCategory] = useState(
        evaluation?.category?.toUpperCase() || "WARM"
    );

    const [icpScore, setIcpScore] = useState(
        Number(evaluation?.icpScore ?? evaluation?.score ?? 0)
    );

    const [confidence, setConfidence] = useState(
        evaluation?.confidence != null
            ? Math.round(evaluation.confidence * 100)
            : 100
    );

    const [reasoning, setReasoning] = useState(
        evaluation?.reasoning || ""
    );

    const [recommendedAction, setRecommendedAction] = useState(
        evaluation?.recommendedAction || ""
    );

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmitEvaluation = async () => {
        setError("");
        setSuccess("");

        if (!["HOT", "WARM", "COLD"].includes(category)) {
            setError("Please select a valid category.");
            return;
        }

        if (icpScore < 0 || icpScore > 100) {
            setError("ICP Score must be between 0 and 100.");
            return;
        }

        if (confidence < 0 || confidence > 100) {
            setError("Confidence must be between 0 and 100.");
            return;
        }

        if (!reasoning.trim()) {
            setError("Please provide reasoning.");
            return;
        }

        if (!recommendedAction.trim()) {
            setError("Please provide a recommended action.");
            return;
        }

        const request = {
            icpScore: Number(icpScore),
            confidence: Number(confidence) / 100,
            category: category,
            reasoning: reasoning.trim(),
            recommendedAction: recommendedAction.trim()
        };

        try {
            setIsSubmitting(true);

            const response = await fetch(
                `${API_BASE_URL}/api/leadevaluation/${lead.id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(request)
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();

            console.log("Evaluation response:", data);

            setSuccess("Evaluation saved successfully.");

        } catch (err) {
            console.error("Evaluation error:", err);
            setError("Failed to save evaluation.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="details-overlay">

            <div className="details-card">

                {/* Header */}
                <div className="details-header">

                    <div>
                        <h2>Lead Details</h2>
                        <p>Complete information about this lead</p>
                    </div>

                    <button onClick={onClose}>
                        ×
                    </button>

                </div>

                <div className="details-content">

                    {/* Lead Information */}
                    <div className="details-section">

                        <h3>Lead Information</h3>

                        <div className="details-grid">

                            <div className="detail-item">
                                <span>ID</span>
                                <strong>{lead.id}</strong>
                            </div>

                            <div className="detail-item">
                                <span>Company</span>
                                <strong>{lead.companyName}</strong>
                            </div>

                            <div className="detail-item">
                                <span>Email</span>
                                <strong>{lead.contactEmail}</strong>
                            </div>

                            <div className="detail-item">
                                <span>Processing Status</span>

                                <strong>
                                    <span
                                        className={`status-badge ${
                                            lead.processingStatus?.toLowerCase()
                                        }`}
                                    >
                                        {lead.processingStatus}
                                    </span>
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Submitted At</span>

                                <strong>
                                    {lead.submittedAt
                                        ? new Date(
                                            lead.submittedAt
                                        ).toLocaleString()
                                        : "N/A"}
                                </strong>
                            </div>

                        </div>

                    </div>

                    {/* Lead Message */}
                    <div className="details-section">

                        <h3>Lead Message</h3>

                        <div className="message-box">
                            {lead.message || "No message available"}
                        </div>

                    </div>

                    {/* Evaluation */}
                    <div className="details-section">

                        <h3>Evaluation</h3>

                        <div className="details-grid">

                            {/* Category */}
                            <div className="detail-item">

                                <span>Category</span>

                                <select
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                    className={`category-select ${category.toLowerCase()}`}
                                >
                                    <option value="HOT">HOT</option>
                                    <option value="WARM">WARM</option>
                                    <option value="COLD">COLD</option>
                                </select>

                            </div>

                            {/* ICP Score */}
                            <div className="detail-item">

                                <span>ICP Score (0-100)</span>

                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={icpScore}
                                    onChange={(e) => {
                                        let value = Number(e.target.value);

                                        if (value < 0) value = 0;
                                        if (value > 100) value = 100;

                                        setIcpScore(value);
                                    }}
                                />

                            </div>

                            {/* Confidence */}
                            <div className="detail-item">

                                <span>Confidence (%)</span>

                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={confidence}
                                    onChange={(e) => {
                                        let value = Number(e.target.value);

                                        if (value < 0) value = 0;
                                        if (value > 100) value = 100;

                                        setConfidence(value);
                                    }}
                                />

                            </div>

                            {/* Status */}
                            <div className="detail-item">

                                <span>Evaluation Status</span>

                                <strong>
                                    {evaluation?.status || "Not evaluated"}
                                </strong>

                            </div>

                            {/* Attempt Number */}
                            {evaluation && (
                                <div className="detail-item">

                                    <span>Attempt Number</span>

                                    <strong>
                                        {evaluation.attemptNumber}
                                    </strong>

                                </div>
                            )}

                        </div>

                    </div>

                    {/* Evaluation Details */}
                    <div className="details-section">

                        <h3>Evaluation Details</h3>

                        <div className="detail-full">

                            <span>Reasoning</span>

                            <textarea
                                value={reasoning}
                                onChange={(e) =>
                                    setReasoning(e.target.value)
                                }
                                placeholder="Why was this score given?"
                                rows={5}
                            />

                        </div>

                        <div className="detail-full">

                            <span>Recommended Action</span>

                            <textarea
                                value={recommendedAction}
                                onChange={(e) =>
                                    setRecommendedAction(e.target.value)
                                }
                                placeholder="What action should be taken?"
                                rows={4}
                            />

                        </div>

                    </div>

                    {/* Failure Information */}
                    {evaluation && (
                        <div className="details-section">

                            <div className="details-grid">

                                <div className="detail-item">

                                    <span>Failure Type</span>

                                    <strong>
                                        {evaluation.failureType || "None"}
                                    </strong>

                                </div>

                                <div className="detail-item">

                                    <span>Failure Message</span>

                                    <strong>
                                        {evaluation.failureMessage || "None"}
                                    </strong>

                                </div>

                            </div>

                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="evaluation-error">
                            {error}
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="evaluation-success">
                            {success}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="evaluation-actions">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="cancel-button"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmitEvaluation}
                            disabled={isSubmitting}
                            className="save-button"
                        >
                            {isSubmitting
                                ? "Saving..."
                                : "Save Evaluation"}
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default EvaluateLead;


