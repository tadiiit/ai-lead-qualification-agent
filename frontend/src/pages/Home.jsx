
import { Link } from "react-router-dom";
import "./Home.css";
import {useAuth} from "../services/AuthContext.jsx";

const features = [
    {
        icon: "✦",
        title: "AI-Powered Lead Scoring",
        description:
            "Evaluate incoming leads with AI to understand their potential and prioritize your next action.",
    },
    {
        icon: "↗",
        title: "Hot, Warm & Cold Leads",
        description:
            "Organize prospects by priority so your team can focus on the opportunities that matter most.",
    },
    {
        icon: "⌘",
        title: "CRM Integrations",
        description:
            "Connect supported CRM platforms to streamline lead handoffs and reduce manual work.",
    },
    {
        icon: "⇧",
        title: "Lead Source Management",
        description:
            "Build a workflow for collecting leads from your business's supported sources.",
    },
    {
        icon: "⚙",
        title: "Custom AI Evaluation",
        description:
            "Configure business-specific evaluation requirements to make lead assessments more relevant.",
    },
    {
        icon: "✓",
        title: "Evaluation Monitoring",
        description:
            "Review unsuccessful AI evaluations and identify leads that need another look.",
    },
];

function Home() {

    const { isAuthenticated, loading } = useAuth();
    return (
        <div className="home-page">
            <header className="home-navbar">
                <Link to="/" className="home-brand">
                    <span className="home-logo">M✓</span>
                    <span>
                        <strong>MyLeadQualifier</strong>
                        <small>AI LEAD AUTOMATION</small>
                    </span>
                </Link>

                <nav className="home-nav-links">
                    <a href="#features">Features</a>
                    <a href="#how-it-works">How it works</a>
                    <a href="#about">About</a>
                </nav>


                <div className="home-auth-links">
                    {loading ? null : isAuthenticated ? (
                        <Link to="/dashboard" className="home-register">
                            Dashboard <span>→</span>
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="home-login">
                                Log in
                            </Link>
                            <Link to="/register" className="home-register">
                                Get Started <span>→</span>
                            </Link>
                        </>
                    )}
                </div>

            </header>

            <main>
                <section className="home-hero">
                    <div className="hero-copy">
                        <div className="hero-badge">
                            <span>✦</span> AI-POWERED LEAD INTELLIGENCE
                        </div>

                        <h1>
                            Turn incoming leads into
                            <span> smarter opportunities.</span>
                        </h1>

                        <p className="hero-description">
                            Stop treating every lead the same. Use AI to
                            evaluate prospects, identify high-priority
                            opportunities, and build a smarter lead
                            qualification workflow.
                        </p>

                        <div className="hero-actions">
                            <Link to="/register" className="hero-primary">
                                Start qualifying leads <span>→</span>
                            </Link>
                            <a href="#how-it-works" className="hero-secondary">
                                Explore how it works
                            </a>
                        </div>

                        <div className="hero-points">
                            <span>✓ AI-assisted evaluation</span>
                            <span>✓ Organized lead priorities</span>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="visual-glow" />

                        <div className="preview-window">
                            <div className="preview-topbar">
                                <div className="preview-brand">
                                    <span className="preview-logo">M✓</span>
                                    <strong>Lead Workspace</strong>
                                </div>
                                <span className="preview-status">
                                    ● AI WORKFLOW
                                </span>
                            </div>

                            <div className="preview-content">
                                <div className="preview-heading">
                                    <div>
                                        <small>YOUR OVERVIEW</small>
                                        <h3>Lead intelligence</h3>
                                    </div>
                                    <span className="preview-period">
                                        Overview ↗
                                    </span>
                                </div>

                                <div className="preview-stats">
                                    <div className="preview-stat">
                                        <span>Total leads</span>
                                        <strong>128</strong>
                                        <small>Incoming prospects</small>
                                    </div>
                                    <div className="preview-stat">
                                        <span>High priority</span>
                                        <strong className="hot-value">32</strong>
                                        <small>Review first</small>
                                    </div>
                                </div>

                                <div className="preview-list">
                                    <div className="preview-list-title">
                                        <strong>Recent evaluations</strong>
                                        <span>Illustrative preview</span>
                                    </div>

                                    <div className="lead-row">
                                        <span className="lead-avatar avatar-one">
                                            A
                                        </span>
                                        <div className="lead-info">
                                            <strong>Acme Solutions</strong>
                                            <small>Enterprise prospect</small>
                                        </div>
                                        <span className="lead-tag tag-hot">
                                            HOT
                                        </span>
                                    </div>

                                    <div className="lead-row">
                                        <span className="lead-avatar avatar-two">
                                            N
                                        </span>
                                        <div className="lead-info">
                                            <strong>Nova Technologies</strong>
                                            <small>Growing business</small>
                                        </div>
                                        <span className="lead-tag tag-warm">
                                            WARM
                                        </span>
                                    </div>

                                    <div className="lead-row">
                                        <span className="lead-avatar avatar-three">
                                            S
                                        </span>
                                        <div className="lead-info">
                                            <strong>Skyline Ventures</strong>
                                            <small>Early-stage prospect</small>
                                        </div>
                                        <span className="lead-tag tag-cold">
                                            COLD
                                        </span>
                                    </div>
                                </div>

                                <div className="preview-ai-note">
                                    <span>✦</span>
                                    <div>
                                        <strong>AI-assisted qualification</strong>
                                        <small>
                                            Turn lead information into actionable
                                            priorities.
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="preview-caption">
                            Illustrative product preview · Not live account data
                        </p>
                    </div>
                </section>

                <section className="home-trust-strip">
                    <p>BUILT TO HELP YOU</p>
                    <div>
                        <span>Prioritize opportunities</span>
                        <span>Reduce manual review</span>
                        <span>Organize lead workflows</span>
                    </div>
                </section>

                <section id="features" className="home-features section-wrap">
                    <div className="section-intro">
                        <span className="section-eyebrow">THE PLATFORM</span>
                        <h2>Everything you need to qualify leads smarter.</h2>
                        <p>
                            Bring lead evaluation, prioritization, and
                            follow-up workflows into one organized workspace.
                        </p>
                    </div>

                    <div className="home-feature-grid">
                        {features.map((feature) => (
                            <article className="home-feature-card" key={feature.title}>
                                <span className="feature-symbol">
                                    {feature.icon}
                                </span>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section id="how-it-works" className="home-workflow">
                    <div className="section-wrap">
                        <div className="section-intro">
                            <span className="section-eyebrow">
                                SIMPLE WORKFLOW
                            </span>
                            <h2>From incoming lead to informed action.</h2>
                            <p>
                                A straightforward workflow for making sense of
                                your incoming business opportunities.
                            </p>
                        </div>

                        <div className="workflow-grid">
                            <article className="workflow-step">
                                <span className="step-number">01</span>
                                <h3>Receive</h3>
                                <p>
                                    Collect lead information through your
                                    configured sources.
                                </p>
                            </article>

                            <article className="workflow-step">
                                <span className="step-number">02</span>
                                <h3>Evaluate</h3>
                                <p>
                                    Let AI assess the available information
                                    against your qualification criteria.
                                </p>
                            </article>

                            <article className="workflow-step">
                                <span className="step-number">03</span>
                                <h3>Take action</h3>
                                <p>
                                    Review lead priorities and follow the
                                    appropriate next steps.
                                </p>
                            </article>
                        </div>
                    </div>
                </section>

                <section id="about" className="home-cta">
                    <div>
                        <span className="section-eyebrow">
                            WORK SMARTER WITH YOUR LEADS
                        </span>
                        <h2>Make every lead easier to understand.</h2>
                        <p>
                            Start building a more organized, AI-assisted lead
                            qualification process for your business.
                        </p>
                    </div>
                    <Link to="/register" className="cta-button">
                        Create your account <span>→</span>
                    </Link>
                </section>
            </main>

            <footer className="home-footer">
                <Link to="/" className="home-brand footer-brand">
                    <span className="home-logo">M✓</span>
                    <span>
                        <strong>MyLeadQualifier</strong>
                        <small>AI LEAD AUTOMATION</small>
                    </span>
                </Link>

                <p>
                    AI-assisted lead qualification for smarter business
                    workflows.
                </p>

                <div className="footer-links">
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </div>

                <small className="copyright">
                    © {new Date().getFullYear()} MyLeadQualifier
                </small>
            </footer>
        </div>
    );
}

export default Home;
