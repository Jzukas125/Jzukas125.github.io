// Use strict mode for better error handling
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
    reportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        reportPlaceholder.innerHTML = `
            <div class="animate-pulse flex flex-col items-center">
                <div class="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
                <div class="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                <div class="h-3 w-48 bg-gray-200 rounded"></div>
            </div>
        `;
        setTimeout(() => {
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
                case 'Q1':
                    timeframeText = `Q1 ${year}`;
                    break;
                case 'Q2':
                    timeframeText = `Q2 ${year}`;
                    break;
                case 'Q3':
                    timeframeText = `Q3 ${year}`;
                    break;
                case 'Q4':
                    timeframeText = `Q4 ${year}`;
                    break;
                case 'annual':
                    timeframeText = `Annual ${year}`;
                    break;
            }
            reportSubtitle.textContent = `${timeframeText} Report | Generated on ${today.toLocaleDateString('en-US', options)}`;

            // Executive summary
            let summary = `This ${timeframeText} ${reportType === 'combined' ? 'GRC' : reportType} report provides an overview of ${organization}'s governance, risk, and compliance posture for ${year}. `;
            execSummary.textContent = summary;

            
            // Show report
            reportPlaceholder.classList.add('hidden');
            reportOutput.classList.remove('hidden');
        }, 1500);
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