// STARTER FUNCTION
//---------------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    window.localStorage.setItem('SortType', 'sort_by_tierlist');
    highlightSortButton('sort_by_tierlist');
    amiiboStats();
});





// SAVE SEARCH BAR DATA
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function searchMemory() {
    const amiibo_id = document.querySelector('#amiibo_id').value;
    window.localStorage.setItem('saved_amiibo_id', amiibo_id);
}





// UPDATE THE STORED AMIIBO ID AND REDIRECT TO THE STATS TOOL
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function updateStatsSearch(new_id) {
    console.log('updated id');
    window.localStorage.setItem('saved_amiibo_id', new_id);
    window.location.href = "./index.html";
}





// GLOBAL VARIABLES
//---------------------------------------------------------------------------------------------------------------------------------------------------------
// Data for rating history chart
const xAxis_game_count = []; 

// Data for matchup chart
let matchups_tierlist_order = [];
let matchups_won = [];
let matchups_lost = [];
let matchups_winrate = [];
let matchups_sort_winrate = [];
let matchups_encounters = [];

// Chart Theme Colours
const primary_background_colour =     'rgba(255, 99, 132, 0.2)';      // red
const primary_border_colour =         'rgba(255, 99, 132, 1)';        // red
const secondary_background_colour =   'rgba(170, 200, 100, 0.2)';     // green
const secondary_border_colour =       'rgba(170, 200, 100, 1)';       // green
const tertiary_background_colour =    'rgba(0, 170, 240, 0.2)'        // blue
const tertiary_border_colour =        'rgba(0, 170, 240, 1)'          // blue
const quaternary_background_colour =  'rgba(255, 170, 0, 0.2)'        // orange
const quaternary_border_colour =      'rgba(255, 170, 0, 1)'          // orange





// Queries all character names and IDs and pushed them into arrays
//---------------------------------------------------------------------------------------------------------------------------------------------------------
async function get_all_characters() {
    const url = `https://www.amiibots.com/api/utility/get_all_characters`;
    const query = await fetch(url);
    const response = await query.json();
    const data = response.data.map(index => index);
    
    console.log("Got all character names and ids");
    return data;
}





// HANDLES QUICK STATS, RATING HISTORY, CHARACTER MATCHUPS, AND MATCH HISTORY
//---------------------------------------------------------------------------------------------------------------------------------------------------------
async function amiiboStats() {

    // Read the ID submitted in the text box and put it into LocalStorage for later
    const amiibo_id = window.localStorage.getItem('saved_amiibo_id');
    let amiibo_name = null;
    let amiibo_ruleset = null;
    let character_id = null;

    // Storage for each part of the tool
    const all_matches_data = []; // stores all matches for the specified character
    let ratingHistory = []; // stores graph data for rating history and highest rating



    // Destroy the page if anyone searches their amiibo
    const rollEveryone = Math.floor(Math.random() * 1000) + 1;
    console.log(rollEveryone);
    if (rollEveryone == 137) {
        window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley";
    }


    // Destroy the page if ben searches his amiibo
    if (amiibo_id == '26680dc4-8cbd-4de5-ab92-f6e018f63f73') {
        const rollBen = Math.floor(Math.random() * 10) + 1;
        console.log(rollBen);
        if (rollBen == 7) {
            window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley";
        }
    }


    
    const all_characters = await get_all_characters();



    
    
// EXTRACTS ALL RELAVENT DATA FOR EACH TOOL
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    let highest_rating = [{
        "highest_rating": 0,
        "match": 0
    }];

    // Query the amiibo at https://www.amiibots.com/api/singles_matches/by_amiibo_id/[AMIIBO_ID]
    const query = await fetch(`https://www.amiibots.com/api/singles_matches/by_amiibo_id/${amiibo_id}`);
    const response = await query.json();
    async function extractMatchData() {
        let matchCount = 0;

        // This will delete all elements on the page and produce an error message if the amiibo has no games
        try {
            matchCount = response.data.length;
            amiibo_ruleset = response.data[0].ruleset_id;
        } catch (error) {
            const elementsToRemove = document.querySelectorAll('#remove_child_if_no_matches');
            elementsToRemove.forEach(element => {
                element.remove();
            });
            document.querySelector('main').innerHTML += '<h1 class="container" style="text-align: center;">AMIIBO HAS NO DATA</h1>';
        }


        // Take data from the API and store it into the correct objects
        const file = response.data.map(
            async function(index) {

                all_matches_data.push(index);

                // Data for rating history
                if (amiibo_id == index.winner_info.id) {
                    amiibo_name = index.winner_info.name;

                    if (index.winner_info.rating > highest_rating[0].highest_rating) {
                        highest_rating = [{
                            "highest_rating": index.winner_info.rating,
                            "match": matchCount
                        }];
                    }

                    ratingHistory.push({
                        "rating_history": (index.winner_info.rating).toFixed(2),
                        "highest_rating": 0,
                        "rating_sigma": (index.winner_info.rating_sigma).toFixed(2),
                        "rating_mu": (index.winner_info.rating_mu).toFixed(2),
                        "match": matchCount
                    });
                }

                if (amiibo_id == index.loser_info.id) {
                    amiibo_name = index.loser_info.name;

                    if (index.loser_info.rating > highest_rating[0].highest_rating) {
                        highest_rating = [{
                            "highest_rating": index.loser_info.rating,
                            "match": matchCount
                        }];
                    }

                    ratingHistory.push({
                        "rating_history": (index.loser_info.rating).toFixed(2),
                        "highest_rating": 0,
                        "rating_sigma": (index.loser_info.rating_sigma).toFixed(2),
                        "rating_mu": (index.loser_info.rating_mu).toFixed(2),
                        "match": matchCount
                    });
                }

                // increase this to record what match we are on
                matchCount--;
            }
        );
    }
    await extractMatchData();

   



// RATING HISTORY CODE
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    async function processAmiiboStats() {
        // Push initial stats of the amiibo for rating history
        if (response.data[response.data.length - 1].fp1.id == amiibo_id) {
            character_id = response.data[response.data.length - 1].fp1.character_id;
            ratingHistory.push({
                "rating_history": 0,
                "highest_rating": 0,
                "rating_sigma": (response.data[response.data.length - 1].fp1.rating_sigma).toFixed(2),
                "rating_mu": (response.data[response.data.length - 1].fp1.rating_mu).toFixed(2),
                "match": 0
            });
        } else if (response.data[response.data.length - 1].fp2.id == amiibo_id) {
            character_id = response.data[response.data.length - 1].fp2.character_id;
            ratingHistory.push({
                "rating_history": 0,
                "highest_rating": 0,
                "rating_sigma": (response.data[response.data.length - 1].fp2.rating_sigma).toFixed(2),
                "rating_mu": (response.data[response.data.length - 1].fp2.rating_mu).toFixed(2),
                "match": 0
            });
        }
    
        // Reverse the order of the rating history and update the highest rating in the data structure
        let temp = [];
        for (let i = ratingHistory.length - 1; i >= 0; i--) {
            if (ratingHistory[i].match == highest_rating[0].match) {
                ratingHistory[i].highest_rating = (highest_rating[0].highest_rating).toFixed(2);
            }
            temp.push(ratingHistory[i]);
        }
        ratingHistory = temp;
    }
    await processAmiiboStats();


    // Manages datasets for the rating history chart
    async function ratingHistoryDatasets() {
        const datasets = [];
        let newDataset;

        // Push match count into array for chart
        for (let i = 0; i < ratingHistory.length; i++) {
            xAxis_game_count.push(ratingHistory[i].match);
        }

        // Push rating history
        const ratingHistory_rating = [];
        for (let i = 0; i < ratingHistory.length; i++) {
            ratingHistory_rating.push(Number(ratingHistory[i].rating_history));
        }

        // Push highest rating
        const ratingHistory_highestRating = [];
        for (let i = 0; i < ratingHistory.length; i++) {
            ratingHistory_highestRating.push(ratingHistory[i].highest_rating);
        }

        // Push rating sigma
        const ratingHistory_ratingSigma = [];
        for (let i = 0; i < ratingHistory.length; i++) {
            ratingHistory_ratingSigma.push(ratingHistory[i].rating_sigma);
        }

        // Push rating mu
        const ratingHistory_rating_mu = [];
        for (let i = 0; i < ratingHistory.length; i++) {
            ratingHistory_rating_mu.push(ratingHistory[i].rating_mu);
        }

        // Create and push datasets
        newDataset = {
            label: 'Rating History',
            data: ratingHistory_rating,
            backgroundColor: primary_background_colour,
            borderColor: primary_border_colour,
            fill: true,
            borderWidth: 1,
            pointRadius: 1,
            pointHoverRadius: 1,
        };
        datasets.push(newDataset);
        newDataset = {};
    
        const barWidth = ((xAxis_game_count.length)/100)*0.35;
        newDataset = {
            label: `Highest Rating`,
            data: ratingHistory_highestRating,
            backgroundColor: secondary_background_colour, 
            borderColor: secondary_border_colour, 
            fill: true,
            borderWidth: 2,
            barPercentage: barWidth,
            type: 'bar',
        };
        datasets.push(newDataset);
        newDataset = {};

        newDataset = {
            label: 'Rating Sigma',
            data: ratingHistory_ratingSigma,
            borderColor: quaternary_border_colour,
            fill: true,
            borderWidth: 1,
            pointRadius: 1,
            pointHoverRadius: 1,
        };
        datasets.push(newDataset);
        newDataset = {};

        newDataset = {
            label: 'Rating mu',
            data: ratingHistory_rating_mu,
            borderColor: tertiary_border_colour,
            fill: true,
            borderWidth: 1,
            pointRadius: 1,
            pointHoverRadius: 1,
        };
        datasets.push(newDataset);
        newDataset = {};
        
        drawRatingHistory(datasets);
    }
    await ratingHistoryDatasets();





// MINI LEADERBOARD AND AMIIBO RANK CODE
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    const rank_worker = new Worker('./js/worker_index_rank.js');

    const worker_message = {
        "amiibo_id": amiibo_id,
        "amiibo_ruleset": amiibo_ruleset,
        "character_id": character_id
    }

    rank_worker.postMessage(worker_message);

    // Update DOM elements whenever this information gets back
    rank_worker.onmessage = function(amiibo_rank_data) {

        const overall_leaderboard = amiibo_rank_data.data.overall_leaderboard;
        const character_leaderboard = amiibo_rank_data.data.character_leaderboard;

        function printOverallLeaderboard () {
            // Print every amiibo onto the screen
            let content = document.getElementById('overall_rank_mini_leaderboard');
            let list = '<div class="list_item_container">';
    
            for (let i = 0; i < overall_leaderboard.length; i++) {
                for (let x = 0; x < all_characters.length; x++) {
                    let characterIcon = 0;
    
                    if (all_characters[x].id == overall_leaderboard[i].character_id) {
    
                        // Match current character with icon
                        characterIcon = (`${all_characters[x].name}.png`);
    
                        // Put image onto the listed item when amiibots is fixed
                        list += (
                        `<div class="list_item ${overall_leaderboard[i].character_highlight}" id="list_item_searchable" onclick="updateStatsSearch('${overall_leaderboard[i].amiibo_id}')">

                            <img src="./images/${characterIcon}" class="list_image">

                            <div class="list_stats_grid_container">
                                <div class="list_stats amiibo_trainer_name_title">
                                    <h2>${overall_leaderboard[i].trainer_name}</h2>
                                    <h1>${overall_leaderboard[i].amiibo_name}</h1>
                                </div>
                            </div>

                            <div class="list_stats_container">
                                <div class="list_stats">
                                    <h2>Rating:</h2>
                                    <h1>${overall_leaderboard[i].rating.toFixed(2)}</h1>
                                </div>

                                <div class="list_stats mobile_remove">
                                    <h2>Rating Diff:</h2>
                                    <h1>${Math.abs(overall_leaderboard[i].rating_difference).toFixed(2)}</h1>
                                </div>

                                <div class="list_stats">
                                    <h2>Rank:</h2>   
                                    <h1>${overall_leaderboard[i].rank}</h1>
                                </div>
                            </div>

                        </div>`
                        );
                    }
                }
            }
            list += "</div>";
            content.innerHTML = list;
        }
        printOverallLeaderboard();



        function printCharacterLeaderboard () {
            // Print every amiibo onto the screen
            let content = document.getElementById('character_rank_mini_leaderboard');
            let list = '<div class="list_item_container">';
    
            for (let i = 0; i < character_leaderboard.length; i++) {
                for (let x = 0; x < all_characters.length; x++) {
                    let characterIcon = 0;
    
                    if (all_characters[x].id == character_leaderboard[i].character_id) {
    
                        // Match current character with icon
                        characterIcon = (`${all_characters[x].name}.png`);
    
                        // Put image onto the listed item when amiibots is fixed
                        list += (
                        `<div class="list_item ${character_leaderboard[i].character_highlight}" id="list_item_searchable" onclick="updateStatsSearch('${character_leaderboard[i].amiibo_id}')">
                            <img src="./images/${characterIcon}" class="list_image">

                            <div class="list_stats_grid_container">
                                <div class="list_stats amiibo_trainer_name_title">
                                    <h2>${character_leaderboard[i].trainer_name}</h2>
                                    <h1>${character_leaderboard[i].amiibo_name}</h1>
                                </div>
                            </div>

                            <div class="list_stats_container">
                                <div class="list_stats">
                                    <h2>Rating:</h2>
                                    <h1>${character_leaderboard[i].rating.toFixed(2)}</h1>
                                </div>

                                <div class="list_stats mobile_remove">
                                    <h2>Rating Diff:</h2>
                                    <h1>${Math.abs(character_leaderboard[i].rating_difference).toFixed(2)}</h1>
                                </div>

                                <div class="list_stats">
                                    <h2>Rank:</h2>   
                                    <h1>${character_leaderboard[i].rank}</h1>
                                </div>
                            </div>

                        </div>`
                        );
                    }
                }
            }
            list += "</div>";
            content.innerHTML = list;
        }
        printCharacterLeaderboard();
    }





// AMIIBO MATCHUPS CODE
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    const matchups_worker = new Worker('./js/worker_index_matchups.js');

    const matchups_worker_message = {
        "amiibo_id": amiibo_id,
        "amiibo_ruleset": amiibo_ruleset,
        "character_id": character_id,
        "all_matches_data": all_matches_data
    };

    matchups_worker.postMessage(matchups_worker_message);

    // Update DOM elements whenever this information gets back
    matchups_worker.onmessage = function(matchups_data) {
        const graph_height = ((matchups_data.data.matchups_winrate.length * 20) + 200);
        document.getElementById('matchups').setAttribute("style", `height:${graph_height}px`);

        matchups_won = matchups_data.data.matchups_won;
        matchups_lost = matchups_data.data.matchups_lost;
        matchups_winrate = matchups_data.data.matchups_winrate;
        matchups_tierlist_order = matchups_data.data.matchups_tierlist_order;
        matchups_sort_winrate = matchups_data.data.matchups_sort_winrate;
        matchups_encounters = matchups_data.data.matchups_encounters;

        const datasets = [
            {
                label: `Defeated`,
                data: matchups_data.data.matchups_won,
                backgroundColor: secondary_background_colour,
                borderColor: secondary_border_colour,
                fill: true,
                borderWidth: 1
            },
            {
                label: `Lost to`,
                data: matchups_data.data.matchups_lost,
                backgroundColor: primary_background_colour,
                borderColor: primary_border_colour,
                fill: true,
                borderWidth: 1
            }
        ];

        highlightSortButton('sort_by_tierlist');
        drawMatchupChart(datasets);
    }





// FULL MATCH HISTORY CODE
//---------------------------------------------------------------------------------------------------------------------------------------------------------
// 'your_rating': all_matches_data[i].winner_info.rating,

    function fullMatchHistory () {
        // console.log(all_matches_data);

        // Sort match data for the match card
        const full_match_history = [];
        for (let i = 0; i < all_matches_data.length; i++) {

            if (amiibo_id == all_matches_data[i].fp1.id && amiibo_id == all_matches_data[i].winner_info.id) {
                full_match_history.push({
                    'character_id': all_matches_data[i].fp2.character_id,
                    'opponent_id': all_matches_data[i].fp2.id,
                    'name': all_matches_data[i].fp2.name,
                    'trainer_name': all_matches_data[i].fp2.trainer_name,
                    
                    'opponent_rating': all_matches_data[i].fp2.rating,
                    'your_rating':  all_matches_data[i].fp1.rating,
                    'your_current_rating': all_matches_data[i].winner_info.rating,
                    'rating_change': all_matches_data[i].winner_info.rating_change,

                    'match_number': all_matches_data.length - i,
                    'match_selection': all_matches_data[i].match_metadata.fp1_selection,
                    'match_win': true 
                });
            } 

            if (amiibo_id == all_matches_data[i].fp1.id && amiibo_id == all_matches_data[i].loser_info.id) {
                full_match_history.push({
                    'character_id': all_matches_data[i].fp2.character_id,
                    'opponent_id': all_matches_data[i].fp2.id,
                    'name': all_matches_data[i].fp2.name,
                    'trainer_name': all_matches_data[i].fp2.trainer_name,
                    
                    'opponent_rating': all_matches_data[i].fp2.rating,
                    'your_rating':  all_matches_data[i].fp1.rating,
                    'your_current_rating': all_matches_data[i].loser_info.rating,
                    'rating_change': all_matches_data[i].loser_info.rating_change,

                    'match_number': all_matches_data.length - i,
                    'match_selection': all_matches_data[i].match_metadata.fp1_selection,
                    'match_win': false
                });
            }

            if (amiibo_id == all_matches_data[i].fp2.id && amiibo_id == all_matches_data[i].winner_info.id) {
                full_match_history.push({
                    'character_id': all_matches_data[i].fp1.character_id,
                    'opponent_id': all_matches_data[i].fp1.id,
                    'name': all_matches_data[i].fp1.name,
                    'trainer_name': all_matches_data[i].fp1.trainer_name,
                    
                    'opponent_rating': all_matches_data[i].fp1.rating,
                    'your_rating':  all_matches_data[i].fp2.rating,
                    'your_current_rating': all_matches_data[i].winner_info.rating,
                    'rating_change': all_matches_data[i].winner_info.rating_change,

                    'match_number': all_matches_data.length - i,
                    'match_selection': all_matches_data[i].match_metadata.fp2_selection,
                    'match_win': true 
                });
            }

            if (amiibo_id == all_matches_data[i].fp2.id && amiibo_id == all_matches_data[i].loser_info.id) {
                full_match_history.push({
                    'character_id': all_matches_data[i].fp1.character_id,
                    'opponent_id': all_matches_data[i].fp1.id,
                    'name': all_matches_data[i].fp1.name,
                    'trainer_name': all_matches_data[i].fp1.trainer_name,
                    
                    'opponent_rating': all_matches_data[i].fp1.rating,
                    'your_rating':  all_matches_data[i].fp2.rating,
                    'your_current_rating': all_matches_data[i].loser_info.rating,
                    'rating_change': all_matches_data[i].loser_info.rating_change,

                    'match_number': all_matches_data.length - i,
                    'match_selection': all_matches_data[i].match_metadata.fp2_selection,
                    'match_win': false
                });
            }
        }

        // console.log(full_match_history);


        // Get longest winstreak
        let LongestWinstreak = 0;
        let currentWinstreak = 0;
        for (let i = 0; i < full_match_history.length; i++) {
            if (full_match_history[i].match_win == true) {
                currentWinstreak++;
                if (currentWinstreak > LongestWinstreak) {
                    LongestWinstreak = currentWinstreak;
                }
            } else currentWinstreak = 0;

        }

        document.getElementById('amiibo_longest_winstreak').innerText += ` ${LongestWinstreak}`;


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


        // List all matches onto page
        let content = document.getElementById('amiibo_list');
        let list = '<div class="flex_list_container">';
        for (let i = 0; i < full_match_history.length; i++)  {

            // Match current character with icon
            let characterIcon = 'reset';
            for (let x = 0; x < all_characters.length; x++) {
                if (all_characters[x].id == full_match_history[i].character_id) {
                    characterIcon = (`${all_characters[x].name}.png`)
                }
            }

            if (amiibo_id == '26680dc4-8cbd-4de5-ab92-f6e018f63f73') {
                // Broken code for ben
                list += (
                    `<div class="list_item_short match_win_${full_match_history[i].match_win}" id="list_item_searchable">
                        <img src="images/${characterIcon}" class="list_image">
                        <div class="list_stats">
                            <i>Trainer Name:</i>        <b>${full_match_history[i].trainer_name}</b> </br>
                            <i>Amiibo Name:</i>         <b>${full_match_history[i].name}</b> </br>
                            <i>Opponent Rating:</i>     ${(full_match_history[i].opponent_rating).toFixed(2)} </br>
                            <i>Your Rating Change</i>   ${full_match_history[i].rating_change} </br>
                        </div>
                    </div>`
                );
            } else {
                // Normal code for everyone else
                list += (
                    `<div class="list_item match_win_${full_match_history[i].match_win}" id="list_item_searchable" onclick="updateStatsSearch('${full_match_history[i].opponent_id}')">
                        <img src="./images/${characterIcon}" class="list_image">

                        <div class="list_stats_grid_container">
                            <div class="list_stats amiibo_trainer_name_title">
                                <h2>${full_match_history[i].trainer_name}</h2>
                                <h1>${full_match_history[i].name}</h1>
                            </div>
                        </div>

                        <div class="list_stats_container">
                            <div class="list_stats">
                                <h2>Opponent Rating:</h2>
                                <h1>${full_match_history[i].opponent_rating.toFixed(2)}</h1>
                            </div>

                            <div class="list_stats">
                                <h2>Your Rating:</h2>
                                <h1>${full_match_history[i].your_rating.toFixed(2)}</h1>
                            </div>

                            <div class="list_stats">
                                <h2>Rating Change:</h2>   
                                <h1>${full_match_history[i].your_current_rating.toFixed(2)} (${full_match_history[i].rating_change})</h1>
                            </div>

                            <div class="list_stats mobile_remove">
                                <h2>Match: ${full_match_history[i].match_number}</h2>   
                                <h2>Selection: ${full_match_history[i].match_selection}</h2>
                            </div>
                        </div>

                    </div>`
                );
            }

        }
        list += "</div>";
        content.innerHTML = list;

    }
    fullMatchHistory();





    // Update DOM elements and charts to display data
    document.getElementById('rating_history_chart_title').innerText += ` ${amiibo_name}`;
    document.getElementById('matchup_chart_title').innerText += ` ${amiibo_name}`;
    document.getElementById('match_history').innerText = `${amiibo_name}'s ${document.getElementById('match_history').innerText}`;

    document.getElementById('amiibo_rating').innerText += ` ${ratingHistory[ratingHistory.length - 1].rating_history}`;
    document.getElementById('amiibo_highest_rating').innerText += ` ${highest_rating[0].highest_rating.toFixed(2)}`;
    document.getElementById('amiibo_rating_mu').innerText += ` ${ratingHistory[ratingHistory.length - 1].rating_mu}`;
    document.getElementById('amiibo_rating_sigma').innerText += ` ${ratingHistory[ratingHistory.length - 1].rating_sigma}`;
}





// CREATE NEW CANVASES TO RENDER GRAPHS ON
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
function drawRatingHistory(datasets) {
    document.getElementById('rating_history').innerHTML = '<canvas id="rating_history_chart_canvas"></canvas>';  
    RatingHistoryChart(datasets);
}

async function drawMatchupChart(datasets) {
    await document.getElementById('matchups_chart_canvas').remove();
    document.getElementById('matchups').innerHTML = '<canvas id="matchups_chart_canvas"></canvas>';  
    characterMatchupChart(datasets);
}





// HIGHLIGHT SORT BUTTON
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
function highlightSortButton(button_id) {
    let sort_type = window.localStorage.getItem('SortType');
    document.getElementById(`${sort_type}`).removeAttribute("style", `background-color: rgba(220, 220, 220 , 0.3)`);

    document.getElementById(`${button_id}`).setAttribute("style", `background-color: rgba(220, 220, 220 , 0.3)`);
    window.localStorage.setItem('SortType', `${button_id}`);
}





// SORT MATCHUP CHART
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function sortMatchupChartData(sortType) {
    if (sortType === 'tierlist') {
        // Sort array from lowest to highest
        // Combine arrays
        let combineSort = [];
        for (let i = 0; i < matchups_winrate.length; i++) {
            combineSort.push({  
                'name': matchups_winrate[i], 
                'lostTo': matchups_lost[i], 
                'wonTo': matchups_won[i], 
                'winRate': Number(matchups_sort_winrate[i]),
                'order': Number(matchups_tierlist_order[i]),
                'encounters': Number(matchups_encounters[i])
            });
        }

        // Sort arrays
        combineSort.sort(function(a, b) {
            return ((a.order < b.order) ? -1 : ((a.order == b.order)) ? 0 : 1);
        });

        // Seperate data into arrays
        for (let i = 0; i < combineSort.length; i++) {
            matchups_winrate[i] = combineSort[i].name;
            matchups_lost[i] = combineSort[i].lostTo;
            matchups_won[i] = combineSort[i].wonTo;
            matchups_sort_winrate[i] = Number(combineSort[i].winRate);
            matchups_tierlist_order[i] = Number(combineSort[i].order);
            matchups_encounters[i] = Number(combineSort[i].encounters);
        }

        console.log('Sorted by tierlist');
    }


    if (sortType === 'winRate') {
        // Sort array from lowest to highest
        // Combine arrays
        let combineSort = [];
        for (let i = 0; i < matchups_winrate.length; i++) {
            combineSort.push({  
                'name': matchups_winrate[i], 
                'lostTo': matchups_lost[i], 
                'wonTo': matchups_won[i], 
                'winRate': Number(matchups_sort_winrate[i]),
                'order': Number(matchups_tierlist_order[i]),
                'encounters': Number(matchups_encounters[i])
            });
        }

        // Sort arrays
        combineSort.sort(function(a, b) {
            return ((a.winRate > b.winRate) ? -1 : ((a.winRate == b.winRate)) ? 0 : 1);
        });

        // Seperate data into arrays
        for (let i = 0; i < combineSort.length; i++) {
            matchups_winrate[i] = combineSort[i].name;
            matchups_lost[i] = combineSort[i].lostTo;
            matchups_won[i] = combineSort[i].wonTo;
            matchups_sort_winrate[i] = Number(combineSort[i].winRate);
            matchups_tierlist_order[i] = Number(combineSort[i].order);
            matchups_encounters[i] = Number(combineSort[i].encounters);
        }

        console.log('Sorted by winrate');
    }


    if (sortType === 'numberOfEncounters') {
        // Sort array from lowest to highest
        // Combine arrays
        let combineSort = [];
        for (let i = 0; i < matchups_winrate.length; i++) {
            combineSort.push({  
                'name': matchups_winrate[i], 
                'lostTo': matchups_lost[i], 
                'wonTo': matchups_won[i], 
                'winRate': Number(matchups_sort_winrate[i]),
                'order': Number(matchups_tierlist_order[i]),
                'encounters': Number(matchups_encounters[i])
            });
        }

        // Sort arrays
        combineSort.sort(function(a, b) {
            return ((a.encounters > b.encounters) ? -1 : ((a.encounters == b.encounters)) ? 0 : 1);
        });

        // Seperate data into arrays
        for (let i = 0; i < combineSort.length; i++) {
            matchups_winrate[i] = combineSort[i].name;
            matchups_lost[i] = combineSort[i].lostTo;
            matchups_won[i] = combineSort[i].wonTo;
            matchups_sort_winrate[i] = Number(combineSort[i].winRate);
            matchups_tierlist_order[i] = Number(combineSort[i].order);
            matchups_encounters[i] = Number(combineSort[i].encounters);
        }

        console.log('Sorted by number of encounters');
    }


    const datasets = [
        {
            label: `Defeated`,
            data: matchups_won,
            backgroundColor: secondary_background_colour,
            borderColor: secondary_border_colour,
            fill: true,
            borderWidth: 1
        },
        {
            label: `Lost to`,
            data: matchups_lost,
            backgroundColor: primary_background_colour,
            borderColor: primary_border_colour,
            fill: true,
            borderWidth: 1
        }
    ];

    drawMatchupChart(datasets);
}