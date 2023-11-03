self.onmessage = async function(matchups_data_message) {

    // Extract amiibo_id and amiibo_ruleset from the message
    const amiibo_id = matchups_data_message.data.amiibo_id;
    const amiibo_ruleset = matchups_data_message.data.amiibo_ruleset;
    const all_matches_data = matchups_data_message.data.all_matches_data;





    async function getTierlistOrder() {
        const order = [];

        const url = `https://www.amiibots.com/api/tier_list/first_dataset_of_given_month?ruleset_id=${amiibo_ruleset}`;
        const query = await fetch(url);
        const response = await query.json();
        console.log("🚀 ~ getTierlistOrder ~ response:", response);

        for (let i = 0; i < response.data.tiers.length; i++) {
            for (let x = 0; x < response.data.tiers[i].character_placements.length; x++) {
                order.push({
                    'name': response.data.tiers[i].character_placements[x].playable_character.character_name,
                    'id': response.data.tiers[i].character_placements[x].playable_character.id,
                    'order': response.data.tiers[i].character_placements[x].order
                });

            }
        }

        return order;
    }
    const tierlistOrder = await getTierlistOrder();
    // console.log('tierlist order', tierlistOrder);





    // Sort amiibo defeated and lost to
    async function sortWinsAndLosses() {
        const matchResult = [];

        for (let i = 0; i < all_matches_data.length; i++) {

            if (amiibo_id == all_matches_data[i].winner_info.id) {
                matchResult.push({
                    'opponent_id': all_matches_data[i].loser_info.character_id,
                    'defeated': true
                });
            }

            if (amiibo_id == all_matches_data[i].loser_info.id) {
                matchResult.push({
                    'opponent_id': all_matches_data[i].winner_info.character_id,
                    'defeated': false
                });
            }

        }

        return matchResult;
    }
    const matchResult = await sortWinsAndLosses();





    const matchups_won = [];
    const matchups_lost = [];
    const matchups_winrate = [];
    const matchups_sort_winrate = [];
    const matchups_tierlist_order = [];
    const matchups_encounters = [];

    async function createMatchupChart() {
        let totalWins = 0;
        let totalLosses = 0;
        let totalMatches = 0;
    
        // count up the wins/losses against each character
        for (let i = 0; i < tierlistOrder.length; i++) {
            let counter_wonTo = 0;
            let counter_lostTo = 0;
    
            // check through the ids of all characters played against, if the id matches the current one then increase the counter
            for (let x = 0; x < matchResult.length; x++) {
                if (tierlistOrder[i].id == matchResult[x].opponent_id && matchResult[x].defeated == true) {
                    totalWins++;
                    counter_wonTo++;
                }
            }
    
            for (let x = 0; x < matchResult.length; x++) {
                if (tierlistOrder[i].id == matchResult[x].opponent_id && matchResult[x].defeated == false) {
                    totalLosses++;
                    counter_lostTo++;
                }
            }
    
            totalMatches += counter_lostTo + counter_wonTo;
    
            // console.log(`${counter_wonTo}/${counter_lostTo} W/L against ${tierlistOrder[i].name}`);
    
            // push wonTo data
            if (counter_wonTo > 0) {
                matchups_won.push(counter_wonTo);
            } else if (counter_lostTo > 0) {matchups_won.push(0);}
    
            // push lostTo data
            if (counter_lostTo > 0) {
                matchups_lost.push(counter_lostTo);
            } else if (counter_wonTo > 0) {matchups_lost.push(0);}
    
            // push any character that have been faced
            if (counter_wonTo > 0 || counter_lostTo > 0) {
                matchups_winrate.push(`${tierlistOrder[i].name} (${((counter_wonTo / (counter_wonTo + counter_lostTo)) * 100).toFixed(2)}%)`);
                matchups_tierlist_order.push(tierlistOrder[i].order);
                matchups_sort_winrate.push(`${((counter_wonTo / (counter_wonTo + counter_lostTo)) * 100).toFixed(2)}`);
                matchups_encounters.push(Number(counter_wonTo + counter_lostTo))
            }
    
        }
    
        
        // console.log(matchups_won);
        // console.log(matchups_lost);
        // console.log(matchups_winrate);
        // console.log(matchups_sort_winrate);

        console.log('Finished matchups');

        const matchups = {
            'matchups_won': matchups_won,
            'matchups_lost': matchups_lost,
            'matchups_winrate': matchups_winrate,
            'matchups_sort_winrate': matchups_sort_winrate,
            'matchups_tierlist_order': matchups_tierlist_order,
            'matchups_encounters': matchups_encounters
        };

        return matchups;

    } 

    self.postMessage(await createMatchupChart());
}