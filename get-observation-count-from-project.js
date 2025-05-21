(async () => {
const runID = 1; // 🔁 Change this for each batch: 1, 2, 3, etc.
const chunkSize = 60;
    const usernames = [
    // 🔁 Add your full list of usernames here

    "user1",
    "user2",


    // Add more usernames as needed
  ];

  const projectId = "city-nature-challenge-2025-india";
  

  const startIndex = (runID - 1) * chunkSize;
  const endIndex = runID * chunkSize;
  const usernamesToRun = usernames.slice(startIndex, endIndex);

  console.log(`Running batch ${runID} (users ${startIndex + 1} to ${endIndex})`);

  const results = [];

  for (const username of usernamesToRun) {
    try {
      const url = `https://api.inaturalist.org/v1/observations?project_id=${projectId}&user_login=${username}&per_page=1`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const data = await res.json();

      // Check if API returned zero results for bad username
      if (
        data.total_results === 0 &&
        (!data.results || data.results.length === 0)
      ) {
        // console.warn(`0`);
        results.push({
          Username: username,
          Observations: "0"
        });
      } else {
        results.push({
          Username: username,
          Observations: data.total_results || 0
        });
      }
    } catch (err) {
      // console.error(`❌ Error fetching for "${username}":`, err.message);
      results.push({
        Username: username,
        Observations: "Invalid Username"
      });
    }
  }

  console.table(results);
})();
