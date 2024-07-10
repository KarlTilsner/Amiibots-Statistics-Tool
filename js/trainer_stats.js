async function updateTrainerID() {
    const trainerID = document.getElementById('trainer_id').value;
    const ruleset_id = document.getElementById("selectTierDropdown").value;

    function isValidUUID(uuid) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }

    if (trainerID != '' && trainerID != null && isValidUUID(trainerID) == true || trainerID == 'None') {
        localStorage.setItem('trainer_stats_trainer_id', trainerID);
        localStorage.setItem('trainer_stats_ruleset_id', ruleset_id)
        location.reload();
    } else {
        alert("trainer_id can not be blank and must be a valid uuid string");
    }
}



const ruleset_names = {
    '44748ebb-e2f3-4157-90ec-029e26087ad0': 'Vanilla',
    '328d8932-456f-4219-9fa4-c4bafdb55776': 'Big 5 Ban',
    'af1df0cd-3251-4b44-ba04-d48de5b73f8b': 'Anything Goes'
};



async function trainerStats() {
    // Get ruleset_id to search for
    async function getRulesetID() {
        if (localStorage.getItem('trainer_stats_ruleset_id') != null) {
            return localStorage.getItem('trainer_stats_ruleset_id');
        }

        alert("No 'ruleset_id'. Please enter a ruleset_id");
    }
    const ruleset_id = await getRulesetID();
    document.getElementById('status_ruleset_id').innerText = ruleset_names[ruleset_id];
    console.log('Ruleset: ', ruleset_id);

    // Get trainer_id to search for
    async function getTrainerID() {
        if (localStorage.getItem('trainer_stats_trainer_id') != null) {
            return localStorage.getItem('trainer_stats_trainer_id');
        }

        alert("No 'trainer_id'. Please enter a trainer_id");
    }
    const trainerID = await getTrainerID();
    document.getElementById('status_trainer_id').innerText = trainerID;
    console.log('Trainer: ', trainerID);

    // spin up new workers
    const worker_trainer_matches = new Worker('./js/worker_trainer_stats_trainer_matches.js');
    worker_trainer_matches.postMessage(`https://www.amiibots.com/api/singles_matches?per_page=${Number.MAX_SAFE_INTEGER}&created_at_start=2018-11-10T00%3A00%3A00Z&ruleset_id=${ruleset_id}&user_id=${trainerID}`);
    document.getElementById('status_trainer_data').innerText = 'Searching';

    let all_characters = [];

    // Chart Theme Colours
    const primary_background_colour = 'rgba(255, 99, 132, 0.2)';      // red
    const primary_border_colour = 'rgba(255, 99, 132, 1)';        // red
    const secondary_background_colour = 'rgba(170, 200, 100, 0.2)';     // green
    const secondary_border_colour = 'rgba(170, 200, 100, 1)';       // green



    // ALL DATA CORRESPONDING TO THE /AMIIBO ENDPOINT
    //--------------------------------------------------------------------------------------------------------------------------------------------------------- 
    async function trainerRankStats() {

        let all_trainer_data = [];

        // get all character names and ids
        async function get_all_characters() {
            console.log("Getting all character names and ids");
            const url = `https://www.amiibots.com/api/utility/get_all_characters`;
            const query = await fetch(url);
            const response = await query.json();
            const data = response.data.map(index => index);

            console.log("Got all character names and ids");
            return data;
        }
        all_characters = await get_all_characters();
        console.log(all_characters);

        // get all amiibo
        async function get_all_amiibo() {
            console.log("Getting all amiibo");
            document.getElementById('status_all_amiibo').innerText = 'Searching';
            const url = `https://www.amiibots.com/api/amiibo?per_page=${Number.MAX_SAFE_INTEGER}&ruleset_id=${ruleset_id}`;
            const query = await fetch(url);
            const response = await query.json();

            // Filter all amiibo
            const all_amiibo_data = [];
            response.data.map(index => {
                if (index.match_selection_status != "INACTIVE") {
                    all_amiibo_data.push(index)
                }
            });

            // Filter trainer amiibo
            const trainer_amiibo_data = [];
            response.data.map(index => {
                if (index.user.id == trainerID) {
                    trainer_amiibo_data.push(index);
                }
            });

            const data = { all: all_amiibo_data, trainer: trainer_amiibo_data };

            console.log(`Got all amiibo`);
            return data;
        }
        const all_amiibo_raw = await get_all_amiibo();
        const all_amiibo = all_amiibo_raw.all;
        console.log("All Amiibo: ", all_amiibo);
        const trainer_amiibo = all_amiibo_raw.trainer;
        console.log("Trainer Amiibo: ", trainer_amiibo);

        if (trainer_amiibo.length == 0) {
            console.log(`Trainer '${trainerID}' has no valid Amiibo in '${ruleset_names[ruleset_id]}'`);
            document.getElementById('status_all_amiibo').innerText = `Failed: Trainer '${trainerID}' has no valid Amiibo in '${ruleset_names[ruleset_id]}'`;
            alert(`Trainer '${trainerID}' has no valid Amiibo in '${ruleset_names[ruleset_id]}'`);

            return false;
        } else document.getElementById('status_all_amiibo').innerText = 'Loading';

        // rank each amiibo
        for (let i = 0; i < all_characters.length; i++) {
            let rank = 1;
            for (let x = 0; x < all_amiibo.length; x++) {
                if (all_characters[i].id == all_amiibo[x].playable_character_id) {
                    all_amiibo[x].character_rank = rank;
                    rank++;
                }
            }
        }

        // get all unique trainers
        const unique_trainers = [];
        all_amiibo.map(index => {
            if (!unique_trainers.some(trainer => trainer.id == index.user.id)) {
                unique_trainers.push({
                    name: index.user.twitch_user_name,
                    id: index.user.id
                });
            }
        });

        // create an object for each trainer with their amiibo 
        unique_trainers.map(trainer => {

            const trainer_data = {
                name: trainer.name,
                id: trainer.id,
                amiibo: []
            };

            const trainer_amiibo_temp = [];

            all_amiibo.map(index => {
                if (trainer.id == index.user.id && index.character_rank <= 10) {
                    trainer_amiibo_temp.push({
                        name: index.name,
                        id: index.id,
                        character_rank: index.character_rank,
                        character: index.playable_character_id,
                        selection_status: index.match_selection_status
                    })
                }
            });

            // Sort arrays
            trainer_amiibo_temp.sort(function (a, b) {
                return ((a.character_rank < b.character_rank) ? -1 : ((a.character_rank == b.character_rank)) ? 0 : 1);
            });

            trainer_amiibo_temp.map(amiibo => {
                if (!trainer_data.amiibo.some(highest_character => highest_character.character == amiibo.character)) {
                    amiibo.highest = true;
                    trainer_data.amiibo.push(amiibo);
                } else {
                    amiibo.highest = false;
                    trainer_data.amiibo.push(amiibo);
                }
            });

            all_trainer_data.push(trainer_data);
        });

        // Get the points assigned to each place
        async function get_points() {
            const url = `./json/points_system.json`;
            const query = await fetch(url);
            const data = await query.json();

            console.log("Got points system");
            return data;
        }
        const points_system = await get_points();

        // Give trainers their score
        all_trainer_data.map(trainer => {
            let trainer_score = 0;

            trainer.amiibo.map(amiibo => {
                if (amiibo.highest == true) {
                    trainer_score += points_system[amiibo.character_rank];
                } else {
                    trainer_score += 1;
                }

            });

            trainer.trainer_score = trainer_score;
        });

        // Sort arrays
        all_trainer_data.sort((a, b) => b.trainer_score - a.trainer_score);

        // Rank trainers
        let rank = 1;
        let previousScore = null;

        all_trainer_data.forEach((trainer, index) => {
            if (previousScore === trainer.trainer_score) {
                trainer.rank = rank;
            } else {
                previousScore = trainer.trainer_score;
                rank = index + 1;
                trainer.rank = rank;
            }
        });

        console.log("🚀 ~ main ~ all_trainer_data:", all_trainer_data);





        // DISPLAY ALL TRAINERS WITH A SCORE ONTO THE DOM
        //--------------------------------------------------------------------------------------------------------------------------------------------------------- 
        async function printCharacterLeaderboard() {

            let content = document.getElementById('trainer_rank_stats');
            let list = '<div class="list_item_container">';

            for (let i = 0; i < all_trainer_data.length; i++) {

                if (all_trainer_data[i].amiibo.length > 0 && all_trainer_data[i].id == trainerID) {
                    // display character icons with their rank
                    let dropdown_list = '<div class="tier_list_container" style="gap: 0px;">';
                    for (let x = 0; x < all_trainer_data[i].amiibo.length; x++) {

                        all_characters.map(character => {
                            if (character.id == all_trainer_data[i].amiibo[x].character && all_trainer_data[i].amiibo[x].highest == true) {

                                dropdown_list += (
                                    `<div class="tier_list_item" onclick="clickListItem('${character.id}', '${ruleset_id}')">
                                        <img src="images/${character.name}.png" class="tier_list_image">
                                        <div class="tier_list_text_box">
                                            <p class="tier_list_text">${all_trainer_data[i].amiibo[x].character_rank}</p>
                                        </div>
                                    </div>`
                                );

                            }
                        });
                    }
                    dropdown_list += "</div>";

                    // display trainer name and relavent info
                    let uniqueAmiibo = 0;
                    all_trainer_data[i].amiibo.map(amiibo => {
                        if (amiibo.highest == true) {
                            uniqueAmiibo++;
                        }
                    });

                    list += (
                        `<div style="width: 100%;">
                        <div class="trainer_list_item" id="list_item_searchable">
                            <div class="list_stats_container">
                                <div class="list_stats">
                                    <h1>${all_trainer_data[i].rank}. ${all_trainer_data[i].name}</h1>
                                </div>

                                <div class="list_stats">
                                    <h2>Score:</h2>
                                    <h1>${all_trainer_data[i].trainer_score} pts</h1>
                                </div>

                                <div class="list_stats">
                                    <h2>Leaderboard Amiibo:</h2>
                                    <h1>${all_trainer_data[i].amiibo.length}</h1>
                                </div>
                            </div>
                        </div>

                        <div class="trainer_rank_unique_amiibo" style="padding: 1rem; padding-top: 0;">
                            <h3>Highest Unique Characters (${uniqueAmiibo}):</h3>
                            <div>${dropdown_list}</div>
                        </div>
                    </div>`
                    );
                }
            }

            list += "</div>";
            content.innerHTML = list;
            document.getElementById('status_all_amiibo').innerText = 'Done';
            removeStatusTab();
        }

        await printCharacterLeaderboard();





        // DISPLAY ALL OF A TRAINERS VALID AMIIBO
        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        async function printValidTrainerAmiibo() {
            let content = document.getElementById('trainer_amiibo_list');
            let list = '<div class="flex_list_container">';
            let status = 'no status';
            let characterIcon = 'no icon';


            trainer_amiibo.map(index => {
                status = 'reset';
                characterIcon = 'reset';

                if (index.match_selection_status == 'ACTIVE') { status = 'ACTIVE'; }
                if (index.match_selection_status == 'STANDBY') { status = 'STANDBY'; }
                if (index.match_selection_status == 'INACTIVE') {
                    status = 'INACTIVE';
                    index.character_rank = 'None';
                }

                // Match current character with icon
                for (let i = 0; i < all_characters.length; i++) {
                    if (all_characters[i].id == index.playable_character_id) {
                        characterIcon = (`${all_characters[i].name}.png`)
                    }
                }

                // Put image onto the listed item when amiibots is fixed
                list += (
                    `<div class="list_item ${status}" id="list_item_searchable" onclick="updateStatsSearch('${index.id}'), addAmiiboToSearchHistory('${index.user.twitch_user_name}', '${index.name}', '${index.id}', '${index.playable_character_id}', '${window.localStorage.getItem(window.localStorage.getItem("Name Search Tool Ruleset"))}', '${new Date()}')">

                    <img src="./images/${characterIcon}" class="list_image">

                    <div class="list_stats_grid_container">
                        <div class="list_stats amiibo_trainer_name_title">
                            <h1>${index.name}</h1>
                        </div>
                    </div>

                    <div class="list_stats_container">
                        <div class="list_stats">
                            <h2>Rating:</h2>
                            <h1>${index.rating.toFixed(2)}</h1>
                        </div>

                        <div class="list_stats">
                            <h2>Win Rate:</h2>
                            <h1>${((index.wins / index.total_matches) * 100).toFixed(2)}%</h1>
                        </div>

                        <div class="list_stats mobile_remove">
                            <h2>Wins:</h2>
                            <h1>${index.wins}</h1>
                        </div>

                        <div class="list_stats mobile_remove">
                            <h2>Losses:</h2>
                            <h1>${index.losses}</h1>
                        </div>

                        <div class="list_stats">
                            <h2>Rank:</h2>   
                            <h1>${index.character_rank}</h1>
                        </div>

                    </div>

                </div>`
                );


            });

            list += "</div>";
            content.innerHTML = list;
            document.getElementById('trainer_amiibo_count').innerText = (`Valid Amiibo: ${trainer_amiibo.length}`);
        }

        await printValidTrainerAmiibo();





        // GET THE AVERAGE RATING OF THE TRAINER
        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        async function trainerRatingStats() {
            // Average rating all 
            let average_rating_all = 0;
            trainer_amiibo.map(index => {
                average_rating_all += index.rating;
            });
            average_rating_all = average_rating_all / trainer_amiibo.length;
            console.log(average_rating_all);

            document.getElementById('trainer_average_rating_all').innerText = `Average Rating (All): ${average_rating_all.toFixed(2)}`;

            // Average rating active and standby
            let average_rating_active_standby = 0;
            let active_counter = 0;
            trainer_amiibo.map(index => {
                if (index.match_selection_status != 'INACTIVE') {
                    average_rating_active_standby += index.rating;
                    active_counter++;
                }
            });
            average_rating_active_standby = average_rating_active_standby / active_counter;
            console.log(average_rating_active_standby);

            document.getElementById('trainer_average_rating_active_standby').innerText = `Average Rating (Active/Standby): ${average_rating_active_standby.toFixed(2)}`;
        }

        await trainerRatingStats();
    }





















    // ALL DATA CORRESPONDING TO THE /SINGLES_MATCHES ENDPOINT
    //---------------------------------------------------------------------------------------------------------------------------------------------------------
    worker_trainer_matches.onmessage = function (responseMessage) {
        const all_matches_data = responseMessage.data;

        document.getElementById('status_trainer_data').innerText = 'Processing';

        console.log("Worker message recieved", all_matches_data);

        if (all_matches_data.length == 0) {
            console.log(`Trainer '${trainerID}' has no data in '${ruleset_names[ruleset_id]}'`);
            document.getElementById('status_trainer_data').innerText = `Failed: Trainer '${trainerID} ' has no data in '${ruleset_names[ruleset_id]}'`;
            alert(`Trainer '${trainerID}' has no data in '${ruleset_names[ruleset_id]}'`);
        }

        // Get trainer name
        function getTrainerName() {
            if (trainerID == all_matches_data[0].fp1.trainer_id) {
                return all_matches_data[0].fp1.trainer_name;
            }

            if (trainerID == all_matches_data[0].fp2.trainer_id) {
                return all_matches_data[0].fp2.trainer_name;
            }
        }
        const trainerName = getTrainerName();



        // GENERAL STATISTICS TAB
        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        function generalStatistics() {

            // First match date
            function firstMatch() {
                let dateString = all_matches_data[all_matches_data.length - 1].created_at;
                let date = new Date(dateString);

                // Define an array of month names
                let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                // Get the day, month, and year
                let day = date.getDate();
                let month = months[date.getMonth()];
                let year = date.getFullYear();

                // Format the date
                const formattedDate = `${day} ${month} ${year}`;

                document.getElementById('trainer_first_match').innerText = `First Match: ${formattedDate}`;
            }
            firstMatch();



            // Last match date
            function lastMatch() {
                let dateString = all_matches_data[0].created_at;
                let date = new Date(dateString);

                // Define an array of month names
                let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                // Get the day, month, and year
                let day = date.getDate();
                let month = months[date.getMonth()];
                let year = date.getFullYear();

                // Format the date
                const formattedDate = `${day} ${month} ${year}`;

                document.getElementById('trainer_last_match').innerText = `Last Match: ${formattedDate}`;
            }
            lastMatch();



            // Get winrate and total matches played
            function matchesAndWinrate() {
                // Get winrate
                let wins = 0;
                all_matches_data.map(index => {
                    if (trainerID == index.winner_info.trainer_id) {
                        wins++;
                    }
                });
                const winrate = (wins / all_matches_data.length) * 100;
                document.getElementById('trainer_winrate').innerText = `Win Rate: ${winrate.toFixed(2)}%`;

                // Display total matches
                document.getElementById('trainer_matches').innerText = `Matches: ${all_matches_data.length}`;
            }
            matchesAndWinrate();



            // Get favourite character
            function favouriteCharacters() {
                const characterTally = {};

                // Create an empty tally with all character IDs
                all_characters.map(character => {
                    characterTally[character.id] = 0;
                });

                // Add to the tally
                all_matches_data.map(index => {
                    if (index.fp1.trainer_id == trainerID) {
                        characterTally[index.fp1.character_id]++;
                    }

                    if (index.fp2.trainer_id == trainerID) {
                        characterTally[index.fp2.character_id]++;
                    }
                });

                // Convert the object to an array of [key, value] pairs
                let dataArray = Object.entries(characterTally);

                // Sort the array based on the values
                dataArray.sort((a, b) => b[1] - a[1]);

                // Transform the sorted array into an array of objects
                let sortedArray = dataArray.map(([id, count]) => ({ id, count }));

                // Extract the first 5 elements
                const top5Array = sortedArray.slice(0, 5);

                console.log(top5Array);

                let list = '<div class="tier_list_container" style="gap: 0px;">';
                top5Array.map(index => {
                    all_characters.map(character => {
                        if (index.id == character.id) {

                            list += (
                                `<div class="tier_list_item">
                                    <img src="images/${character.name}.png" class="tier_list_image">
                                    <div class="tier_list_text_box">
                                        <p class="tier_list_text">${index.count}</p>
                                    </div>
                                </div>`
                            );

                        }
                    });
                });
                list += "</div>";
                document.getElementById('trainer_favourite_characters').innerHTML = list;
            }
            favouriteCharacters();



            // Get top 5 most faced opponents
            function trainerMostFacedOpponents() {
                const opponentTally = {};

                // Create empty tally of all trainers faced
                all_matches_data.map(index => {
                    if (index.winner_info.trainer_id != trainerID) {
                        opponentTally[index.winner_info.trainer_id] = {
                            trainer_id: index.winner_info.trainer_id,
                            win: 0,
                            lose: 0
                        };
                    }

                    if (index.loser_info.trainer_id != trainerID) {
                        opponentTally[index.loser_info.trainer_id] = {
                            trainer_id: index.loser_info.trainer_id,
                            win: 0,
                            lose: 0
                        };
                    }
                });

                // Add to the tally
                all_matches_data.map(index => {
                    if (index.winner_info.trainer_id != trainerID) {
                        opponentTally[index.winner_info.trainer_id].trainer_id = index.winner_info.trainer_id;
                        opponentTally[index.winner_info.trainer_id].lose++;
                    }

                    if (index.loser_info.trainer_id != trainerID) {
                        opponentTally[index.loser_info.trainer_id].trainer_id = index.loser_info.trainer_id;
                        opponentTally[index.loser_info.trainer_id].win++;
                    }
                });

                console.log(opponentTally);

                // Convert the object to an array of entries
                let dataArray = Object.entries(opponentTally);

                // Sort the array based on the total of wins and losses
                dataArray.sort((a, b) => {
                    let totalA = a[1].win + a[1].lose;
                    let totalB = b[1].win + b[1].lose;
                    return totalB - totalA;
                });

                // Transform the sorted array into an array of objects
                let sortedArray = dataArray.map(([id, stats]) => ({
                    win: stats.win,
                    lose: stats.lose,
                    trainer_id: stats.trainer_id
                }));

                // Extract the first 5 elements
                const top5Array = sortedArray.slice(0, 5);

                console.log(top5Array);

                const temp = all_matches_data.slice().reverse();
                console.log(temp);
                top5Array.map(trainer => {
                    temp.map(index => {
                        if (index.winner_info.trainer_id == trainer.trainer_id) {
                            trainer.trainer_name = index.winner_info.trainer_name;
                        }

                        if (index.loser_info.trainer_id == trainer.trainer_id) {
                            trainer.trainer_name = index.loser_info.trainer_name;
                        }
                    });
                });

                let list = '<div class="tier_list_container" style="gap: 2rem;">';
                top5Array.map(index => {
                    list += (
                        `<div>
                            <h2 style="margin: 0;">${index.trainer_name}</h2>
                            <p style="margin: 0;">Win/Loss: ${index.win}/${index.lose}</p>
                        </div>`
                    );
                });
                list += "</div>";
                document.getElementById('trainer_most_faced_opponents').innerHTML = list;
            }
            trainerMostFacedOpponents();



            // Get win and lose streaks
            function trainerStreaks() {
                // Get all unique amiibo
                const trainerUniqueAmiibo = [];

                all_matches_data.map(index => {
                    if (index.winner_info.trainer_id == trainerID && !trainerUniqueAmiibo.some(amiibo => amiibo.id == index.winner_info.id)) {
                        trainerUniqueAmiibo.push({
                            name: index.winner_info.name,
                            id: index.winner_info.id,
                            character_id: index.winner_info.character_id
                        });
                    }

                    if (index.loser_info.trainer_id == trainerID && !trainerUniqueAmiibo.some(amiibo => amiibo.id == index.loser_info.id)) {
                        trainerUniqueAmiibo.push({
                            name: index.loser_info.name,
                            id: index.loser_info.id,
                            character_id: index.loser_info.character_id
                        });
                    }
                });

                // Search through every amiibo and collect their streaks
                trainerUniqueAmiibo.map(amiibo => {
                    let LongestWinstreak = 0;
                    let currentWinstreak = 0;

                    let LongestLosestreak = 0;
                    let currentLosestreak = 0;

                    all_matches_data.map(match => {
                        if (match.winner_info.id == amiibo.id) {
                            currentWinstreak++;
                            currentLosestreak = 0;
                            if (currentWinstreak > LongestWinstreak) {
                                LongestWinstreak = currentWinstreak;
                            }
                        }

                        if (match.loser_info.id == amiibo.id) {
                            currentLosestreak++;
                            currentWinstreak = 0;
                            if (currentLosestreak > LongestLosestreak) {
                                LongestLosestreak = currentLosestreak;
                            }
                        }
                    });

                    amiibo.winstreak = LongestWinstreak;
                    amiibo.losestreak = LongestLosestreak;
                });

                let winstreak = trainerUniqueAmiibo.reduce((max, amiibo) => (amiibo.winstreak > max.winstreak ? amiibo : max), trainerUniqueAmiibo[0]);
                let losestreak = trainerUniqueAmiibo.reduce((max, amiibo) => (amiibo.losestreak > max.losestreak ? amiibo : max), trainerUniqueAmiibo[0]);

                console.log(trainerUniqueAmiibo);



                // Match winstreak character with icon
                let winstreakIcon = "???"
                for (let i = 0; i < all_characters.length; i++) {
                    if (all_characters[i].id == winstreak.character_id) {
                        winstreakIcon = (`${all_characters[i].name}.png`)
                    }
                }

                const list_winstreak =
                    `<div class="flex_list_container" style="padding: 0 1rem;">
                    <div class="list_item">

                        <img src="./images/${winstreakIcon}" class="list_image">

                        <div>
                            <div style="padding-left: 1rem;">
                                <h1>${winstreak.name}</h1>
                                <h2>${winstreak.winstreak}</h2>
                            </div>
                        </div>

                    </div>
                </div>`;

                document.getElementById('trainer_longest_winstreak').innerHTML = list_winstreak;



                // Match losestreak character with icon
                let losestreakIcon = "???"
                for (let i = 0; i < all_characters.length; i++) {
                    if (all_characters[i].id == losestreak.character_id) {
                        losestreakIcon = (`${all_characters[i].name}.png`)
                    }
                }

                const list_losestreak =
                    `<div class="flex_list_container" style="padding: 0 1rem;">
                    <div class="list_item">

                        <img src="./images/${losestreakIcon}" class="list_image">

                        <div>
                            <div style="padding-left: 1rem;">
                                <h1>${losestreak.name}</h1>
                                <h2>${losestreak.losestreak}</h2>
                            </div>
                        </div>

                    </div>
                </div>`;

                document.getElementById('trainer_longest_losestreak').innerHTML = list_losestreak;
            }
            trainerStreaks();

        }
        generalStatistics();





        // ALL AMIIBO RUNS CHART
        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        function allAmiiboRuns() {

            // Get all unique amiibo
            const trainerUniqueAmiibo = [];
            const all_matches_data_reverse = all_matches_data.slice().reverse();

            // Array is reversed to start at the beginning mof match history instead of the present
            all_matches_data_reverse.map(index => {
                if (index.winner_info.trainer_id == trainerID && !trainerUniqueAmiibo.some(amiibo => amiibo.id == index.winner_info.id)) {
                    trainerUniqueAmiibo.push({
                        name: index.winner_info.name,
                        id: index.winner_info.id,
                        character_id: index.winner_info.character_id,
                        first_match: index.created_at,
                        rating_history: ['0.00']
                    });
                }

                if (index.loser_info.trainer_id == trainerID && !trainerUniqueAmiibo.some(amiibo => amiibo.id == index.loser_info.id)) {
                    trainerUniqueAmiibo.push({
                        name: index.loser_info.name,
                        id: index.loser_info.id,
                        character_id: index.loser_info.character_id,
                        first_match: index.created_at,
                        rating_history: ['0.00']
                    });
                }
            });

            // Get rating history of each amiibo
            trainerUniqueAmiibo.map(amiibo => {
                all_matches_data_reverse.map(match => {
                    if (amiibo.id == match.winner_info.id) {
                        amiibo.rating_history.push(match.winner_info.rating.toFixed(2));
                    }

                    if (amiibo.id == match.loser_info.id) {
                        amiibo.rating_history.push(match.loser_info.rating.toFixed(2));
                    }
                });
            });

            console.log(trainerUniqueAmiibo);

            // Determine which amiibo has the most games
            let highest = 0;
            trainerUniqueAmiibo.map(amiibo => {
                if (amiibo.rating_history.length > highest) {
                    highest = amiibo.rating_history.length;
                }
            });

            // Create array for xAxis
            const xAxis_game_count = [];
            for (let i = 0; i < highest; i++) {
                xAxis_game_count.push(i);
            }

            // Generate datasets for each run
            const datasets = [];
            let z = 0;

            trainerUniqueAmiibo.map(index => {
                // Push rating history
                const rating_history = index.rating_history.map(rating => rating);

                // Get character name
                all_characters.map(character => {
                    if (character.id == index.character_id) {
                        index.character_name = character.name;
                    }
                });

                // Create and push datasets
                datasets.push({
                    label: `${index.name} (${index.character_name})`,
                    data: rating_history,
                    borderColor: `rgba(${Math.min(255, z * (255 / trainerUniqueAmiibo.length))}, ${Math.max(0, 255 - z * (255 / trainerUniqueAmiibo.length))}, 255, 1)`,
                    fill: false,
                    borderWidth: 0.5,
                    pointRadius: 0.5,
                    pointHoverRadius: 1,
                });

                z++;
            });

            console.log(datasets);

            //Draw chart onto a canvas
            function RatingHistoryChart() {
                new Chart(document.getElementById('rating_history_chart_canvas'), {
                    type: 'line',
                    data: {
                        labels: xAxis_game_count, // X-Axis (number of games)
                        datasets: datasets, // Use the provided datasets array
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false // This hides the legend
                            },
                            tooltip: {
                                enabled: true // This keeps the tooltips enabled
                            }
                        },
                        scales: {
                            x: {
                                grid: {
                                    display: false,
                                },
                                title: {
                                    display: true,
                                    text: 'Match Number',
                                },
                            },
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: 'rgba(200, 200, 200, 0.2)',
                                },
                                title: {
                                    display: true,
                                    text: 'Rating Over Time',
                                },
                            },
                        },
                    },
                });
            }
            RatingHistoryChart();

        }
        allAmiiboRuns();




        // TRAINER VS TRAINER MATCHUPS
        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        function trainerMatchups() {

            // Get all unique trainers
            const opponents = [];
            all_matches_data.map(index => {
                if (!opponents.some(opponent => opponent.trainer_id == index.winner_info.trainer_id) && trainerID != index.winner_info.trainer_id) {
                    opponents.push({
                        trainer_id: index.winner_info.trainer_id,
                        trainer_name: index.winner_info.trainer_name,
                        wins: 0,
                        losses: 0
                    });
                }

                if (!opponents.some(opponent => opponent.trainer_id == index.loser_info.trainer_id) && trainerID != index.loser_info.trainer_id) {
                    opponents.push({
                        trainer_id: index.loser_info.trainer_id,
                        trainer_name: index.loser_info.trainer_name,
                        wins: 0,
                        losses: 0
                    });
                }
            });

            // Get wins and losses
            opponents.map(opponent => {
                all_matches_data.map(match => {
                    if (opponent.trainer_id == match.winner_info.trainer_id) {
                        opponent.losses++;
                    }

                    if (opponent.trainer_id == match.loser_info.trainer_id) {
                        opponent.wins++;
                    }
                });
            });

            // Sort the array based on the total of wins and losses
            opponents.sort((a, b) => {
                let totalA = a.wins + a.losses;
                let totalB = b.wins + b.losses;
                return totalB - totalA;
            });

            // Calculate winrates
            opponents.map(opponent => {
                opponent.winrate = ((opponent.wins / (opponent.wins + opponent.losses)) * 100).toFixed(2);
            });

            console.log(opponents);

            const wins = [];
            const losses = [];
            const labels = [];

            let graph_height_multiplier = 0;

            // Create data for the chart
            if (opponents.length > 50) {
                for (let i = 0; i < 50; i++) {
                    wins.push(opponents[i].wins);
                    losses.push(opponents[i].losses);
                    labels.push(`${opponents[i].trainer_name} (${opponents[i].winrate}%)`);
                }
                graph_height_multiplier = 50;

            } else {
                for (let i = 0; i < opponents.length; i++) {
                    wins.push(opponents[i].wins);
                    losses.push(opponents[i].losses);
                    labels.push(`${opponents[i].trainer_name} (${opponents[i].winrate}%)`);
                }
                graph_height_multiplier = opponents.length;
            }

            console.log(labels);

            const graph_height = ((graph_height_multiplier * 20) + 200);
            document.getElementById('trainer_matchups').setAttribute("style", `height:${graph_height}px`);

            const datasets = [
                {
                    label: `Wins`,
                    data: wins,
                    backgroundColor: secondary_background_colour,
                    borderColor: secondary_border_colour,
                    fill: true,
                    borderWidth: 1
                },
                {
                    label: `Losses`,
                    data: losses,
                    backgroundColor: primary_background_colour,
                    borderColor: primary_border_colour,
                    fill: true,
                    borderWidth: 1
                }
            ];

            function trainerMatchupChart() {
                new Chart(document.getElementById('trainer_matchups_chart_canvas'), {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: datasets
                    },
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                stacked: true,
                                title: {
                                    display: true,
                                    text: 'Times Defeated'
                                },
                            },
                            y: {
                                stacked: true,
                            },
                        }
                    },
                    plugins: [
                        ChartDataLabels
                    ],
                    labels: {
                        fontColor: 'rgba(170, 200, 100, 1)',
                    }
                });
            }
            trainerMatchupChart();

            document.getElementById('trainer_matchups_chart_title').innerText = `${trainerName} vs Trainers Matchup`;
        }
        trainerMatchups();





        // TRAINER VS CHARACTER MATCHUPS
        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        function characterMatchups() {

            // Get all unique characters
            const opponents = [];
            all_characters.map(character => {
                opponents.push({
                    character_id: character.id,
                    character_name: character.name,
                    wins: 0,
                    losses: 0
                });
            });

            // Get wins and losses
            opponents.map(opponent => {
                all_matches_data.map(match => {
                    if (opponent.character_id == match.winner_info.character_id && trainerID != match.winner_info.trainer_id) {
                        opponent.losses++;
                    }

                    if (opponent.character_id == match.loser_info.character_id && trainerID != match.loser_info.trainer_id) {
                        opponent.wins++;
                    }
                });
            });

            // Sort the array based on the total of wins and losses
            opponents.sort((a, b) => {
                let totalA = a.wins + a.losses;
                let totalB = b.wins + b.losses;
                return totalB - totalA;
            });

            // Calculate winrates
            opponents.map(opponent => {
                opponent.winrate = ((opponent.wins / (opponent.wins + opponent.losses)) * 100).toFixed(2);
            });

            console.log(opponents);

            const wins = [];
            const losses = [];
            const labels = [];

            let graph_height_multiplier = 0;

            // Create data for the chart
            for (let i = 0; i < opponents.length; i++) {
                wins.push(opponents[i].wins);
                losses.push(opponents[i].losses);
                labels.push(`${opponents[i].character_name} (${opponents[i].winrate}%)`);
            }
            graph_height_multiplier = opponents.length;

            console.log(labels);

            const graph_height = ((graph_height_multiplier * 20) + 200);
            document.getElementById('character_matchups').setAttribute("style", `height:${graph_height}px`);

            const datasets = [
                {
                    label: `Wins`,
                    data: wins,
                    backgroundColor: secondary_background_colour,
                    borderColor: secondary_border_colour,
                    fill: true,
                    borderWidth: 1
                },
                {
                    label: `Losses`,
                    data: losses,
                    backgroundColor: primary_background_colour,
                    borderColor: primary_border_colour,
                    fill: true,
                    borderWidth: 1
                }
            ];

            function trainerMatchupChart() {
                new Chart(document.getElementById('character_matchups_chart_canvas'), {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: datasets
                    },
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                stacked: true,
                                title: {
                                    display: true,
                                    text: 'Times Defeated'
                                },
                            },
                            y: {
                                stacked: true,
                            },
                        }
                    },
                    plugins: [
                        ChartDataLabels
                    ],
                    labels: {
                        fontColor: 'rgba(170, 200, 100, 1)',
                    }
                });
            }
            trainerMatchupChart();

            document.getElementById('character_matchups_chart_title').innerText = `${trainerName} vs Characters Matchup`;
        }
        characterMatchups();





        // TRAINER VS CHARACTER MATCHUPS
        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        function amiiboMatchups() {

            // Get all unique trainers
            const opponents = [];
            all_matches_data.map(index => {
                if (!opponents.some(opponent => opponent.id == index.winner_info.id) && trainerID != index.winner_info.trainer_id) {
                    opponents.push({
                        id: index.winner_info.id,
                        name: index.winner_info.name,
                        wins: 0,
                        losses: 0
                    });
                }

                if (!opponents.some(opponent => opponent.id == index.loser_info.id) && trainerID != index.loser_info.trainer_id) {
                    opponents.push({
                        trainer_id: index.loser_info.id,
                        trainer_name: index.loser_info.name,
                        wins: 0,
                        losses: 0
                    });
                }
            });

            // Get wins and losses
            opponents.map(opponent => {
                all_matches_data.map(match => {
                    if (opponent.id == match.winner_info.id) {
                        opponent.losses++;
                    }

                    if (opponent.id == match.loser_info.id) {
                        opponent.wins++;
                    }
                });
            });

            // Sort the array based on the total of wins and losses
            opponents.sort((a, b) => {
                let totalA = a.wins + a.losses;
                let totalB = b.wins + b.losses;
                return totalB - totalA;
            });

            // Calculate winrates
            opponents.map(opponent => {
                opponent.winrate = ((opponent.wins / (opponent.wins + opponent.losses)) * 100).toFixed(2);
            });

            console.log(opponents);

            const wins = [];
            const losses = [];
            const labels = [];

            let graph_height_multiplier = 0;

            // Create data for the chart
            if (opponents.length > 50) {
                for (let i = 0; i < 50; i++) {
                    wins.push(opponents[i].wins);
                    losses.push(opponents[i].losses);
                    labels.push(`${opponents[i].name} (${opponents[i].winrate}%)`);
                }
                graph_height_multiplier = 50;

            } else {
                for (let i = 0; i < opponents.length; i++) {
                    wins.push(opponents[i].wins);
                    losses.push(opponents[i].losses);
                    labels.push(`${opponents[i].name} (${opponents[i].winrate}%)`);
                }
                graph_height_multiplier = opponents.length;
            }

            console.log(labels);

            const graph_height = ((graph_height_multiplier * 20) + 200);
            document.getElementById('amiibo_matchups').setAttribute("style", `height:${graph_height}px`);

            const datasets = [
                {
                    label: `Wins`,
                    data: wins,
                    backgroundColor: secondary_background_colour,
                    borderColor: secondary_border_colour,
                    fill: true,
                    borderWidth: 1
                },
                {
                    label: `Losses`,
                    data: losses,
                    backgroundColor: primary_background_colour,
                    borderColor: primary_border_colour,
                    fill: true,
                    borderWidth: 1
                }
            ];

            function trainerMatchupChart() {
                new Chart(document.getElementById('amiibo_matchups_chart_canvas'), {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: datasets
                    },
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                stacked: true,
                                title: {
                                    display: true,
                                    text: 'Times Defeated'
                                },
                            },
                            y: {
                                stacked: true,
                            },
                        }
                    },
                    plugins: [
                        ChartDataLabels
                    ],
                    labels: {
                        fontColor: 'rgba(170, 200, 100, 1)',
                    }
                });
            }
            trainerMatchupChart();

            document.getElementById('amiibo_matchups_chart_title').innerText = `${trainerName} vs Amiibo Matchup`;
        }
        amiiboMatchups();





        // FULL MATCH HISTORY
        //---------------------------------------------------------------------------------------------------------------------------------------------------------
        function matchHistory() {
            console.log("Printing match history");
            // Sort match data for the match card
            const full_match_history = [];
            for (let i = 0; i < all_matches_data.length; i++) {

                if (trainerID == all_matches_data[i].fp1.trainer_id && trainerID == all_matches_data[i].winner_info.trainer_id) {
                    full_match_history.push({
                        'character_id': all_matches_data[i].fp2.character_id,
                        'opponent_id': all_matches_data[i].fp2.id,
                        'name': all_matches_data[i].fp2.name,
                        'trainer_name': all_matches_data[i].fp2.trainer_name,

                        'opponent_rating': all_matches_data[i].fp2.rating,
                        'your_rating': all_matches_data[i].fp1.rating,
                        'your_current_rating': all_matches_data[i].winner_info.rating,
                        'rating_change': all_matches_data[i].winner_info.rating_change,

                        'your_trainer_name': all_matches_data[i].fp1.trainer_name,
                        'your_amiibo_name': all_matches_data[i].fp1.name,
                        'your_character_id': all_matches_data[i].fp1.character_id,

                        'match_number': all_matches_data.length - i,
                        'match_selection': all_matches_data[i].match_metadata.fp1_selection,
                        'match_win': true
                    });
                }

                if (trainerID == all_matches_data[i].fp1.trainer_id && trainerID == all_matches_data[i].loser_info.trainer_id) {
                    full_match_history.push({
                        'character_id': all_matches_data[i].fp2.character_id,
                        'opponent_id': all_matches_data[i].fp2.id,
                        'name': all_matches_data[i].fp2.name,
                        'trainer_name': all_matches_data[i].fp2.trainer_name,

                        'opponent_rating': all_matches_data[i].fp2.rating,
                        'your_rating': all_matches_data[i].fp1.rating,
                        'your_current_rating': all_matches_data[i].loser_info.rating,
                        'rating_change': all_matches_data[i].loser_info.rating_change,

                        'your_trainer_name': all_matches_data[i].fp1.trainer_name,
                        'your_amiibo_name': all_matches_data[i].fp1.name,
                        'your_character_id': all_matches_data[i].fp1.character_id,

                        'match_number': all_matches_data.length - i,
                        'match_selection': all_matches_data[i].match_metadata.fp1_selection,
                        'match_win': false
                    });
                }

                if (trainerID == all_matches_data[i].fp2.trainer_id && trainerID == all_matches_data[i].winner_info.trainer_id) {
                    full_match_history.push({
                        'character_id': all_matches_data[i].fp1.character_id,
                        'opponent_id': all_matches_data[i].fp1.id,
                        'name': all_matches_data[i].fp1.name,
                        'trainer_name': all_matches_data[i].fp1.trainer_name,

                        'opponent_rating': all_matches_data[i].fp1.rating,
                        'your_rating': all_matches_data[i].fp2.rating,
                        'your_current_rating': all_matches_data[i].winner_info.rating,
                        'rating_change': all_matches_data[i].winner_info.rating_change,

                        'your_trainer_name': all_matches_data[i].fp2.trainer_name,
                        'your_amiibo_name': all_matches_data[i].fp2.name,
                        'your_character_id': all_matches_data[i].fp2.character_id,

                        'match_number': all_matches_data.length - i,
                        'match_selection': all_matches_data[i].match_metadata.fp2_selection,
                        'match_win': true
                    });
                }

                if (trainerID == all_matches_data[i].fp2.trainer_id && trainerID == all_matches_data[i].loser_info.trainer_id) {
                    full_match_history.push({
                        'character_id': all_matches_data[i].fp1.character_id,
                        'opponent_id': all_matches_data[i].fp1.id,
                        'name': all_matches_data[i].fp1.name,
                        'trainer_name': all_matches_data[i].fp1.trainer_name,

                        'opponent_rating': all_matches_data[i].fp1.rating,
                        'your_rating': all_matches_data[i].fp2.rating,
                        'your_current_rating': all_matches_data[i].loser_info.rating,
                        'rating_change': all_matches_data[i].loser_info.rating_change,

                        'your_trainer_name': all_matches_data[i].fp2.trainer_name,
                        'your_amiibo_name': all_matches_data[i].fp2.name,
                        'your_character_id': all_matches_data[i].fp2.character_id,

                        'match_number': all_matches_data.length - i,
                        'match_selection': all_matches_data[i].match_metadata.fp2_selection,
                        'match_win': false
                    });
                }
            }

            // Add + sign to rating increases
            for (let i = 0; i < full_match_history.length; i++) {
                if (full_match_history[i].rating_change > 0) {
                    full_match_history[i].rating_change = `+${full_match_history[i].rating_change.toFixed(2)}`;
                } else {
                    full_match_history[i].rating_change = full_match_history[i].rating_change.toFixed(2);
                }
            }

            // Fix any null values
            for (let i = 0; i < full_match_history.length; i++) {
                if (full_match_history[i].your_rating == null) {
                    full_match_history[i].your_rating = 0;
                }

                if (full_match_history[i].opponent_rating == null) {
                    full_match_history[i].opponent_rating = 0;
                }
            }

            console.log(full_match_history);

            // List all matches onto page
            let content = document.getElementById('amiibo_list');
            let list = '<div class="flex_list_container">';
            for (let i = 0; i < full_match_history.length; i++) { // full_match_history.length TEMPORARILY LIMITED TO 200 MATCHES TO REMOVE LAG, ADD A PAGINATION SYSTEM --------------------------------------------------------------------------------------------------------------------

                // Match current character with icon
                let characterIcon = 'reset';
                let yourCharacterIcon = 'reset';
                for (let x = 0; x < all_characters.length; x++) {
                    // Get opponent amiibo icon
                    if (all_characters[x].id == full_match_history[i].character_id) {
                        characterIcon = (`${all_characters[x].name}.png`)
                    }

                    // Get trainer amiibo icon
                    if (all_characters[x].id == full_match_history[i].your_character_id) {
                        yourCharacterIcon = (`${all_characters[x].name}.png`)
                    }
                }

                list += (
                    `<div class="list_item match_win_${full_match_history[i].match_win}" id="list_item_searchable">
                        <img src="./images/${yourCharacterIcon}" class="list_image">

                        <div class="list_stats_container">
                            <div class="list_stats_grid_container">
                                <div class="list_stats amiibo_trainer_name_title">
                                    <h2>${full_match_history[i].your_trainer_name}</h2>
                                    <h1>${full_match_history[i].your_amiibo_name}</h1>
                                </div>
                            </div>

                            <div class="list_stats">
                                <h2>Rating:</h2>
                                <h1>${full_match_history[i].your_current_rating.toFixed(2)}</h1>
                            </div>

                            <div class="list_stats_vs">
                                <h1 style="text-align: center;">VS</h1>
                            </div>

                            <div class="list_stats">
                                <h2 style="text-align: right; margin-right: 2rem;">Rating:</h2>   
                                <h1 style="text-align: right; margin-right: 2rem;">${full_match_history[i].opponent_rating.toFixed(2)}</h1>
                            </div>

                            <div class="list_stats_grid_container">
                                <div class="list_stats amiibo_trainer_name_title">
                                    <h2 style="text-align: right; margin-right: 2rem;">${full_match_history[i].trainer_name}</h2>
                                    <h1 style="text-align: right; margin-right: 2rem;">${full_match_history[i].name}</h1>
                                </div>
                            </div>

                            <img src="./images/${characterIcon}" class="list_image">
                        </div>

                    </div>`
                );
            }
            list += "</div>";
            content.innerHTML = list;
        }
        matchHistory();

        document.getElementById('status_trainer_data').innerText = 'Done';
        removeStatusTab();
    }

    await trainerRankStats();

}

trainerStats();





// CLICKABLE AMIIBO ICONS
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
async function clickListItem(id, ruleset_id) {
    window.open(`https://www.amiibots.com/leaderboard?characterId=${id}&rulesetId=${ruleset_id}`);
};





// LOADING STATUS REMOVER
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
function removeStatusTab() {
    const amiiboLoading = document.getElementById('status_all_amiibo').innerText
    const trainerLoading = document.getElementById('status_trainer_data').innerText

    if (amiiboLoading == 'Done' && trainerLoading == 'Done') {
        document.getElementById('loading_status').remove();
    }
}