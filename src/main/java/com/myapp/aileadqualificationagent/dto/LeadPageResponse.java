package com.myapp.aileadqualificationagent.dto;

import java.util.List;

public record LeadPageResponse(
        List<LeadResponse> leads,
        int currentPage,
        int pageSize,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last
) {
}
