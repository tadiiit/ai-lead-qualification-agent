import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomAIReview.css";

const defaultCriteria = [
    {
        id: "budget",
        name: "Budget & Purchasing Power",
        description: "Evaluate the lead's budget and ability to purchase.",
        weight: 25,
        enabled: true,
    },
    {
        id: "authority",
        name: "Decision-Making Authority",
        description: "Determine whether the lead is a decision-maker.",
        weight: 20,
        enabled: true,
    },
    {
        id: "need",
        name: "Business Need",
        description: "Measure how well your solution matches their needs.",
        weight: 25,
        enabled: true,
    },
    {
        id: "timeline",
        name: "Purchase Timeline",
        description: "Estimate how soon the lead is ready to buy.",
        weight: 15,
        enabled: true,
    },
    {
        id: "engagement",
        name: "Engagement & Interest",
        description: "Evaluate responses, interactions, and interest.",
        weight: 15,
        enabled: true,
    },
];

const initialCustomer =
    "Companies with 50–500 employees looking to automate workflows.";

const initialInstructions =
    "Prioritize leads with a clear business need, an allocated budget, and an active buying timeline.";

export default function CustomAIReview() {
    const navigate = useNavigate();

    const [businessType, setBusinessType] = useState("B2B SaaS");
    const [idealCustomer, setIdealCustomer] = useState(initialCustomer);
    const [instructions, setInstructions] = useState(initialInstructions);
    const [criteria, setCriteria] = useState(defaultCriteria);
    const [saved, setSaved] = useState(false);

    const activeCriteria = criteria.filter((item) => item.enabled);

    const totalWeight = activeCriteria.reduce(
        (sum, item) => sum + Number(item.weight),
        0
    );

    const updateCriteria = (id, changes) => {
        setCriteria((current) =>
            current.map((item) =>
                item.id === id ? { ...item, ...changes } : item
            )
        );
        setSaved(false);
    };

    const handleReset = () => {
        setBusinessType("B2B SaaS");
        setIdealCustomer(initialCustomer);
        setInstructions(initialInstructions);
        setCriteria(defaultCriteria.map((item) => ({ ...item })));
        setSaved(false);
    };

    const handleSave = () => {
        if (activeCriteria.length === 0) {
            window.alert("Enable at least one evaluation criterion.");
            return;
        }

        if (totalWeight !== 100) {
            window.alert("Active criteria weights must total 100%.");
            return;
        }

        // UI preview only. Connect to your backend when this feature launches.
        console.log("Custom AI Review configuration:", {
            businessType,
            idealCustomer,
            instructions,
            criteria,
        });

        setSaved(true);
    };

    return (
        <main className="ai-review-page">
            <div className="ai-review-container">
                {/* Header */}
                <header className="ai-review-header">
                    <div className="ai-header-content">
                        <button
                            type="button"
                            className="ai-back-button"
                            onClick={() => navigate("/customise-evaluation")}
                        >
                            <span aria-hidden="true">←</span>
                            Back to Custom Evaluation
                        </button>

                        <div className="ai-review-eyebrow">
                            AI CONFIGURATION
                        </div>

                        <h1>Custom AI Review</h1>

                        <p>
                            Customize how AI evaluates and qualifies leads
                            according to your business needs.
                        </p>
                    </div>

                    <div className="ai-header-icon" aria-hidden="true">
                        ✳
                    </div>
                </header>

                {/* Coming soon notice */}
                <section className="ai-coming-soon-banner">
                    <div className="ai-coming-soon-icon" aria-hidden="true">
                        ✦
                    </div>

                    <div className="ai-coming-soon-content">
            <span className="ai-coming-soon-label">
              COMING SOON
            </span>

                        <h2>We're building something better for your business</h2>

                        <p>
                            Custom AI Review is currently under development.
                            We're continuously improving this feature so you can
                            tailor lead evaluation results to your business goals,
                            qualification rules, and workflow. Stay tuned for updates!
                        </p>
                    </div>
                </section>

                <div className="ai-review-layout">
                    <section className="ai-review-main">
                        {/* Business profile */}
                        <section className="ai-panel">
                            <div className="ai-panel-heading">
                                <div className="ai-step">01</div>
                                <div>
                                    <h2>Business Profile</h2>
                                    <p>
                                        Help AI understand your business and ideal customers.
                                    </p>
                                </div>
                            </div>

                            <div className="ai-field">
                                <label htmlFor="businessType">Business type</label>

                                <select
                                    id="businessType"
                                    value={businessType}
                                    onChange={(event) => {
                                        setBusinessType(event.target.value);
                                        setSaved(false);
                                    }}
                                >
                                    <option value="B2B SaaS">B2B SaaS</option>
                                    <option value="B2C">B2C / Consumer Business</option>
                                    <option value="Agency">Agency / Consulting</option>
                                    <option value="E-commerce">E-commerce</option>
                                    <option value="Real Estate">Real Estate</option>
                                    <option value="Financial Services">
                                        Financial Services
                                    </option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Education">Education</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="ai-field">
                                <label htmlFor="idealCustomer">
                                    Ideal Customer Profile (ICP)
                                </label>

                                <textarea
                                    id="idealCustomer"
                                    value={idealCustomer}
                                    onChange={(event) => {
                                        setIdealCustomer(event.target.value);
                                        setSaved(false);
                                    }}
                                    placeholder="Describe your ideal customer, industry, company size, and needs..."
                                    rows={4}
                                />

                                <span className="ai-field-hint">
                  Describe which leads are most valuable to your business.
                </span>
                            </div>
                        </section>

                        {/* Evaluation criteria */}
                        <section className="ai-panel">
                            <div className="ai-panel-heading">
                                <div className="ai-step">02</div>
                                <div>
                                    <h2>Evaluation Criteria</h2>
                                    <p>
                                        Choose what matters most when qualifying a lead.
                                    </p>
                                </div>
                            </div>

                            <div className="ai-criteria-list">
                                {criteria.map((item) => (
                                    <div
                                        className={`ai-criterion ${
                                            item.enabled ? "" : "criterion-disabled"
                                        }`}
                                        key={item.id}
                                    >
                                        <div className="criterion-top">
                                            <label className="criterion-toggle">
                                                <input
                                                    type="checkbox"
                                                    checked={item.enabled}
                                                    onChange={(event) =>
                                                        updateCriteria(item.id, {
                                                            enabled: event.target.checked,
                                                        })
                                                    }
                                                    aria-label={`Enable ${item.name}`}
                                                />

                                                <span className="custom-checkbox" />
                                            </label>

                                            <div className="criterion-info">
                                                <h3>{item.name}</h3>
                                                <p>{item.description}</p>
                                            </div>

                                            <span className="criterion-weight">
                        {item.enabled ? item.weight : 0}%
                      </span>
                                        </div>

                                        {item.enabled && (
                                            <div className="criterion-slider">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    step="5"
                                                    value={item.weight}
                                                    aria-label={`${item.name} weight`}
                                                    onChange={(event) =>
                                                        updateCriteria(item.id, {
                                                            weight: Number(event.target.value),
                                                        })
                                                    }
                                                />

                                                <span>Importance weight</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div
                                className={`ai-weight-total ${
                                    totalWeight === 100
                                        ? "weight-valid"
                                        : "weight-invalid"
                                }`}
                            >
                                <span>Total active weight</span>
                                <strong>{totalWeight}% / 100%</strong>
                            </div>

                            {totalWeight !== 100 && (
                                <p className="ai-validation">
                                    Active criteria weights must total exactly 100%.
                                </p>
                            )}
                        </section>

                        {/* AI instructions */}
                        <section className="ai-panel">
                            <div className="ai-panel-heading">
                                <div className="ai-step">03</div>
                                <div>
                                    <h2>Custom AI Instructions</h2>
                                    <p>
                                        Define business-specific rules for your lead reviews.
                                    </p>
                                </div>
                            </div>

                            <div className="ai-field">
                                <label htmlFor="instructions">
                                    Instructions for AI
                                </label>

                                <textarea
                                    id="instructions"
                                    value={instructions}
                                    onChange={(event) => {
                                        setInstructions(event.target.value);
                                        setSaved(false);
                                    }}
                                    placeholder="Example: Prioritize enterprise leads and flag leads without a defined budget..."
                                    rows={5}
                                />

                                <span className="ai-field-hint">
                  These instructions will be used by the AI evaluation
                  engine once the feature is available.
                </span>
                            </div>
                        </section>

                        {/* Actions */}
                        <div className="ai-actions">
                            <button
                                type="button"
                                className="ai-reset-button"
                                onClick={handleReset}
                            >
                                Reset defaults
                            </button>

                            <button
                                type="button"
                                className="ai-save-button"
                                onClick={handleSave}
                            >
                                Save Configuration
                                <span aria-hidden="true">→</span>
                            </button>
                        </div>

                        {saved && (
                            <div className="ai-save-success" role="status">
                                Preview configuration validated. Persistent saving
                                will be available when the feature launches.
                            </div>
                        )}

                        <p className="ai-development-note">
                            <span aria-hidden="true">ⓘ</span>
                            This page is a preview. Your configuration is not yet
                            connected to the live AI evaluation engine.
                        </p>
                    </section>

                    {/* Preview sidebar */}
                    <aside className="ai-review-sidebar">
                        <section className="ai-preview-card">
                            <div className="ai-preview-title">
                <span className="preview-sparkle" aria-hidden="true">
                  ✳
                </span>
                                <h2>Review Preview</h2>
                            </div>

                            <p className="preview-description">
                                Preview your proposed AI review configuration.
                            </p>

                            <div className="preview-divider" />

                            <div className="preview-item">
                                <span>Business type</span>
                                <strong>{businessType}</strong>
                            </div>

                            <div className="preview-item">
                                <span>Active criteria</span>
                                <strong>
                                    {activeCriteria.length} of {criteria.length}
                                </strong>
                            </div>

                            <div className="preview-item">
                                <span>Weight allocation</span>
                                <strong>{totalWeight}%</strong>
                            </div>

                            <div className="preview-weight-bar">
                                {activeCriteria.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`weight-segment segment-${item.id}`}
                                        style={{
                                            width: `${item.weight}%`,
                                        }}
                                        title={`${item.name}: ${item.weight}%`}
                                    />
                                ))}
                            </div>

                            <div className="preview-criteria">
                                {activeCriteria.map((item) => (
                                    <div className="preview-criterion" key={item.id}>
                    <span
                        className={`preview-dot dot-${item.id}`}
                    />
                                        <span>{item.name}</span>
                                        <strong>{item.weight}%</strong>
                                    </div>
                                ))}
                            </div>

                            <div className="preview-note">
                                <span aria-hidden="true">ⓘ</span>
                                <p>
                                    This is a configuration preview, not an actual
                                    AI-generated lead score.
                                </p>
                            </div>
                        </section>

                        <section className="ai-tip-card">
                            <div className="tip-icon" aria-hidden="true">
                                ✦
                            </div>

                            <h3>Designed around your business</h3>

                            <p>
                                We're working to give you more control over lead
                                qualification, scoring priorities, and AI review
                                instructions.
                            </p>

                            <span className="ai-tip-status">
                <span />
                Feature in development
              </span>
                        </section>
                    </aside>
                </div>
            </div>
        </main>
    );
}