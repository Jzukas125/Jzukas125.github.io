/*
Author: Jacob Zukas
Date: 7/17/2025
Description: GRC Report Generation Script
This script handles the generation of GRC reports, including incident response, compliance, risk assessment, and internal audit reports.
It uses Groq API for AI-powered content generation and provides a user-friendly interface for report customization
*/

'use strict';

document.addEventListener('DOMContentLoaded', function() {
    const reportForm = document.getElementById('reportForm');
    const reportOutput = document.getElementById('reportOutput');
    const reportPlaceholder = document.getElementById('reportPlaceholder');
    const reportTitle = document.getElementById('reportTitle');
    const reportSubtitle = document.getElementById('reportSubtitle');
    const reportDate = document.getElementById('reportDate');
    const execSummary = document.getElementById('execSummary');
    const saveReportBtn = document.getElementById('saveReport');
    const downloadPdfBtn = document.getElementById('downloadPdf');

    const GROQ_API_KEY = "";

    // Set current date
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    reportDate.textContent = today.toLocaleDateString('en-US', options);

    // Dynamically populate year selector
    const yearSelect = document.getElementById('year');
    const currentYear = today.getFullYear();
    yearSelect.innerHTML = '';
    for (let i = 0; i <= 10; i++) {
        const year = currentYear + i;
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (i === 0) option.selected = true;
        yearSelect.appendChild(option);
    }

    // Generate report
    reportForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state immediately
        reportPlaceholder.classList.remove('hidden');
        reportOutput.classList.add('hidden');
        reportPlaceholder.innerHTML = `
            <div class="animate-pulse flex flex-col items-center">
                <div class="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
                <div class="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                <div class="h-3 w-48 bg-gray-200 rounded"></div>
            </div>
        `;
        
        const organization = document.getElementById('organization').value || 'Sample Organization';
        const reportType = document.getElementById('reportType').value;
        const timeframe = document.getElementById('quarter').value;
        const year = yearSelect.value;
        
        // Title
        let title = '';
        switch(reportType) {
            case 'irc':
                title = `${organization} Incident Response (${year})`;
                break;
            case 'compliance':
                title = `${organization} Compliance Report (${year})`;
                break;
            case 'risk':
                title = `${organization} Risk Assessment (${year})`;
                break;
            case 'audit':
                title = `${organization} Internal Audit Report (${year})`;
                break;
            default:
                title = `${organization} GRC Report (${year})`;
        }
        reportTitle.textContent = title;

        // Subtitle
        let timeframeText = '';
        switch(timeframe) {
            case 'Q1': timeframeText = `Q1 ${year}`; break;
            case 'Q2': timeframeText = `Q2 ${year}`; break;
            case 'Q3': timeframeText = `Q3 ${year}`; break;
            case 'Q4': timeframeText = `Q4 ${year}`; break;
            case 'annual': timeframeText = `Annual ${year}`; break;
        }
        reportSubtitle.textContent = `${timeframeText} Report | Generated on ${today.toLocaleDateString('en-US', options)}`;

        // Build prompt for AI, change to allow for some user input later
        const prompt = `
Write Section 3 of a NIST SP 800-61 Rev. 2 Incident Response Plan titled "Handling Incidents".
Include:
- 3.1 Preparation
- 3.2 Detection and Analysis
- 3.3 Containment, Eradication, and Recovery
- 3.4 Post-Incident Activity

Target this for a financial institution such as a bank or fintech. Ensure the tone is formal and compliant with NIST, PCI DSS, and FFIEC best practices.
        `;

        try {
            const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [
                        { role: "system", content: 
                            "You are a senior cybersecurity engineer writing GRC documentation. Write this MLA format, including the correct indentation and do not use markdown. This will be exported into a pdf, so be mindful when creating this" },
                        { role: "user", content: prompt.trim() } // Trim extra whitespace
                    ]
                })
            });

            if (!groqRes.ok) {
                const errorData = await groqRes.json();
                throw new Error(`API Error: ${groqRes.status} ${groqRes.statusText} - ${JSON.stringify(errorData)}`);
            }

            const data = await groqRes.json();
            const aiReport = data.choices?.[0]?.message?.content || "No content returned from the API.";

            // Executive summary + AI section
            execSummary.textContent = `This ${timeframeText} ${reportType} report provides an overview of ${organization}'s governance, risk, and compliance posture for ${year}.\n\n${aiReport}`;
        } catch (err) {
            execSummary.textContent = "Error generating report: " + err.message;
            console.error("Fetch Error:", err);
        } finally {
            // Hide placeholder and show report whether successful or not
            reportPlaceholder.classList.add('hidden');
            reportOutput.classList.remove('hidden');
        }
    });

    // Save report button
    if (saveReportBtn) {
        saveReportBtn.addEventListener('click', function() {
            if (reportOutput.classList.contains('hidden')) {
                alert('Please generate a report first');
                return;
            }
            const originalText = saveReportBtn.innerHTML;
            saveReportBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Saving...`;
            saveReportBtn.disabled = true;
            setTimeout(() => {
                saveReportBtn.innerHTML = originalText;
                saveReportBtn.disabled = false;
                const toast = document.createElement('div');
                toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center';
                toast.innerHTML = `<i class="fas fa-check-circle mr-2"></i> Report saved successfully`;
                document.body.appendChild(toast);
                setTimeout(() => {
                    toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
                    setTimeout(() => toast.remove(), 300);
                }, 3000);
            }, 1000);
        });
    }

    // Download PDF button
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', function() {
            if (reportOutput.classList.contains('hidden')) {
                alert('Please generate a report first');
                return;
            }
            alert('PDF download would be initiated here');
        });
    }
});