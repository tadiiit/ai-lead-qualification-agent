import React, { useState } from "react";

export default function CustomPropertiesCard() {

    const [properties, setProperties] = useState([
        {
            id: 1,
            applicationField: "lead_score",
            hubspotField: "lead_score"
        },
        {
            id: 2,
            applicationField: "lead_category",
            hubspotField: "lead_category"
        }
    ]);

    const addProperty = () => {

        setProperties([
            ...properties,
            {
                id: Date.now(),
                applicationField: "",
                hubspotField: ""
            }
        ]);
    };

    const removeProperty = (id) => {

        setProperties(
            properties.filter(
                (property) => property.id !== id
            )
        );
    };

    return (
        <div className="integration-card">

            <div className="card-header">

                <div>
                    <h2>Custom Properties</h2>

                    <p>
                        Map fields from your application to HubSpot.
                    </p>
                </div>

            </div>

            <div className="property-list">

                {properties.map((property) => (

                    <div
                        className="property-row"
                        key={property.id}
                    >

                        <input
                            type="text"
                            placeholder="Application field"
                            value={property.applicationField}
                            onChange={(e) => {

                                setProperties(
                                    properties.map((item) =>
                                        item.id === property.id
                                            ? {
                                                ...item,
                                                applicationField:
                                                e.target.value
                                            }
                                            : item
                                    )
                                );

                            }}
                        />

                        <span>→</span>

                        <input
                            type="text"
                            placeholder="HubSpot property"
                            value={property.hubspotField}
                            onChange={(e) => {

                                setProperties(
                                    properties.map((item) =>
                                        item.id === property.id
                                            ? {
                                                ...item,
                                                hubspotField:
                                                e.target.value
                                            }
                                            : item
                                    )
                                );

                            }}
                        />

                        <button
                            className="delete-button"
                            onClick={() =>
                                removeProperty(property.id)
                            }
                        >
                            ×
                        </button>

                    </div>

                ))}

            </div>

            <div className="property-actions">

                <button
                    className="secondary-button"
                    onClick={addProperty}
                >
                    + Add Property
                </button>

                <button className="primary-small-button">
                    Save Properties
                </button>

            </div>

        </div>
    );
}
