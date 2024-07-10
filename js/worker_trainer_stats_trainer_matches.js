self.onmessage = async function (message) {

    // Get all of a trainers matches
    async function getTrainerMatches() {
        console.log("Searching for Trainer Matches");
        const url = message.data;
        const query = await fetch(url);
        const response = await query.json();
        const data = response.data.map(index => index);
        console.log("Got Trainer Matches");
        return data;
    }
    const trainer_matches = await getTrainerMatches();
    console.log(trainer_matches);

    self.postMessage(trainer_matches);
}