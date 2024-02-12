// Use MutationObserver to detect changes in the DOM
const observer = new MutationObserver(mutationsList => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            // Check if the container already has the attribute indicating that the information has been appended
            const statsContainer = document.querySelector('.App-PlayerOverview-Stats');
            if (statsContainer && !statsContainer.hasAttribute('data-appended')) {
                // If the DOM has changed and the information hasn't been appended yet, call the function to append the player stats
                fetchAndAppendPlayerStats();
                break; // Only need to do it once per DOM change
            }
        }
    }
});

// Start observing changes to the document body
observer.observe(document.body, { childList: true, subtree: true });

// Function to fetch and append player stats
function fetchAndAppendPlayerStats() {
    // Disconnect the observer to prevent triggering its callback
    observer.disconnect();

    // Extract player ID from the URL
    const playerId = window.location.pathname.split('/')[2];

    // Fetch data from the API
    fetch(`https://tempus2.xyz/api/v0/players/id/${playerId}/stats`)
        .then(response => response.json())
        .then(data => {
            // Construct HTML content using the data received
            
            const htmlContent = `
        <div>
            <h2>TempusInfoExtension: </h2>
            <h3>National rank</h3>
            <p><b>Overall</b>: ${data['country_rank_info']?.rank ?? 0}/${data['country_rank_info']?.total_ranked ?? 0}</p>
            <p><b>Soldier</b>: ${data['country_class_rank_info']['3']?.rank ?? 0}/${data['country_class_rank_info']['3']?.total_ranked ?? 0}</p>
            <p><b>Demoman</b>: ${data['country_class_rank_info']['4']?.rank ?? 0}/${data['country_class_rank_info']['4']?.total_ranked ?? 0}</p>

            <h3>Top times</h3>
            <p>(soldier & demoman combined)</p>
            <b><p>Map</b>: ${data['top_stats']['map']?.count ?? 0} (${data['top_stats']['map']?.points ?? 0} points)</p>
            <b><p>Course</b>: ${data['top_stats']['course']?.count ?? 0} (${data['top_stats']['course']?.points ?? 0} points)</p>
            <b><p>Bonus</b>: ${data['top_stats']['bonus']?.count ?? 0} (${data['top_stats']['bonus']?.points ?? 0} points)</p>

            <h3>Wr times</h3>
            <p>(soldier & demoman combined)</p>
            <b><p>Map</b>: ${data['wr_stats']['map']?.count ?? 0} (${data['wr_stats']['map']?.points ?? 0} points)</p>
            <b><p>Course</b>: ${data['wr_stats']['course']?.count ?? 0} (${data['wr_stats']['course']?.points ?? 0} points)</p>
            <b><p>Bonus</b>: ${data['wr_stats']['bonus']?.count ?? 0} (${data['wr_stats']['bonus']?.points ?? 0} points)</p>

            <h3>Completion</h3>
            <p>(soldier & demoman combined)</p>
            <b><p>Map</b>: ${data['pr_stats']['map']?.count ?? 0} (${data['pr_stats']['map']?.points ?? 0} points)</p>
            <b><p>Course</b>: ${data['pr_stats']['course']?.count ?? 0} (${data['pr_stats']['course']?.points ?? 0} points)</p>
            <b><p>Bonus</b>: ${data['pr_stats']['bonus']?.count ?? 0} (${data['pr_stats']['bonus']?.points ?? 0} points)</p>

            <!-- Add more data as needed -->
        </div>
        `;

            // Find the container element
            const statsContainer = document.querySelector('.App-PlayerOverview-Stats');

            // Check if the container element exists
            if (statsContainer) {
                // Append HTML content to the container
                statsContainer.insertAdjacentHTML('beforeend', htmlContent);
                // Mark the container to indicate that the information has been appended
                statsContainer.setAttribute('data-appended', 'true');
            } else {
                console.error('Stats container not found');
            }
        })
        .catch(error => console.error('Error fetching data:', error))
        .finally(() => {
            // Reconnect the observer after making changes to the DOM
            observer.observe(document.body, { childList: true, subtree: true });
        });
}

// Call the function initially
fetchAndAppendPlayerStats();
