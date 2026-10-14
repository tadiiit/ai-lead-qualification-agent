import { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import LeadTable from "../components/LeadTable.jsx";
import LeadDetails from "../components/LeadDetails.jsx";
import API_BASE_URL from "../API_BASE_URL.js";

function WarmLeads() {

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

        fetch(`${API_BASE_URL}/api/warmlead?page=${page}` ,{
            headers:{
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
                <h1>Warm Leads</h1>
                <p>Manage and view your warm leads</p>
            </header>

            <section className="stats-card warm-stats">
                <div>
                    <span className="stats-label">Warm Leads</span>
                    <span className="stats-value">{totalLeads}</span>
                </div>
            </section>

            <section className="leads-section">

                <div className="section-header">
                    <div>
                        <h2>Warm Lead List</h2>
                        <p>Leads currently classified as warm</p>
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

export default WarmLeads;
