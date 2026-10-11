import { useState } from "react";
import "./SubmitLead.css"

function SubmitLead() {

    const [companyName, setCompanyName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [message, setMessage] = useState("");

    // 1. Create the request object
    const createRequest = () => {
        const request = {
            companyName: companyName,
            contactEmail: contactEmail,
            message: message
        };

        return request;
    };


    // 2. Send the request to backend
    const sendRequest = (e) => {
        e.preventDefault();

        const request = createRequest();
        console.log(request);

        const token = localStorage.getItem("jwtToken");

        if (!token) {
            console.error("Please log in first , jwt token not found");
            return;
        }
        fetch("/api/lead", {
            method: "POST",
            headers: {
                 Authorization: `Bearer ${token}` ,
                "Content-Type": "application/json"

            },
            //credential

            body: JSON.stringify(request)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }
                    response.json()
                })
            .then(data => console.log(data))
            .catch(error => console.error(error));
    };


    return (
        <div className="submitLead">

            <header className="submitLeadHeader">
                <h1>Submit your Lead manually</h1>
                <p>Enter the lead details below.</p>
            </header>

            <section className="hi">

                <form onSubmit={sendRequest}>

                    <div className="formGroup">
                        <label htmlFor="companyName">
                            Company Name:
                        </label>

                        <input
                            id="companyName"
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Enter company name"
                        />
                    </div>


                    <div className="formGroup">
                        <label htmlFor="contactEmail">
                            Email Details:
                        </label>

                        <input
                            id="contactEmail"
                            type="email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}

                            placeholder="Enter contact email"
                        />
                    </div>


                    <div className="formGroup">
                        <label htmlFor="message">
                            Message:
                        </label>

                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter your message"
                            rows="5"
                        />
                    </div>


                    <button type="submit">
                        Submit
                    </button>

                </form>

            </section>

        </div>
    );
}

export default SubmitLead;
