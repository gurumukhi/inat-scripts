// for observations count and species count of list of users for a given project like city-nature-challenge-2025-india
// ID count not correct

(async () => {
  const usernames = [
    "gurumukhi",
    "harini19"
    // Add more iNat usernames here
  ];
  const projectId = "city-nature-challenge-2025-india"; // Replace with your actual project ID

  const base = "https://api.inaturalist.org/v1";

  async function getUserStats(username) {
    const observationURL = `${base}/observations?project_id=${projectId}&user_login=${username}&verifiable=true&per_page=1`;
    const speciesURL = `${base}/observations/species_counts?project_id=${projectId}&user_login=${username}&verifiable=true`;
    const identificationsURL = `${base}/identifications?project_id=${projectId}&user_login=${username}&per_page=1`;

    try {
      const [obsRes, speciesRes, identRes] = await Promise.all([
        fetch(observationURL),
        fetch(speciesURL),
        fetch(identificationsURL)
      ]);

      const obsData = await obsRes.json();
      const speciesData = await speciesRes.json();
      const identData = await identRes.json();

      return {
        Username: username,
        Observations: obsData.total_results || 0,
        Species: speciesData.total_results || 0,
        Identifications: identData.total_results || 0
      };
    } catch (err) {
      console.error(`Error fetching data for ${username}:`, err);
      return {
        Username: username,
        Observations: "Error",
        Species: "Error",
        Identifications: "Error"
      };
    }
  }

  const results = [];
  for (const user of usernames) {
    const stats = await getUserStats(user);
    results.push(stats);
  }

  console.table(results);
})();




