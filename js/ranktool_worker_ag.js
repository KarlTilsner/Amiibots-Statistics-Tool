// RANK TOOL: CHECK HOW MANY AMIIBO TO SEARCH FOR
//---------------------------------------------------------------------------------------------------------------------------------------------------------
async function rank_tool_leaderboard_count() {
    // Check how many amiibo to search for on the leaderboard for ag
    let queryURL = 'https://www.amiibots.com/api/amiibo?per_page=1&matchmaking_status=ACTIVE,STANDBY';
    const ruleset_id = '&ruleset_id=af1df0cd-3251-4b44-ba04-d48de5b73f8b';      // ag ruleset
    queryURL += ruleset_id;

    const query = await fetch(queryURL);
    const response = await query.json();
    const per_page = response.total;
    return per_page;
}





self.onmessage = async function(userInput) {

    const searched_trainer_name = (userInput.data).toUpperCase();

    // Determine how many amiibo to search for
    const per_page = await rank_tool_leaderboard_count();

    // get all character names and ids
    let all_character_ids = [];
    let all_character_names = [];
    async function get_all_characters() {
        const url = `https://www.amiibots.com/api/utility/get_all_characters`;
        const query = await fetch(url);
        const response = await query.json();
        const data = response.data.map(
            function(index) {
                all_character_ids.push(index.id);
                all_character_names.push(index.name);
            }
        );
    }
    await get_all_characters();

    // Search through all amiibo and push into array for sorting
    // store the: trainer_name, amiibo name, amiibo id, rating, total matches, character_id
    let all_ruleset_amiibo = [];
    async function get_all_ruleset_amiibo() {
        const url = `https://www.amiibots.com/api/amiibo?per_page=${per_page}&matchmaking_status=ACTIVE,STANDBY&ruleset_id=af1df0cd-3251-4b44-ba04-d48de5b73f8b`; // ag ruleset
        const query = await fetch(url);
        const response = await query.json();
        const data = response.data.map(
            function(index) {
                let twitchUserName = index.user.twitch_user_name;
                twitchUserName = twitchUserName.toUpperCase();

               all_ruleset_amiibo.push({
                    "trainer_name": twitchUserName,
                    "amiibo_name": index.name,
                    "amiibo_id": index.id,
                    "amiibo_rating": index.rating,
                    "total_matches": index.total_matches,
                    "character_id": index.playable_character_id,
                    "match_selection_status": index.match_selection_status
                });
            }
        );
    }
    await get_all_ruleset_amiibo();

    // Search through all amiibo and collect all top 10 amiibo for the specified trainer
    // store the: trainer_name, amiibo name, amiibo id, rating, total matches, character_id, amiibo rank
    let topPlaceAmiibo = [];
    let topTenAmiibo = [];

    // start with the first character in all_character_ids and find all character matching
    for (let i = 0; i < all_character_ids.length; i++) {
        let character_rank = 0;

        // if the character in all_ruleset_amiibo matches the name of the trainer, then push it into the array
        for (let x = 0; x < all_ruleset_amiibo.length; x++) {
            // if the character_id matches the all_character_ids[i] then the current rank increases by 1
            if (all_character_ids[i] == all_ruleset_amiibo[x].character_id) {
                character_rank++

                // if the character ids match and the name of the searched trainer matches then push their amiibo into an object
                if ((character_rank == 1) && (all_character_ids[i] == all_ruleset_amiibo[x].character_id) && (searched_trainer_name == all_ruleset_amiibo[x].trainer_name)) {
                    topPlaceAmiibo.push({
                        "trainer_name": all_ruleset_amiibo[x].trainer_name,
                        "amiibo_name": all_ruleset_amiibo[x].amiibo_name,
                        "amiibo_id": all_ruleset_amiibo[x].amiibo_id,
                        "amiibo_rating": all_ruleset_amiibo[x].amiibo_rating,
                        "total_matches": all_ruleset_amiibo[x].total_matches,
                        "character_id": all_ruleset_amiibo[x].character_id,
                        "match_selection_status": all_ruleset_amiibo[x].match_selection_status,
                        "amiibo_rank": character_rank
                    });
                }

                // if the character ids match and the name of the searched trainer matches then push their amiibo into an object
                if ((character_rank <= 10 && character_rank > 1) && (all_character_ids[i] == all_ruleset_amiibo[x].character_id) && (searched_trainer_name == all_ruleset_amiibo[x].trainer_name)) {
                    topTenAmiibo.push({
                        "trainer_name": all_ruleset_amiibo[x].trainer_name,
                        "amiibo_name": all_ruleset_amiibo[x].amiibo_name,
                        "amiibo_id": all_ruleset_amiibo[x].amiibo_id,
                        "amiibo_rating": all_ruleset_amiibo[x].amiibo_rating,
                        "total_matches": all_ruleset_amiibo[x].total_matches,
                        "character_id": all_ruleset_amiibo[x].character_id,
                        "match_selection_status": all_ruleset_amiibo[x].match_selection_status,
                        "amiibo_rank": character_rank
                    });
                }

            }

        } // end of inner loop

    } // end of outer loop

    const message = {
        topPlaceAmiibo: topPlaceAmiibo,
        topTenAmiibo: topTenAmiibo
      };

    self.postMessage(message);
}