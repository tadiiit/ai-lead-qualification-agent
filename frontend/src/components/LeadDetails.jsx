function LeadDetails({ lead, onClose }) {

    const evaluation = lead.evaluations?.[0];

    return (
        <div className="details-overlay">

            <div className="details-card">

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
                                        ? new Date(lead.submittedAt).toLocaleString()
                                        : "N/A"}
                                </strong>
                            </div>

                        </div>

                    </div>

                    <div className="details-section">

                        <h3>Lead Message</h3>

                        <div className="message-box">
                            {lead.message || "No message available"}
                        </div>

                    </div>

                    <div className="details-section">

                        <h3>Evaluation</h3>

                        {evaluation ? (

                            <div className="details-grid">

                                <div className="detail-item">
                                    <span>Category</span>

                                    <strong>
                                        <span
                                            className={`category-badge ${
                                                evaluation.category?.toLowerCase()
                                            }`}
                                        >
                                            {evaluation.category}
                                        </span>
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>Evaluation Status</span>
                                    <strong>{evaluation.status}</strong>
                                </div>

                                <div className="detail-item">
                                    <span>Score</span>
                                    <strong>{evaluation.score}</strong>
                                </div>

                                <div className="detail-item">
                                    <span>Confidence</span>
                                    <strong>
                                        {evaluation.confidence != null
                                            ? `${Math.round(evaluation.confidence * 100)}%`
                                            : "N/A"}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>Attempt Number</span>
                                    <strong>{evaluation.attemptNumber}</strong>
                                </div>

                            </div>

                        ) : (

                            <div className="no-evaluation">
                                No evaluation available
                            </div>

                        )}

                    </div>

                    {evaluation && (

                        <div className="details-section">

                            <h3>Evaluation Details</h3>

                            <div className="detail-full">

                                <span>Reasoning</span>

                                <p>
                                    {evaluation.reasoning || "N/A"}
                                </p>

                            </div>

                            <div className="detail-full">

                                <span>Recommended Action</span>

                                <p>
                                    {evaluation.recommendedAction || "N/A"}
                                </p>

                            </div>

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

                </div>

            </div>

        </div>
    );
}

export default LeadDetails;
