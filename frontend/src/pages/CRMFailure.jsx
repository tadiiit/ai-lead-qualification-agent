import {useEffect, useState} from "react";
import LeadTable from "../components/LeadTable.jsx";
import LeadDetails from "../components/LeadDetails.jsx";
import API_BASE_URL from "../API_BASE_URL.js";

function CRMFailure(){
    const [totalLeads, setTotalLeads] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [leads, setLeads] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);

    function handleLeadClick(lead) {
        setSelectedLead(lead);
    }

    function getLeads(page) {
        fetch(`${API_BASE_URL}/api/hotlead?page=${page}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);

                setTotalLeads(data.totalElements);
                setTotalPage(data.totalPages);
                setLeads(data.leads);
            });
    }

    useEffect(() => {
        getLeads(currentPage);
    }, [currentPage]);

    return (
        <div className="app">

            <header className="page-header">
                <h1>CRM Failed Leads</h1>
                <p>Manage and view your lead that does not send to crm if hot</p>
                <p>This page is under maintance</p>
            </header>

            <section className="stats-card hot-stats">
                <div>
                    <span className="stats-label">CRM failed Leads</span>
                    <span className="stats-value">{totalLeads}</span>
                </div>
            </section>

            <section className="leads-section">

                <div className="section-header">
                    <div>
                        <h2>Lead Failed To Send To CRM</h2>
                        <p>Leads currently classified as crm failure</p>
                    </div>
                </div>

                <LeadTable
                    leads={leads}
                    onLeadClick={handleLeadClick}
                />

                <div className="pagination">

                    <button
                        onClick={() => {
                            if (currentPage > 0) {
                                setCurrentPage(currentPage - 1);
                            }
                        }}
                        disabled={currentPage === 0}
                    >
                        Previous
                    </button>

                    <span>
                        Page {currentPage + 1} of {totalPage}
                    </span>

                    <button
                        onClick={() => {
                            if (currentPage < totalPage - 1) {
                                setCurrentPage(currentPage + 1);
                            }
                        }}
                        disabled={currentPage >= totalPage - 1}
                    >
                        Next
                    </button>

                </div>

            </section>

            {selectedLead && (
                <LeadDetails
                    lead={selectedLead}
                    onClose={() => setSelectedLead(null)}
                />
            )}

        </div>
    );
}
export default CRMFailure;