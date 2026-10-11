import React, { useEffect, useState } from "react";

export default function DeliveryHistory() {

    const [deliveries, setDeliveries] = useState([]);

    useEffect(() => {

        // Replace with your backend API
        setDeliveries([
            {
                id: 1,
                lead: "John Smith",
                score: 94,
                status: "SUCCESS",
                time: "2 minutes ago"
            },
            {
                id: 2,
                lead: "Sarah Jones",
                score: 91,
                status: "SUCCESS",
                time: "8 minutes ago"
            },
            {
                id: 3,
                lead: "Mike Brown",
                score: 87,
                status: "PENDING",
                time: "12 minutes ago"
            },
            {
                id: 4,
                lead: "David Wilson",
                score: 85,
                status: "FAILED",
                time: "20 minutes ago"
            }
        ]);

    }, []);

    const retryDelivery = async (id) => {

        console.log("Retry delivery:", id);

        // POST /api/integrations/hubspot/deliveries/{id}/retry
    };

    return (
        <div className="integration-card">

            <div className="card-header">

                <div>
                    <h2>Lead Delivery History</h2>

                    <p>
                        Monitor leads sent from your application
                        to HubSpot.
                    </p>
                </div>

                <button className="secondary-button">
                    Refresh
                </button>

            </div>

            <div className="delivery-table-wrapper">

                <table className="delivery-table">

                    <thead>
                    <tr>
                        <th>Lead</th>
                        <th>Score</th>
                        <th>Status</th>
                        <th>Time</th>
                        <th />
                    </tr>
                    </thead>

                    <tbody>

                    {deliveries.map((delivery) => (

                        <tr key={delivery.id}>

                            <td>
                                <strong>{delivery.lead}</strong>
                            </td>

                            <td>
                                {delivery.score}
                            </td>

                            <td>
                                <DeliveryStatusBadge
                                    status={delivery.status}
                                />
                            </td>

                            <td className="muted">
                                {delivery.time}
                            </td>

                            <td>

                                {delivery.status === "FAILED" && (

                                    <button
                                        className="retry-button"
                                        onClick={() =>
                                            retryDelivery(delivery.id)
                                        }
                                    >
                                        Retry
                                    </button>

                                )}

                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

function DeliveryStatusBadge({ status }) {

    const className =
        status.toLowerCase();

    return (
        <span className={`delivery-status ${className}`}>
      <span />
            {status}
    </span>
    );
}