import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./SendLead.css";
import SubmitLead from "./SubmitLead.jsx";

function SendLead() {

    const [selectedSource, setSelectedSource] = useState("manual");

    const navigate = useNavigate();

    const leadSources = [
        {
            id: "manual",
            name: "Manual Lead Form",
            description: "Submit a lead manually using our lead form.",
            icon: "📝",
            status: "Available"
        },
        {
            id: "linkedin",
            name: "LinkedIn",
            description: "Capture leads directly from LinkedIn campaigns and forms.",
            icon: "in",
            status: "Coming Soon"
        },
        {
            id: "instagram",
            name: "Instagram",
            description: "Receive leads generated from Instagram campaigns.",
            icon: "◎",
            status: "Coming Soon"
        },
        {
            id: "wordpress",
            name: "WordPress",
            description: "Connect your WordPress website and receive leads automatically.",
            icon: "W",
            status: "Coming Soon"
        },
        {
            id: "google-ads",
            name: "Google Ads Lead Form",
            description: "Import leads generated through Google Ads lead forms.",
            icon: "G",
            status: "Coming Soon"
        },
        {
            id: "meta",
            name: "Meta",
            description: "Connect Facebook and Meta lead generation campaigns.",
            icon: "f",
            status: "Coming Soon"
        },
        {
            id: "webhook",
            name: "External Webhook",
            description: "Receive leads from any external application through a webhook.",
            icon: "↗",
            status: "Coming Soon"
        },
        {
            id: "email",
            name: "Email",
            description: "Automatically convert incoming emails into leads.",
            icon: "@",
            status: "Coming Soon"
        }
    ];


    const handleSourceClick = (source) => {

        if (source.id === "hubspot") {
            navigate("/integrations/hubspot");
            return;
        }

        if (source.status === "Available") {
            setSelectedSource(source.id);
        }

    };


    return (
        <div className="sendLead">

            {/* Header */}

            <header className="sendLeadHeader">

                <span className="pageBadge">
                    Lead Sources
                </span>

                <h1>
                    Send Your Leads
                </h1>

                <p>
                    Connect different lead sources and send all your
                    leads to one central platform.
                </p>

            </header>


            {/* Lead Source Cards */}

            <section className="leadSources">

                <div className="sectionHeader">

                    <div>
                        <h2>
                            Choose a Lead Source
                        </h2>

                        <p>
                            Select where your leads are coming from.
                        </p>
                    </div>

                </div>


                <div className="sourceGrid">

                    {leadSources.map((source) => (

                        <div
                            key={source.id}
                            className={`sourceCard ${
                                selectedSource === source.id
                                    ? "active"
                                    : ""
                            } ${
                                source.status === "Coming Soon"
                                    ? "disabled"
                                    : ""
                            }`}
                            onClick={() => handleSourceClick(source)}
                        >

                            <div className="sourceTop">

                                <div className="sourceIcon">
                                    {source.icon}
                                </div>

                                <span
                                    className={
                                        source.status === "Available"
                                            ? "status available"
                                            : "status comingSoon"
                                    }
                                >
                                    {source.status}
                                </span>

                            </div>


                            <h3>
                                {source.name}
                            </h3>


                            <p>
                                {source.description}
                            </p>


                            {source.status === "Available" && (
                                <div className="sourceAction">
                                    Use this source →
                                </div>
                            )}

                        </div>

                    ))}

                </div>

            </section>


            {/* Manual Lead Form */}

            {selectedSource === "manual" && (

               <SubmitLead/>
            )}


            {/* Coming Soon Message */}

            <section className="comingSoonSection">

                <div className="comingSoonIcon">
                    🚀
                </div>

                <h2>
                    More Lead Sources Coming Soon
                </h2>

                <p>
                    We are working on integrations with LinkedIn,
                    Instagram, WordPress, Google Ads, Meta, webhooks,
                    email and CRM platforms.
                </p>

            </section>

        </div>
    );
}

export default SendLead;
