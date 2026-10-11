import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext.jsx";
import "./Dashboard.css";

const stats = [
    {
        title: "Total Leads",
        description: "All received leads",
        icon: "▤",
        color: "blue",
        path: "/leads",
    },
    {
        title: "Hot Leads",
        description: "High-priority prospects",
        icon: "↗",
        color: "red",
        path: "/leads/hot-leads",
    },
    {
        title: "Cold Leads",
        description: "Low-priority prospects",
        icon: "❄",
        color: "gray",
        path: "/leads/cold-leads",
    },
];

const features = [
    {
        title: "Lead Sources",
        description:
            "Receive leads from Google Forms, WordPress, email, and other sources.",
        icon: "＋",
        path: "/send-lead",
        action: "Manage lead sources",
    },
    {
        title: "CRM Integrations",
        description:
            "Connect HubSpot, Zoho CRM, and other supported CRM platforms.",
        icon: "⌘",
        path: "/integrations/crm",
        action: "Manage integrations",
    },
    {
        title: "AI Failure Review",
        description:
            "Find failed AI evaluations and review leads that need attention.",
        icon: "⚠",
        path: "/leads/ai-failure",
        action: "Review failures",
    },
    {
        title: "Custom AI Review",
        description:
            "Set your business requirements to make lead evaluations more relevant.",
        icon: "✳",
        path: "/customise-evaluation",
        action: "Configure AI review",
    },
];

function Brand() {
    return (
        <Link to="/" className="mlq-brand">
            <span className="mlq-logo">M✓</span>
            <span>
                <strong>MyLeadQualifier</strong>
                <small>AI LEAD AUTOMATION</small>
            </span>
        </Link>
    );
}

function Dashboard() {
    const { user, isAuthenticated, logoutUser } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logoutUser();
        navigate("/", { replace: true });
    }

    const userName =
        user?.name ??
        user?.fullName ??
        user?.username ??
        user?.email ??
        "My Account";

    return (
        <div className="mlq-app">
            <aside className="mlq-sidebar">
                <Brand />

                <div className="workspace">
                    <span className="workspace-avatar">
                        {isAuthenticated
                            ? userName.charAt(0).toUpperCase()
                            : "M"}
                    </span>

                    <div>
                        <strong>
                            {isAuthenticated ? userName : "My Workspace"}
                        </strong>
                        <small>
                            {isAuthenticated
                                ? "Lead operations"
                                : "Guest workspace"}
                        </small>
                    </div>
                </div>

                <nav className="mlq-nav">
                    <p className="nav-heading">WORKSPACE</p>

                    <Link to="/dashboard" className="nav-link active">
                        <span>⌂</span> Dashboard
                    </Link>

                    <Link to="/leads" className="nav-link">
                        <span>▤</span> All Leads
                    </Link>

                    <Link to="/send-lead" className="nav-link">
                        <span>＋</span> Lead Sources
                    </Link>

                    <p className="nav-heading">AUTOMATION</p>

                    <Link to="/leads/ai-failure" className="nav-link">
                        <span>⚠</span> AI Failures
                    </Link>

                    <Link to="/leads/review-settings" className="nav-link">
                        <span>✳</span> Custom AI Review
                    </Link>

                    <p className="nav-heading">CONNECTIONS</p>

                    <Link to="/integrations/crm" className="nav-link">
                        <span>⌘</span> CRM Integrations
                    </Link>
                </nav>

                <div className="sidebar-bottom">
                    <p>MyLeadQualifier</p>
                    <small>Lead intelligence workspace</small>
                </div>
            </aside>

            <main className="mlq-main">
                <header className="mlq-header">
                    <div className="mobile-brand">
                        <Brand />
                    </div>

                    <span className="breadcrumb">
                        Workspace / <strong>Dashboard</strong>
                    </span>

                    <div className="dashboard-auth-actions">
                        {isAuthenticated ? (
                            <>
                                <span className="dashboard-user">
                                    {userName}
                                </span>

                                <button
                                    type="button"
                                    className="auth-header-button"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="auth-header-button"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="primary-button"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </header>

                <div className="mlq-content">
                    <section className="welcome-section">
                        <div>
                            <p className="eyebrow">YOUR WORKSPACE</p>
                            <h1>Lead Dashboard</h1>

                            <p className="welcome-description">
                                Monitor your leads, review AI evaluations,
                                and manage your integrations.
                            </p>
                        </div>
                    </section>

                    <section className="stats-grid">
                        {stats.map((stat) => (
                            <Link
                                to={stat.path}
                                className="stat-card"
                                key={stat.title}
                            >
                                <div className="stat-card-top">
                                    <span className={`stat-icon ${stat.color}`}>
                                        {stat.icon}
                                    </span>
                                    <span className="stat-arrow">↗</span>
                                </div>

                                <p>{stat.title}</p>
                                <h2>{stat.value}</h2>
                                <small>{stat.description}</small>
                            </Link>
                        ))}
                    </section>

                    <section className="section-heading">
                        <div>
                            <h2>Manage your workspace</h2>
                            <p>Choose what you want to work on.</p>
                        </div>
                    </section>

                    <section className="features-grid">
                        {features.map((feature) => (
                            <Link
                                to={feature.path}
                                className="feature-card"
                                key={feature.title}
                            >
                                <span className="feature-icon">
                                    {feature.icon}
                                </span>

                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>

                                <span className="feature-action">
                                    {feature.action} →
                                </span>
                            </Link>
                        ))}
                    </section>

                    <footer className="mlq-footer">
                        MyLeadQualifier · AI-powered lead qualification
                    </footer>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;