self.onmessage = async function(amiibo_id_message) {
    // Extract amiibo_id and amiibo_ruleset from the message
    const amiibo_id = amiibo_id_message.data.amiibo_id;
    const amiibo_ruleset = amiibo_id_message.data.amiibo_ruleset;
    const character_id = amiibo_id_message.data.character_id;

    async function getCharacterName() {
        const query = await fetch(`https://www.amiibots.com/api/utility/character_id_to_name?character_id=${character_id}`);
        const response = await query.json();
        return response.data;
    }
    const character_name = await getCharacterName();
  
    async function findNumberOfAmiibo() {
        // Query only one amiibo for the total number of amiibo on amiibots
        const query = await fetch(`https://www.amiibots.com/api/amiibo?per_page=1&ruleset_id=${amiibo_ruleset}&matchmaking_status=ACTIVE,STANDBY`);
        const response = await query.json();
        return response.total;
    }
    const numberOfAmiibo = await findNumberOfAmiibo();





    // Display ranks of 0 for inactive amiibo or amiibo that may not have enough games to show on the leaderboard  





    async function findAmiiboRank() {
        let overallRank = 0;
        let characterRank = 0;

        let overall_leaderboard = [];
        let character_leaderboard = [];
        
        // Query all amiibo except for inactive ones for the given ruleset and find the leaderboard position
        const query = await fetch(`https://www.amiibots.com/api/amiibo?per_page=${numberOfAmiibo}&ruleset_id=${amiibo_ruleset}&matchmaking_status=ACTIVE,STANDBY`);
        const response = await query.json();
        // console.log(response);
        const file = response.data.map(
            async function(index) {

                overallRank++;
                overall_leaderboard.push({
                    'trainer_name': index.user.twitch_user_name,
                    'amiibo_name': index.name,
                    'rating': index.rating,
                    'amiibo_id': index.id,
                    'character_id': index.playable_character_id,
                    'total_matches': index.total_matches, 
                    'rank': overallRank
                });

                if (character_id == index.playable_character_id) {
                    characterRank++;
                    character_leaderboard.push({
                        'trainer_name': index.user.twitch_user_name,
                        'amiibo_name': index.name,
                        'rating': index.rating,
                        'amiibo_id': index.id,
                        'character_id': index.playable_character_id,
                        'total_matches': index.total_matches, 
                        'rank': characterRank
                    });
                }

            }
        );

        
        for (let i = 0; i < overall_leaderboard.length; i++) {
            if (amiibo_id == overall_leaderboard[i].amiibo_id) {
                overall_leaderboard[i].character_highlight = 'highlight_amiibo';
            } else overall_leaderboard[i].character_highlight = '';
        }

        for (let i = 0; i < character_leaderboard.length; i++) {
            if (amiibo_id == character_leaderboard[i].amiibo_id) {
                character_leaderboard[i].character_highlight = 'highlight_amiibo';
            } else character_leaderboard[i].character_highlight = ''
        }


        // console.log(overall_leaderboard);
        // console.log(character_leaderboard);

        const rank_quick_stats = {
            'rank_overall':  0,
            'rank_character': 0,
            'next_rank_overall': 0,
            'next_rank_character': 0
        };


        const shortened_overall_leaderboard = [];
        for (let i = 0; i < overall_leaderboard.length; i++) {
            if (amiibo_id == overall_leaderboard[i].amiibo_id && overall_leaderboard[i].rank == 1) {
                shortened_overall_leaderboard.push(overall_leaderboard[i]); 
                shortened_overall_leaderboard.push(overall_leaderboard[i + 1]);
                shortened_overall_leaderboard.push(overall_leaderboard[i + 2]);
                shortened_overall_leaderboard.push(overall_leaderboard[i + 3]);
                shortened_overall_leaderboard.push(overall_leaderboard[i + 4]);

                shortened_overall_leaderboard[0].rating_difference = `${shortened_overall_leaderboard[0].rating - shortened_overall_leaderboard[0].rating}`;
                shortened_overall_leaderboard[1].rating_difference = `${shortened_overall_leaderboard[0].rating - shortened_overall_leaderboard[1].rating}`;
                shortened_overall_leaderboard[2].rating_difference = `${shortened_overall_leaderboard[0].rating - shortened_overall_leaderboard[2].rating}`;
                shortened_overall_leaderboard[3].rating_difference = `${shortened_overall_leaderboard[0].rating - shortened_overall_leaderboard[3].rating}`;
                shortened_overall_leaderboard[4].rating_difference = `${shortened_overall_leaderboard[0].rating - shortened_overall_leaderboard[4].rating}`;

                rank_quick_stats.rank_overall = shortened_overall_leaderboard[0].rank;
                rank_quick_stats.next_rank_overall = shortened_overall_leaderboard[0].rating_difference;
            }

            if (amiibo_id == overall_leaderboard[i].amiibo_id && overall_leaderboard[i].rank == 2) {
                shortened_overall_leaderboard.push(overall_leaderboard[i - 1]);
                shortened_overall_leaderboard.push(overall_leaderboard[i]);
                shortened_overall_leaderboard.push(overall_leaderboard[i + 1]);
                shortened_overall_leaderboard.push(overall_leaderboard[i + 2]);
                shortened_overall_leaderboard.push(overall_leaderboard[i + 3]);

                shortened_overall_leaderboard[0].rating_difference = `${shortened_overall_leaderboard[1].rating - shortened_overall_leaderboard[0].rating}`;
                shortened_overall_leaderboard[1].rating_difference = `${shortened_overall_leaderboard[1].rating - shortened_overall_leaderboard[1].rating}`;
                shortened_overall_leaderboard[2].rating_difference = `${shortened_overall_leaderboard[1].rating - shortened_overall_leaderboard[2].rating}`;
                shortened_overall_leaderboard[3].rating_difference = `${shortened_overall_leaderboard[1].rating - shortened_overall_leaderboard[3].rating}`;
                shortened_overall_leaderboard[4].rating_difference = `${shortened_overall_leaderboard[1].rating - shortened_overall_leaderboard[4].rating}`;

                rank_quick_stats.rank_overall = shortened_overall_leaderboard[1].rank;
                rank_quick_stats.next_rank_overall = shortened_overall_leaderboard[0].rating_difference;
            }

            if (amiibo_id == overall_leaderboard[i].amiibo_id && overall_leaderboard[i].rank >= 3 && i <= overall_leaderboard.length - 3) {
                shortened_overall_leaderboard.push(overall_leaderboard[i - 2]);
                shortened_overall_leaderboard.push(overall_leaderboard[i - 1]);
                shortened_overall_leaderboard.push(overall_leaderboard[i]);
                shortened_overall_leaderboard.push(overall_leaderboard[i + 1]);
                shortened_overall_leaderboard.push(overall_leaderboard[i + 2]);

                shortened_overall_leaderboard[0].rating_difference = `${shortened_overall_leaderboard[2].rating - shortened_overall_leaderboard[0].rating}`;
                shortened_overall_leaderboard[1].rating_difference = `${shortened_overall_leaderboard[2].rating - shortened_overall_leaderboard[1].rating}`;
                shortened_overall_leaderboard[2].rating_difference = `${shortened_overall_leaderboard[2].rating - shortened_overall_leaderboard[2].rating}`;
                shortened_overall_leaderboard[3].rating_difference = `${shortened_overall_leaderboard[2].rating - shortened_overall_leaderboard[3].rating}`;
                shortened_overall_leaderboard[4].rating_difference = `${shortened_overall_leaderboard[2].rating - shortened_overall_leaderboard[4].rating}`;

                rank_quick_stats.rank_overall = shortened_overall_leaderboard[2].rank;
                rank_quick_stats.next_rank_overall = shortened_overall_leaderboard[1].rating_difference;
            }

            if (amiibo_id == overall_leaderboard[i].amiibo_id && i == overall_leaderboard.length - 2) {
                shortened_overall_leaderboard.push(overall_leaderboard[i - 3]);
                shortened_overall_leaderboard.push(overall_leaderboard[i - 2]);
                shortened_overall_leaderboard.push(overall_leaderboard[i - 1]);
                shortened_overall_leaderboard.push(overall_leaderboard[i]);
                shortened_overall_leaderboard.push(overall_leaderboard[i + 1]);

                shortened_overall_leaderboard[0].rating_difference = `${shortened_overall_leaderboard[3].rating - shortened_overall_leaderboard[0].rating}`;
                shortened_overall_leaderboard[1].rating_difference = `${shortened_overall_leaderboard[3].rating - shortened_overall_leaderboard[1].rating}`;
                shortened_overall_leaderboard[2].rating_difference = `${shortened_overall_leaderboard[3].rating - shortened_overall_leaderboard[2].rating}`;
                shortened_overall_leaderboard[3].rating_difference = `${shortened_overall_leaderboard[3].rating - shortened_overall_leaderboard[3].rating}`;
                shortened_overall_leaderboard[4].rating_difference = `${shortened_overall_leaderboard[3].rating - shortened_overall_leaderboard[4].rating}`;

                rank_quick_stats.rank_overall = shortened_overall_leaderboard[3].rank;
                rank_quick_stats.next_rank_overall = shortened_overall_leaderboard[2].rating_difference;
            }

            if (amiibo_id == overall_leaderboard[i].amiibo_id && i == overall_leaderboard.length - 1) {
                shortened_overall_leaderboard.push(overall_leaderboard[i - 4]);
                shortened_overall_leaderboard.push(overall_leaderboard[i - 3]);
                shortened_overall_leaderboard.push(overall_leaderboard[i - 2]);
                shortened_overall_leaderboard.push(overall_leaderboard[i - 1]);
                shortened_overall_leaderboard.push(overall_leaderboard[i]);

                shortened_overall_leaderboard[0].rating_difference = `${shortened_overall_leaderboard[4].rating - shortened_overall_leaderboard[0].rating}`;
                shortened_overall_leaderboard[1].rating_difference = `${shortened_overall_leaderboard[4].rating - shortened_overall_leaderboard[1].rating}`;
                shortened_overall_leaderboard[2].rating_difference = `${shortened_overall_leaderboard[4].rating - shortened_overall_leaderboard[2].rating}`;
                shortened_overall_leaderboard[3].rating_difference = `${shortened_overall_leaderboard[4].rating - shortened_overall_leaderboard[3].rating}`;
                shortened_overall_leaderboard[4].rating_difference = `${shortened_overall_leaderboard[4].rating - shortened_overall_leaderboard[4].rating}`;

                rank_quick_stats.rank_overall = shortened_overall_leaderboard[4].rank;
                rank_quick_stats.next_rank_overall = shortened_overall_leaderboard[3].rating_difference;
            }
        }


        const shortened_character_leaderboard = [];
        for (let i = 0; i < character_leaderboard.length; i++) {
            if (amiibo_id == character_leaderboard[i].amiibo_id && character_leaderboard[i].rank == 1) {
                shortened_character_leaderboard.push(character_leaderboard[i]);
                shortened_character_leaderboard.push(character_leaderboard[i + 1]);
                shortened_character_leaderboard.push(character_leaderboard[i + 2]);
                shortened_character_leaderboard.push(character_leaderboard[i + 3]);
                shortened_character_leaderboard.push(character_leaderboard[i + 4]);

                shortened_character_leaderboard[0].rating_difference = `${shortened_character_leaderboard[0].rating - shortened_character_leaderboard[0].rating}`;
                shortened_character_leaderboard[1].rating_difference = `${shortened_character_leaderboard[0].rating - shortened_character_leaderboard[1].rating}`;
                shortened_character_leaderboard[2].rating_difference = `${shortened_character_leaderboard[0].rating - shortened_character_leaderboard[2].rating}`;
                shortened_character_leaderboard[3].rating_difference = `${shortened_character_leaderboard[0].rating - shortened_character_leaderboard[3].rating}`;
                shortened_character_leaderboard[4].rating_difference = `${shortened_character_leaderboard[0].rating - shortened_character_leaderboard[4].rating}`;

                rank_quick_stats.rank_character = shortened_character_leaderboard[0].rank;
                rank_quick_stats.next_rank_character = shortened_character_leaderboard[0].rating_difference;
            }

            if (amiibo_id == character_leaderboard[i].amiibo_id && character_leaderboard[i].rank == 2) {
                shortened_character_leaderboard.push(character_leaderboard[i - 1]);
                shortened_character_leaderboard.push(character_leaderboard[i]);
                shortened_character_leaderboard.push(character_leaderboard[i + 1]);
                shortened_character_leaderboard.push(character_leaderboard[i + 2]);
                shortened_character_leaderboard.push(character_leaderboard[i + 3]);

                shortened_character_leaderboard[0].rating_difference = `${shortened_character_leaderboard[1].rating - shortened_character_leaderboard[0].rating}`;
                shortened_character_leaderboard[1].rating_difference = `${shortened_character_leaderboard[1].rating - shortened_character_leaderboard[1].rating}`;
                shortened_character_leaderboard[2].rating_difference = `${shortened_character_leaderboard[1].rating - shortened_character_leaderboard[2].rating}`;
                shortened_character_leaderboard[3].rating_difference = `${shortened_character_leaderboard[1].rating - shortened_character_leaderboard[3].rating}`;
                shortened_character_leaderboard[4].rating_difference = `${shortened_character_leaderboard[1].rating - shortened_character_leaderboard[4].rating}`;

                rank_quick_stats.rank_character = shortened_character_leaderboard[1].rank;
                rank_quick_stats.next_rank_character = shortened_character_leaderboard[0].rating_difference;
            }

            if (amiibo_id == character_leaderboard[i].amiibo_id && character_leaderboard[i].rank >= 3 && i <= character_leaderboard.length - 3) {
                shortened_character_leaderboard.push(character_leaderboard[i - 2]);
                shortened_character_leaderboard.push(character_leaderboard[i - 1]);
                shortened_character_leaderboard.push(character_leaderboard[i]);
                shortened_character_leaderboard.push(character_leaderboard[i + 1]);
                shortened_character_leaderboard.push(character_leaderboard[i + 2]);

                shortened_character_leaderboard[0].rating_difference = `${shortened_character_leaderboard[2].rating - shortened_character_leaderboard[0].rating}`;
                shortened_character_leaderboard[1].rating_difference = `${shortened_character_leaderboard[2].rating - shortened_character_leaderboard[1].rating}`;
                shortened_character_leaderboard[2].rating_difference = `${shortened_character_leaderboard[2].rating - shortened_character_leaderboard[2].rating}`;
                shortened_character_leaderboard[3].rating_difference = `${shortened_character_leaderboard[2].rating - shortened_character_leaderboard[3].rating}`;
                shortened_character_leaderboard[4].rating_difference = `${shortened_character_leaderboard[2].rating - shortened_character_leaderboard[4].rating}`;

                rank_quick_stats.rank_character = shortened_character_leaderboard[2].rank;
                rank_quick_stats.next_rank_character = shortened_character_leaderboard[1].rating_difference;
            }

            if (amiibo_id == character_leaderboard[i].amiibo_id && i == character_leaderboard.length - 2) {
                shortened_character_leaderboard.push(character_leaderboard[i - 3]);
                shortened_character_leaderboard.push(character_leaderboard[i - 2]);
                shortened_character_leaderboard.push(character_leaderboard[i - 1]);
                shortened_character_leaderboard.push(character_leaderboard[i]);
                shortened_character_leaderboard.push(character_leaderboard[i + 1]);

                shortened_character_leaderboard[0].rating_difference = `${shortened_character_leaderboard[3].rating - shortened_character_leaderboard[0].rating}`;
                shortened_character_leaderboard[1].rating_difference = `${shortened_character_leaderboard[3].rating - shortened_character_leaderboard[1].rating}`;
                shortened_character_leaderboard[2].rating_difference = `${shortened_character_leaderboard[3].rating - shortened_character_leaderboard[2].rating}`;
                shortened_character_leaderboard[3].rating_difference = `${shortened_character_leaderboard[3].rating - shortened_character_leaderboard[3].rating}`;
                shortened_character_leaderboard[4].rating_difference = `${shortened_character_leaderboard[3].rating - shortened_character_leaderboard[4].rating}`;

                rank_quick_stats.rank_character = shortened_character_leaderboard[3].rank;
                rank_quick_stats.next_rank_character = shortened_character_leaderboard[2].rating_difference;
            }

            if (amiibo_id == character_leaderboard[i].amiibo_id && i == character_leaderboard.length - 1) {
                shortened_character_leaderboard.push(character_leaderboard[i - 4]);
                shortened_character_leaderboard.push(character_leaderboard[i - 3]); 
                shortened_character_leaderboard.push(character_leaderboard[i - 2]);
                shortened_character_leaderboard.push(character_leaderboard[i - 1]);
                shortened_character_leaderboard.push(character_leaderboard[i]);

                shortened_character_leaderboard[0].rating_difference = `${shortened_character_leaderboard[4].rating - shortened_character_leaderboard[0].rating}`;
                shortened_character_leaderboard[1].rating_difference = `${shortened_character_leaderboard[4].rating - shortened_character_leaderboard[1].rating}`;
                shortened_character_leaderboard[2].rating_difference = `${shortened_character_leaderboard[4].rating - shortened_character_leaderboard[2].rating}`;
                shortened_character_leaderboard[3].rating_difference = `${shortened_character_leaderboard[4].rating - shortened_character_leaderboard[3].rating}`;
                shortened_character_leaderboard[4].rating_difference = `${shortened_character_leaderboard[4].rating - shortened_character_leaderboard[4].rating}`;

                rank_quick_stats.rank_character = shortened_character_leaderboard[4].rank;
                rank_quick_stats.next_rank_character = shortened_character_leaderboard[3].rating_difference;
            }
        }

        console.log(shortened_overall_leaderboard);
        console.log(shortened_character_leaderboard);

        const processedData = {
            "character_leaderboard": shortened_character_leaderboard,
            "overall_leaderboard": shortened_overall_leaderboard,
            "quick_stats": rank_quick_stats
        };

        return processedData;
    }
    const processedData = await findAmiiboRank();

    console.log('Finished finding ranks');

    self.postMessage(processedData);
}