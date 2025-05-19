// id count from project, not tested


(async () => {
  const usernames = [
    "username1",
    "username2"
    // Add more iNat usernames here
  ];
  const projectId = 123456; // Replace with your actual project ID
  const base = "https://api.inaturalist.org/v1";

  // Step 1: Get all observation IDs in the project (paginated)
  async function getProjectObservationIDs() {
    let page = 1, perPage = 200;
    let allIDs = [], done = false;

    while (!done) {
      const res = await fetch(`${base}/observations?project_id=${projectId}&verifiable=true&per_page=${perPage}&page=${page}`);
      const data = await res.json();
      const ids = data.results.map(obs => obs.id);
      allIDs.push(...ids);
      if (ids.length < perPage) done = true;
      page++;
    }

    return allIDs;
  }

  // Step 2: For each user, count identifications on those observation IDs
  async function countUserIdentificationsOnObs(username, obsIDs) {
    let count = 0;
    const chunkSize = 100;

    for (let i = 0; i < obsIDs.length; i += chunkSize) {
      const chunk = obsIDs.slice(i, i + chunkSize);
      const url = `${base}/identifications?user_login=${username}&observation_id=${chunk.join(",")}&per_page=200`;
      const res = await fetch(url);
      const data = await res.json();
      count += data.total_results || 0;
    }

    return count;
  }

  async function getUserStats(username, projectObsIDs) {
    const observationURL = `${base}/observations?project_id=${projectId}&user_login=${username}&verifiable=true&per_page=1`;
    const speciesURL = `${base}/observations/species_counts?project_id=${projectId}&user_login=${username}&verifiable=true`;

    try {
      const [obsRes, speciesRes] = await Promise.all([
        fetch(observationURL),
        fetch(speciesURL)
      ]);

      const obsData = await obsRes.json();
      const speciesData = await speciesRes.json();

      const idents = await countUserIdentificationsOnObs(username, projectObsIDs);

      return {
        Username: username,
        Observations: obsData.total_results || 0,
        Species: speciesData.total_results || 0,
        Identifications: idents
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

  console.log("Fetching observation IDs from project...");
  const projectObservationIDs = await getProjectObservationIDs();
  console.log(`Total observations in project: ${projectObservationIDs.length}`);

  const results = [];
  for (const user of usernames) {
    const stats = await getUserStats(user, projectObservationIDs);
    results.push(stats);
  }

  console.table(results);
})();
