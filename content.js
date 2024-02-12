// Use MutationObserver to detect changes in the DOM
const observer = new MutationObserver(mutationsList => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // If the DOM has changed, call the function again to append the player stats
        fetchAndAppendPlayerStats();
        break; // Only need to do it once per DOM change
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
        <p><b>Overall</b>: ${data['country_rank_info']['rank'] + "/" + data['country_rank_info']['total_ranked']   }</p>
        <p><b>Soldier</b>: ${data['country_class_rank_info']['3']['rank'] + "/" + data['country_class_rank_info']['3']['total_ranked']}</p>
        <p><b>Demoman</b>: ${data['country_class_rank_info']['4']['rank'] + "/" + data['country_class_rank_info']['4']['total_ranked']   }</p>
        
        <h3>Top times</h3>
        <p>(soldier & demoman combined)</p>
        <b><p>Map</b>: ${data['top_stats']['map']['count']} (${data['top_stats']['map']['points']} points)</p>
        <b><p>Course</b>: ${data['top_stats']['course']['count']} (${data['top_stats']['course']['points']} points)</p>
        <b><p>Bonus</b>: ${data['top_stats']['bonus']['count']} (${data['top_stats']['bonus']['points']} points)</p>
        
        <h3>Wr times</h3>
        <p>(soldier & demoman combined)</p>
        <b><p>Map</b>: ${data['wr_stats']['map']['count']} (${data['wr_stats']['map']['points']} points)</p>
        <b><p>Course</b>: ${data['wr_stats']['course']['count']} (${data['wr_stats']['course']['points']} points)</p>
        <b><p>Bonus</b>: ${data['wr_stats']['bonus']['count']} (${data['wr_stats']['bonus']['points']} points)</p>

        <h3>Completion</h3>
        <p>(soldier & demoman combined)</p>
        <b><p>Map</b>: ${data['pr_stats']['map']['count']} (${data['pr_stats']['map']['points']} points)</p>
        <b><p>Course</b>: ${data['pr_stats']['course']['count']} (${data['pr_stats']['course']['points']} points)</p>
        <b><p>Bonus</b>: ${data['pr_stats']['bonus']['count']} (${data['pr_stats']['bonus']['points']} points)</p>
        
        <!-- Add more data as needed -->
      </div>
    `;
  
        // Find the container element
        const statsContainer = document.querySelector('.App-PlayerOverview-Stats');
  
        // Check if the container element exists
        if (statsContainer) {
          // Append HTML content to the container
          statsContainer.insertAdjacentHTML('beforeend', htmlContent);
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
  