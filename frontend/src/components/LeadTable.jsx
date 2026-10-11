import "./LeadTable.css";

function LeadTable({ leads, onLeadClick }) {

    return (
        <div className="table-container">

            <table className="lead-table">

                <thead>
                <tr>
                    <th>ID</th>
                    <th>Company Name</th>
                    <th>Email</th>
                    <th>Category</th>
                    <th>Processing Status</th>
                    <th>Message</th>
                </tr>
                </thead>

                <tbody>

                {leads.map(lead => {

                    const evaluation = lead.evaluations?.[0];

                    return (
                        <tr
                            key={lead.id}
                            onClick={() => onLeadClick(lead)}
                        >

                            <td>{lead.id}</td>

                            <td>
                                {lead.companyName}
                            </td>

                            <td>
                                {lead.contactEmail}
                            </td>

                            <td>
                                <span
                                    className={`category-badge ${
                                        evaluation?.category?.toLowerCase()
                                    }`}
                                >
                                    {evaluation?.category || "N/A"}
                                </span>
                            </td>

                            <td>
                                <span
                                    className={`status-badge ${
                                        lead.processingStatus?.toLowerCase()
                                    }`}
                                >
                                    {lead.processingStatus}
                                </span>
                            </td>

                            <td className="message-cell">
                                {lead.message}
                            </td>

                        </tr>
                    );

                })}

                </tbody>

            </table>

        </div>
    );
}

export default LeadTable;
