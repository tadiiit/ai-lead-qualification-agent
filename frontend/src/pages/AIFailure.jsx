import {useEffect, useState} from "react";
import LeadTable from "../components/LeadTable.jsx";
import LeadDetails from "../components/LeadDetails.jsx";
import EvaluateLead from "../components/EvaluateLead.jsx";

function AIFailure(){
    const [totalLeads, setTotalLeads] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [leads, setLeads] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);

    function handleLeadClick(lead) {
        setSelectedLead(lead);
    }

    function getLeads(page) {
        // Get JWT token from localStorage
        const token = localStorage.getItem("jwtToken");

        if (!token) {
            console.error("Please log in first. JWT token not found.");
            return;
        }
        fetch(`/api/warmlead?page=${page}` , {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
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
                <h1>AI Failure Leads</h1>
                <p>Manage and view your lead that failed to evaluate</p>
                <p>Evaluate Lead manually and send to crm</p>
                <p>This page is under maintance</p>
            </header>

            <section className="stats-card hot-stats">
                <div>
                    <span className="stats-label">Evaluation Failed Leads</span>
                    <span className="stats-value">{totalLeads}</span>
                </div>
            </section>

            <section className="leads-section">

                <div className="section-header">
                    <div>
                        <h2>List of Leads That Failed To Evaluate</h2>
                        <p>Leads currently classified as not evaluated</p>
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
                <EvaluateLead
                    lead={selectedLead}
                    onClose={() => setSelectedLead(null)}
                />
            )}

        </div>
    );
}
export default AIFailure;