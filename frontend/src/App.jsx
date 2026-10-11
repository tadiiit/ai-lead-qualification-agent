import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard.jsx";
import TotalLeads from "./pages/TotalLeads.jsx";
import HotLeads from "./pages/HotLeads.jsx";
import WarmLeads from "./pages/WarmLeads.jsx";
import ColdLeads from "./pages/ColdLeads.jsx";
import SendLead from "./pages/SendLead.jsx";
import CRMSend from "./pages/CRMSend.jsx";
import AIFailure from "./pages/AIFailure.jsx";
import CRMFailure from "./pages/CRMFailure.jsx";
import HubSpotIntegration from "./pages/integration/crm/HubSpotIntegration.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";

import ProtectedRoute from "./services/ProtectedRoute.jsx";
import { AuthProvider } from "./services/AuthContext.jsx";
import Home from "./pages/Home.jsx";
import CRMIntegrations from "./pages/integration/CRMintegration.jsx";
import CustomAIReview from "./pages/customiseEvaluation/CustomAIReview.jsx";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public routes: no login required */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<SignUp />} />
                    <Route path="/" element={<Home/>} />

                    {/* All application pages require authentication */}
                    <Route element={<ProtectedRoute />}>

                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/leads" element={<TotalLeads />} />
                        <Route path="/leads/hot-leads" element={<HotLeads />} />
                        <Route path="/leads/warm-leads" element={<WarmLeads />} />
                        <Route path="/leads/cold-leads" element={<ColdLeads />} />

                        <Route path="/send-lead" element={<SendLead />} />

                        <Route path="/leads/crm-send" element={<CRMSend />} />
                        <Route path="/leads/ai-failure" element={<AIFailure />} />
                        <Route path="/leads/crm-failure" element={<CRMFailure />} />

                        <Route path="/integrations/crm" element={<CRMIntegrations />}/>

                        <Route
                            path="/integrations/crm/hubspot"
                            element={<HubSpotIntegration />}
                        />

                        <Route
                            path="/customise-evaluation"
                            element={<CustomAIReview />}
                        />

                        {/* Add your CRM integrations component here when available */}
                        {/* <Route path="/integrations/crm" element={<CRMIntegrations />} /> */}
                    </Route>

                    {/* Unknown URLs redirect to login */}
                    <Route
                        path="*"
                        element={<Navigate to="/login" replace />}
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;