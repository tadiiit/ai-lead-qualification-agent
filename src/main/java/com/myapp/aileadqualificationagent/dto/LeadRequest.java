package com.myapp.aileadqualificationagent.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public class LeadRequest {

    @NotBlank(message = "Company name is required")
    @Size(max = 255, message = "Company name cannot exceed 255 characters")
    private String companyName;

    @NotBlank(message = "Contact email is required")
    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Email cannot exceed 255 characters")
    private String contactEmail;

    @NotBlank(message = "Message is required")
    @Size(
            min = 10,
            max = 5000,
            message = "Message must be between 10 and 5000 characters"
    )
    private String message;


    public String getCompanyName() {
        return companyName;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public String getMessage() {
        return message;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}