// Incidents Page JavaScript

// Sample incident data
const incidents = [
    {
        id: "INC-2026-0001",
        facility: "Safari World Zoo",
        location: "Bangkok, Thailand",
        date: "2026-04-28",
        status: "resolved",
        concerns: ["poor-nutrition", "inadequate-habitat"],
        description: "Giraffe enclosure appeared overcrowded with limited space for natural movement. Food appeared inadequate.",
        reportDate: "2026-04-28"
    },
    {
        id: "INC-2026-0002",
        facility: "Central Park Zoo",
        location: "New York, USA",
        date: "2026-04-30",
        status: "investigating",
        concerns: ["health-issue", "lack-of-care"],
        description: "Observed a giraffe with visible lameness and apparent lack of veterinary attention.",
        reportDate: "2026-04-30"
    },
    {
        id: "INC-2026-0003",
        facility: "Singapore Zoo",
        location: "Singapore",
        date: "2026-05-01",
        status: "resolved",
        concerns: ["behavioral-distress"],
        description: "Animal showing repetitive behaviors suggesting stress. After investigation, facility implemented enrichment program.",
        reportDate: "2026-05-01"
    },
    {
        id: "INC-2026-0004",
        facility: "Melbourne Zoo",
        location: "Melbourne, Australia",
        date: "2026-05-02",
        status: "investigating",
        concerns: ["safety-hazard"],
        description: "Noticed dangerous sharp edges in giraffe enclosure that posed injury risk.",
        reportDate: "2026-05-02"
    },
    {
        id: "INC-2026-0005",
        facility: "Berlin Zoo",
        location: "Berlin, Germany",
        date: "2026-05-03",
        status: "followup",
        concerns: ["inadequate-habitat"],
        description: "Habitat appeared too small for herd of giraffes. Facility promised expansion; awaiting progress update.",
        reportDate: "2026-05-03"
    },
    {
        id: "INC-2026-0006",
        facility: "Dubai Zoo",
        location: "Dubai, UAE",
        date: "2026-05-04",
        status: "resolved",
        concerns: ["poor-nutrition"],
        description: "Food appeared moldy or spoiled. Zoo management immediately corrected and improved food storage.",
        reportDate: "2026-05-04"
    }
];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    displayIncidents(incidents);
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const form = document.getElementById('incidentForm');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });

    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

// Handle filter click
function handleFilterClick(e) {
    const filterType = e.target.dataset.filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');

    // Filter incidents
    let filtered = incidents;
    if (filterType !== 'all') {
        filtered = incidents.filter(incident => incident.status === filterType);
    }

    displayIncidents(filtered);
}

// Display incidents
function displayIncidents(filteredIncidents) {
    const container = document.getElementById('incidentsContainer');

    if (filteredIncidents.length === 0) {
        container.innerHTML = '<p class="no-results">No incidents found.</p>';
        return;
    }

    container.innerHTML = filteredIncidents.map(incident => `
        <div class="incident-card ${incident.status}">
            <div class="incident-header">
                <span class="incident-status status-${incident.status}">
                    ${incident.status === 'investigating' ? '🔍 Investigating' : 
                      incident.status === 'resolved' ? '✅ Resolved' : 
                      '⚠️ Follow-up Needed'}
                </span>
                <h4>${incident.facility}</h4>
                <p class="incident-location">📍 ${incident.location}</p>
            </div>
            <div class="incident-body">
                <div class="incident-info">
                    <p class="info-label">Date Reported</p>
                    <p class="info-value">${formatDate(incident.date)}</p>
                </div>
                <div class="incident-info">
                    <p class="info-label">Concerns</p>
                    <div class="concerns-list">
                        ${incident.concerns.map(concern => `
                            <span class="concern-tag">${formatConcern(concern)}</span>
                        `).join('')}
                    </div>
                </div>
                <div class="incident-description">
                    ${incident.description}
                </div>
                <div class="incident-footer">
                    <span class="report-id">Report ID: ${incident.id}</span>
                    <span>${getStatusBadge(incident.status)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Format date
function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
}

// Format concern text
function formatConcern(concern) {
    const concerns = {
        'poor-nutrition': '🥬 Nutrition',
        'inadequate-habitat': '🏠 Habitat',
        'health-issue': '⚕️ Health',
        'behavioral-distress': '😟 Behavior',
        'lack-of-care': '💔 Care',
        'safety-hazard': '🚨 Safety',
        'other': '📋 Other'
    };
    return concerns[concern] || concern;
}

// Get status badge
function getStatusBadge(status) {
    const badges = {
        'investigating': '🔍 Under Investigation',
        'resolved': '✅ Issue Resolved',
        'followup': '⚠️ Follow-up Pending'
    };
    return badges[status] || status;
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();

    // Collect checked concerns
    const concerns = Array.from(document.querySelectorAll('input[name="concern"]:checked'))
        .map(cb => cb.value);

    if (concerns.length === 0) {
        alert('⚠️ Please select at least one type of concern.');
        return;
    }

    const formData = {
        id: `INC-${new Date().getFullYear()}-${String(incidents.length + 1).padStart(4, '0')}`,
        facility: document.getElementById('facilityName').value,
        location: document.getElementById('facilityLocation').value,
        date: document.getElementById('incidentDate').value,
        status: 'investigating',
        concerns: concerns,
        description: document.getElementById('description').value,
        reportDate: new Date().toISOString().split('T')[0],
        reporter: document.getElementById('reporterName').value || 'Anonymous',
        email: document.getElementById('reporterEmail').value || null,
        allowContact: document.getElementById('allowContact').checked,
        submittedAt: new Date().toISOString()
    };

    // Store in localStorage
    let reports = JSON.parse(localStorage.getItem('incidentReports')) || [];
    reports.push(formData);
    localStorage.setItem('incidentReports', JSON.stringify(reports));

    // Reset form
    document.getElementById('incidentForm').reset();
    
    alert(`✅ Thank you for your report!\n\nReport ID: ${formData.id}\n\nYour report has been submitted and will be reviewed within 48 hours. Your privacy and safety are our priorities.`);
}