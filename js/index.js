//                                                              GLOBAL PARAMETERS
//---------------------------------------------------------------------------------------------------------------------------------------------------------  
// Search parameters 
let amiibo_id = window.localStorage.getItem("Amiibo Name");
let amiibots_id = 'Trainer ID Not Found';

// Ruleset Selector
window.localStorage.setItem("vanilla", '44748ebb-e2f3-4157-90ec-029e26087ad0');
window.localStorage.setItem("b5b", '328d8932-456f-4219-9fa4-c4bafdb55776');
window.localStorage.setItem("ag", 'af1df0cd-3251-4b44-ba04-d48de5b73f8b');
let ruleset_input = window.localStorage.getItem("Ruleset");
let ruleset_select = window.localStorage.getItem(ruleset_input);

// Query URL
let user_id = `&user_id=${window.localStorage.getItem("Twitch Name")}`;
let ruleset_id = `&ruleset_id=${ruleset_select}`;
let created_at_start = '&created_at_start=2018-11-10T00%3A00%3A00Z';
let matchmaking_status = '&matchmaking_status=ACTIVE,STANDBY';

// Gathered data
let amiibo_name = 'Amiibo Not Found';
const rating_change = [];
const rating_reversed = [0];
const rating = [];
const rating_mu = [];
const rating_sigma = [];
let my_character_id = 'null';
let my_character_name = 'null';

// Rating history chart data
const yAxis = rating_reversed; 
const yAxisBar = [];     
const xAxis = [];

// Amiibo matchup chart data
const amiibo_lost_to_id = [];
const amiibo_defeated_id = [];
let character_id = [];
let character_name = [];
const character_defeated_id = [];
const character_name_count = [];
    // Data graphed in matchup chart
    let character_lost_to_id_count = [];
    let character_defeated_id_count = [];
    let tier_break = [];
    let character_win_rate = [];

    let sorted_character_lost_to_count = [];
    let sorted_character_defeated_count = [];
    let sorted_character_name = [];
    let sorted_character_win_rate = [];

// Leaderboard data
const leaderboard_character_id = [];
const leaderboard_amiibo_id = [];
const leaderboard_same_character_id = [];
const leaderboard_rating_overall = [];
const leaderboard_rating_character = [];
let rank_overall = 0;
let rank_character = 0;
let next_rank_overall = 0;
let next_rank_character = 0;

// Chart Theme Colours
let primary_background_colour =     'rgba(255, 99, 132, 0.2)';      // Red
let primary_border_colour =         'rgba(255, 99, 132, 1)';        // red
let secondary_background_colour =   'rgba(170, 200, 100, 0.2)';     // green
let secondary_border_colour =       'rgba(170, 200, 100, 1)';       // green

// Tier List
const tiers = ['U TIER', 'S TIER', 'A+ TIER', 'A TIER', 'B+ TIER', 'B TIER', 'C+ TIER', 'C TIER', 'D+ TIER'];
let tier_list = [   'U TIER', 'Incineroar', 
                    'S TIER', 'Min Min', 'King K. Rool', 'Terry', 'Bowser', 'Byleth', 
                    'A+ TIER', 'Mii Gunner', 'King Dedede', 'Ridley', 'Ness', 'Link', 
                    'A TIER', 'Olimar', 'Lucas', 'Hero', 'Ganondorf', 'Zelda', 'Piranha Plant', 'Snake', 'Mii Brawler', 'Captain Falcon', 'Mii Swordfighter', 'Donkey Kong', 'Pit', 'Dark Pit', 'Banjo & Kazooie', 
                    'B+ TIER', 'Steve', 'Kirby', 'Dr. Mario', 'Ike', 'Pokemon Trainer', 'Shulk', 'Chrom', 'Little Mac', 'Cloud', 'Yoshi', 'Roy', 'Ryu', 
                    'B TIER', 'Luigi', 'Robin', 'Mega Man', 'Corrin', 'Isabelle', 'Meta Knight', 'Wolf', 'Lucina', 'Joker', 'Pac-Man', 'Palutena', 'Falco', 'Wario', 'Samus', 'Dark Samus', 'Bowser Jr.', 
                    'C+ TIER', 'Villager', 'Mewtwo', 'Ice Climbers', 'Marth', 'Duck Hunt', 'Lucario', 'Mario', 'Pikachu', 'Wii Fit Trainer', 'Greninja', 'Sonic', 'Simon', 'Richter', 'Rosalina & Luma', 
                    'C TIER', 'Peach', 'Daisy', 'Diddy Kong', 'Toon Link', 'R.O.B.', 'Young Link', 'Inkling', 'Pichu', 'Mr. Game & Watch', 'Ken', 
                    'D+ TIER', 'Jigglypuff', 'Sheik', 'Fox', 'Zero Suit Samus', 'Bayonetta'
                ];





//                                                              AUTO SEARCH HOW MANY MATCHES NEED TO BE QUERIED
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
async function queryLength(apiURL, data_outlet) {

    let queryURL = `https://www.amiibots.com/api/${apiURL}?per_page=1`;
    let match_count;

    // Creating URL link
    if (apiURL === 'singles_matches' && data_outlet === 'fetchData') {queryURL += created_at_start + user_id + ruleset_id;} 
    else if (apiURL === 'amiibo' && data_outlet === 'amiiboListingTool') {queryURL = queryURL;}
    else if (apiURL === 'amiibo' && data_outlet === 'generateTierList') {queryURL += ruleset_id + matchmaking_status;}
       
    // Find how many matches the rest of the program needs to search
    fetch(queryURL)
        .then(function(queryURL_response) {return queryURL_response.json();})
        .then(function(data) {
            console.log(data);
            match_count = data.total;
            console.log(`Found ${match_count} "${apiURL}" matches!`);
            if (data_outlet === 'fetchData') {fetchData(match_count);}
            if (data_outlet === 'amiibotsIDSearch') {amiibotsIDSearch(match_count);}
            if (data_outlet === 'amiiboListingTool') {amiiboListingTool(match_count);}
            if (data_outlet === 'generateTierList') {generateTierList(match_count);}
        });
}





//                                                              FUNCTION WAY TOO BIG FOR ITS OWN GOOD
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
async function fetchData(match_count) {
// Query URL
const matches = match_count;
match_count = `&per_page=${match_count}`;

const url_matches = 'https://www.amiibots.com/api/singles_matches?' + match_count + user_id + ruleset_id + created_at_start; 
const url_get_all_characters = 'https://www.amiibots.com/api/utility/get_all_characters';

// Change placeholder text to show what is being searched
document.querySelector('#twitch_name').placeholder = ("Current Trainer ID is: " + window.localStorage.getItem("Twitch Name"));
document.querySelector('#amiibo_name').placeholder = ("Current Amiibo ID is: " + window.localStorage.getItem("Amiibo Name"));
document.querySelector('#ruleset').placeholder = ("Current Ruleset is: " + window.localStorage.getItem("Ruleset"));

    // Fetch data from Amiibots API
    console.log('Querying the API');
    const singles_matches = await fetch(url_matches);
    const get_all_characters = await fetch(url_get_all_characters);

    // After response is recieved
    const datapoints = await singles_matches.json();
    const get_all_characters_json = await get_all_characters.json();
    console.log('Recieved response');

    // Filter data and push it into an array
    console.log(`This trainer has ${datapoints.data.length} out of ${matches} matches searched`);

    // Push rating changes into array
    const ratingChange = datapoints.data.map(
        function(index) {
            if (index.winner_info.id === amiibo_id) {
                rating_change.push(index.winner_info.rating_change);
                rating_mu.push(index.winner_info.rating_mu);
                rating_sigma.push(index.winner_info.rating_sigma);
                rating.push(index.winner_info.rating);
                amiibo_name = index.winner_info.name;
                amiibo_defeated_id.push(index.loser_info.character_id);
                my_character_id = index.winner_info.character_id;
                return(index.winner_info.rating_change);
            } 
            else if (index.loser_info.id === amiibo_id) {
                rating_change.push(index.loser_info.rating_change);
                rating_mu.push(index.loser_info.rating_mu);
                rating_sigma.push(index.loser_info.rating_sigma);
                rating.push(index.loser_info.rating);
                amiibo_name = index.loser_info.name;
                amiibo_lost_to_id.push(index.winner_info.character_id);
                my_character_id = index.loser_info.character_id;
                return(index.loser_info.rating_change);
            }    
            else return (0);     
        });

        console.log(`${amiibo_name} has played ${rating.length} out of ${matches} matches searched`);

//                                                              AMIIBO MATCHUP CHART DATA
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
    // Generate data for X and Y axis for characters that won
        let tier_list_charid = [];

    const pushCharacterData = get_all_characters_json.data.map(
        function(index) {
            character_name.push(index.name);
            character_id.push(index.id);

            if (index.id === my_character_id) {
                my_character_name = index.name;
            }
        });

    // Sort into tier lists
    tier_list[34] = character_name[57]; // THIS IS THE FILTHIEST PIECE OF CODE I HAVE EVER WRITTEN IN DATA ENGINEERING I WANT A FIX TO THIS TRASH ASAP
    for (let i = 0; i < tier_list.length; i++) {
        for (x = 0; x < tiers.length; x++) {
            if (tiers[x] == tier_list[i]) {
                tier_list_charid.push(tiers[x]);
            }
        }
        for (let y = 0; y < character_name.length; y++) {
            if (character_name[y] == tier_list[i]) {
                tier_list_charid.push(character_id[y]);
            } 
        }
    }

    // console.log(tier_list);
    // console.log(tier_list_charid);


    // Amiibo matchup chart axis data
    for (i = 0; i < tier_list_charid.length; i++) {
        // for every character add to a counter
        let amiibo_lost_to_counter = 0;
        let defeated_amiibo_counter = 0;
        let tier_counter = 0;

        // Check if pointer is on a tier
        for (x = 0; x < tiers.length; x++) {
            if (tiers[x] == tier_list_charid[i]) {
                tier_counter = 50;
            }
        }

        // Check if pointer is on an amiibo lost to
        for (y = 0; y < amiibo_lost_to_id.length; y++) {
            if (amiibo_lost_to_id[y] == tier_list_charid[i]) {
                amiibo_lost_to_counter++;
            }
        }

        // Check if pointer is on an a defeated amiibo
        for (z = 0; z < amiibo_defeated_id.length; z++) {
            if (amiibo_defeated_id[z] == tier_list_charid[i]) {
                defeated_amiibo_counter++;
            }
        }

        // Push counters to win/loss arrays for graphing
        if (amiibo_lost_to_counter == 0 && defeated_amiibo_counter == 0 && tier_counter == 50) {
            tier_break.push(tier_counter);
            character_lost_to_id_count.push(0);
            character_defeated_id_count.push(0);
        }

        if ((amiibo_lost_to_counter > 0) || (defeated_amiibo_counter > 0)) {
            tier_break.push(0);
        }
        
        if (amiibo_lost_to_counter > 0) {
            character_lost_to_id_count.push(amiibo_lost_to_counter);
        }
        if (amiibo_lost_to_counter == 0 && defeated_amiibo_counter > 0) {
            character_lost_to_id_count.push(0);
        }
        if (defeated_amiibo_counter > 0) {
            character_defeated_id_count.push(defeated_amiibo_counter);
        }
        if (defeated_amiibo_counter == 0 && amiibo_lost_to_counter > 0) {
            character_defeated_id_count.push(0);
        }

        // Push all tiers and character names with values > 0
        if ((amiibo_lost_to_counter == 0 && defeated_amiibo_counter == 0 && tier_counter == 50) || (amiibo_lost_to_counter > 0) || (defeated_amiibo_counter > 0)) {
            character_name_count.push(tier_list[i]);
        }
    }

    

    // Amiibo defeated and lost to data
    // for (let c_id = 0; c_id < character_id.length; c_id++) {
    //     let lost_id_counter = 0;
    //     let defeated_id_counter = 0;
    //     for (let a_lt = 0; a_lt < amiibo_lost_to_id.length; a_lt++) {
    //         if (character_id[c_id] == amiibo_lost_to_id[a_lt]) {
    //             lost_id_counter++;
    //         }
    //     }
    //     for (let d_id = 0; d_id < amiibo_defeated_id.length; d_id++) {
    //         if (character_id[c_id] == amiibo_defeated_id[d_id]) {
    //             defeated_id_counter++;
    //         }
    //     }

    //     if (lost_id_counter > 0) {
    //         character_lost_to_id_count.push(lost_id_counter);
    //     }
    //     if (lost_id_counter == 0 && defeated_id_counter > 0) {
    //         character_lost_to_id_count.push(lost_id_counter);
    //     }
    //     if (defeated_id_counter > 0) {
    //         character_defeated_id_count.push(defeated_id_counter);
    //     }
    //     if (defeated_id_counter == 0 && lost_id_counter > 0) {
    //         character_defeated_id_count.push(defeated_id_counter);
    //     }

    //     if ((lost_id_counter > 0 && defeated_id_counter > 0) || (lost_id_counter > 0) || (defeated_id_counter > 0)) {
    //         character_name_count.push(character_name[c_id]);
    //     }
    // }

    // Win rate calculator
    for (let i = 0; i < character_name_count.length; i++) {
            character_win_rate.push(`${character_name_count[i]} (${(((character_defeated_id_count[i])/(character_lost_to_id_count[i] + character_defeated_id_count[i]))*100).toFixed(2)}%)`);
    }















    
//                                                              GETTING LEADERBOARD DATA
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
// Get leaderboard data
console.log('Querying leaderboard data');
const playable_character_id = `&playable_character_id=${my_character_id}`; //1874d724-bd91-43ab-91ae-a8b4a740b951
const rank_url_query = 'https://www.amiibots.com/api/amiibo?' + match_count + ruleset_id + matchmaking_status;

const amiibo_ranks_data_query = await fetch(rank_url_query);
const amiibo_ranks_data = await amiibo_ranks_data_query.json();

console.log('Recieved response');

const amiibo_ranks_data_loop = amiibo_ranks_data.data.map(
    function(index) {
        leaderboard_amiibo_id.push(index.id);
        leaderboard_character_id.push(index.playable_character_id);
        leaderboard_rating_overall.push(index.rating);
});

for (let i = 0; i < leaderboard_amiibo_id.length; i++) {
    // Get leaderbaord rank overall
    if (leaderboard_amiibo_id[i] === amiibo_id) {
        rank_overall = i + 1;

        if (rank_overall != 1) {
            next_rank_overall = (leaderboard_rating_overall[i - 1] - leaderboard_rating_overall[i]).toFixed(5);
        }
    }

    // Get all same character leaderboard data
    if (leaderboard_character_id[i] === my_character_id) {
        leaderboard_same_character_id.push(leaderboard_amiibo_id[i]);
        leaderboard_rating_character.push(leaderboard_rating_overall[i])
    }
}

for (let i = 0; i < leaderboard_same_character_id.length; i++) {
    if (leaderboard_same_character_id[i] === amiibo_id) {
        rank_character = i + 1;

        if (rank_character != 1) {
            next_rank_character = (leaderboard_rating_character[i - 1] - leaderboard_rating_character[i]).toFixed(5);
        }
    }
} 

//                                                              GENERATE RATING HISTORY ARRAYS
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
for (let i = rating.length - 1; i >= 0; i--) {
    rating_reversed.push(rating[i]);
}

for (let i = 0; i < rating_reversed.length; i++) {
    xAxis.push(i);   
}

console.log(`Rating: ${rating_reversed[rating_reversed.length - 1]}`);

//                                                              EDIT HTML INNER TEXT
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
document.getElementById('rating_history_chart_title').innerHTML = (`Rating History of: ${amiibo_name}`);
document.getElementById('matchup_chart_title').innerHTML = (`Character Matchups of: ${amiibo_name}`);

document.getElementById('amiibo_rating').innerText = (`Rating: ${(rating_reversed[rating_reversed.length - 1]).toFixed(5)}`);
document.getElementById('amiibo_rating_max').innerText = (`Highest Rating: ${(Math.max.apply(null, rating_reversed).toFixed(5))}`);
document.getElementById('amiibo_rating_mu').innerText = (`Rating mu: ${(rating_mu[rating_mu.length - rating_mu.length + 1].toFixed(5))}`);
document.getElementById('amiibo_rating_sigma').innerText = (`Rating Sigma: ${(rating_sigma[rating_sigma.length - rating_sigma.length + 1]).toFixed(5)}`);

document.getElementById('amiibo_rank_overall').innerText = (`Rank (Overall): ${rank_overall} / ${leaderboard_amiibo_id.length}`);
document.getElementById('amiibo_rank_character').innerText = (`Rank (${my_character_name}): ${rank_character} / ${leaderboard_same_character_id.length}`);
document.getElementById('amiibo_next_rank_overall').innerText = (`Next Rank (Overall): ${next_rank_overall}`);
document.getElementById('amiibo_next_rank_character').innerText = (`Next Rank (${my_character_name}): ${next_rank_character}`);

window.localStorage.setItem('SortType', 'sort_by_tierlist');
let sort_type = window.localStorage.getItem('SortType');
document.getElementById(`${sort_type}`).setAttribute("style", `background-color: rgba(220, 220, 220 , 0.3)`);

console.log('Data Fetched!');

//                                                              HIGHLIGHT HIGHEST RATING VALUE
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
let max_rating_value = Math.max.apply(null, rating_reversed).toFixed(5);

for (let i = 0; i < yAxis.length; i++) {
    if (yAxis[i].toFixed(5) == max_rating_value) {
    yAxisBar.push(yAxis[i]);
    } else {
        yAxisBar.push(0)
    }
}

drawCharts();

} // END OF fetchData();





//                                                              MATCHUP CHART SORTING
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
function highlightSortButton(button_id) {

    let sort_type = window.localStorage.getItem('SortType');
    document.getElementById(`${sort_type}`).removeAttribute("style", `background-color: rgba(220, 220, 220 , 0.3)`);

    document.getElementById(`${button_id}`).setAttribute("style", `background-color: rgba(220, 220, 220 , 0.3)`);
    window.localStorage.setItem('SortType', `${button_id}`);
}





//                                                              MATCHUP CHART SORTING
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
function sortMatchupChartData(sortType) {
    sorted_character_name = [];
    sorted_character_lost_to_count = [];
    sorted_character_defeated_count = [];
    sorted_character_win_rate = [];
    let total_encounters = [];

    for (let i = 0; i < character_id.length; i++) {
        let lost_to_counter = 0;
        let defeated_counter = 0;

        // Count up all amiibo lost to
        for (let x = 0; x < amiibo_lost_to_id.length; x++) {
            if (character_id[i] == amiibo_lost_to_id[x]) {
                lost_to_counter++;
            }
        }

        // Count up all amiibo defeated
        for (y = 0; y < amiibo_defeated_id.length; y++) {
            if (character_id[i] == amiibo_defeated_id[y]) {
                defeated_counter++;
            }
        }

        let totalEncounters = lost_to_counter + defeated_counter;

        // Push counts into array for sorting
        if (lost_to_counter > 0) {
            sorted_character_lost_to_count.push(lost_to_counter);
        }

        if (lost_to_counter > 0 && defeated_counter == 0) {
            sorted_character_defeated_count.push(0);
        }

        if (defeated_counter > 0) {
            sorted_character_defeated_count.push(defeated_counter);
        }

        if (defeated_counter > 0 && lost_to_counter == 0) {
            sorted_character_lost_to_count.push(0);
        }

        // Push character names without a 0
        if (defeated_counter > 0 || lost_to_counter > 0) {
            sorted_character_name.push(character_name[i]);
            total_encounters.push(totalEncounters);
            if (((defeated_counter / totalEncounters) * 100).toFixed(2) == '100.00') {
                sorted_character_win_rate.push((((defeated_counter / totalEncounters) * 100).toFixed(2)) - 0.01);
            } else sorted_character_win_rate.push(((defeated_counter / totalEncounters) * 100).toFixed(2));
        }        
    }

    if (sortType === 'winRate') {
        // Sort array from highest to lowest
        // Combine arrays
        let combineSort = [];
        for (let i = 0; i < sorted_character_name.length; i++) {
            combineSort.push({  'name': sorted_character_name[i], 
                                'lostTo': sorted_character_lost_to_count[i], 
                                'defeated': sorted_character_defeated_count[i], 
                                'winRate': sorted_character_win_rate[i]
                            });
        }

        // Sort arrays
        combineSort.sort(function(a, b) {
            return ((a.winRate > b.winRate) ? -1 : ((a.winRate == b.winRate)) ? 0 : 1);
        });

        // Seperate data into arrays
        for (let i = 0; i < combineSort.length; i++) {
            sorted_character_name[i] = combineSort[i].name;
            sorted_character_lost_to_count[i] = combineSort[i].lostTo;
            sorted_character_defeated_count[i] = combineSort[i].defeated;
            sorted_character_win_rate[i] = combineSort[i].winRate;
        }

        // Fix 99.99 and push win rate into names
        for (let i = 0; i < combineSort.length; i++) {
            if (sorted_character_win_rate[i] == "99.99")
            sorted_character_win_rate[i] = "100.00";

            sorted_character_name[i] = (`${sorted_character_name[i]} (${sorted_character_win_rate[i]}%)`);
        }
    }

    else if (sortType === 'numberOfEncounters') {
        // Sort array from highest to lowest
        // Combine arrays
        let combineSort = [];
        for (let i = 0; i < sorted_character_name.length; i++) {
            combineSort.push({  'name': sorted_character_name[i], 
                                'lostTo': sorted_character_lost_to_count[i], 
                                'defeated': sorted_character_defeated_count[i], 
                                'winRate': sorted_character_win_rate[i],
                                'encounters': total_encounters[i],
                            });
        }

        // Sort arrays
        combineSort.sort(function(a, b) {
            return ((a.encounters > b.encounters) ? -1 : ((a.encounters == b.encounters)) ? 0 : 1);
        });

        // Seperate data into arrays
        for (let i = 0; i < combineSort.length; i++) {
            sorted_character_name[i] = combineSort[i].name;
            sorted_character_lost_to_count[i] = combineSort[i].lostTo;
            sorted_character_defeated_count[i] = combineSort[i].defeated;
            sorted_character_win_rate[i] = combineSort[i].winRate;
        }

        // Fix 99.99 and push win rate into names
        for (let i = 0; i < combineSort.length; i++) {
            if (sorted_character_win_rate[i] == "99.99")
            sorted_character_win_rate[i] = "100.00";

            sorted_character_name[i] = (`${sorted_character_name[i]} (${sorted_character_win_rate[i]}%)`);
        }
    }

    else if (sortType === 'mostLostTo') {
        // Sort array from highest to lowest
        // Combine arrays
        let combineSort = [];
        for (let i = 0; i < sorted_character_name.length; i++) {
            combineSort.push({  'name': sorted_character_name[i], 
                                'lostTo': sorted_character_lost_to_count[i], 
                                'defeated': sorted_character_defeated_count[i], 
                                'winRate': sorted_character_win_rate[i]
                            });
        }

        // Sort arrays
        combineSort.sort(function(a, b) {
            return ((a.lostTo > b.lostTo) ? -1 : ((a.lostTo == b.lostTo)) ? 0 : 1);
        });

        // Seperate data into arrays
        for (let i = 0; i < combineSort.length; i++) {
            sorted_character_name[i] = combineSort[i].name;
            sorted_character_lost_to_count[i] = combineSort[i].lostTo;
            sorted_character_defeated_count[i] = combineSort[i].defeated;
            sorted_character_win_rate[i] = combineSort[i].winRate;
        }

        // Fix 99.99 and push win rate into names
        for (let i = 0; i < combineSort.length; i++) {
            if (sorted_character_win_rate[i] == "99.99")
            sorted_character_win_rate[i] = "100.00";

            sorted_character_name[i] = (`${sorted_character_name[i]} (${sorted_character_win_rate[i]}%)`);
        }
    }

    drawCharts('sorted');
}





//                                                              AMIIBOTS ID SEARCH TOOL
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
async function amiibotsIDSearch() {
    const twitchName = document.querySelector('#search_amiibo_name_and_id').value;

    document.getElementById('amiibo_id_found').innerText = (`Searching 2500 matches for trainer_id...`);

    const ruleset_input = document.getElementById('ruleset_select_amiibo_id_search').value;
    const ruleset_select = window.localStorage.getItem(ruleset_input);
    const ruleset_id = `&ruleset_id=${ruleset_select}`;
    match_count = `&per_page=${2500}`;

    console.log('Searching 2500 matches for trainer_id');
    
    const id_url_query = 'https://www.amiibots.com/api/singles_matches?' + match_count + ruleset_id;
    const id_data_query = await fetch(id_url_query);
    const id_data_response = await id_data_query.json();

    console.log('Recieved response');

    const id_data = id_data_response.data.map(
        function(index) {
            if (index.fp1.trainer_name === twitchName) {
                amiibots_id = index.fp1.trainer_id;
            } else if (index.fp2.trainer_name === twitchName) {
                amiibots_id = index.fp2.trainer_id;
            }
    });

    document.getElementById('amiibots_id_found').innerText = (amiibots_id);

    queryLength('amiibo', 'amiiboListingTool');
}





//                                                              AMIIBO LISTING TOOL
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
async function amiiboListingTool(match_count) {
    const submitted_amiibots_name = document.querySelector('#search_amiibo_name_and_id').value;
    ruleset_id = document.getElementById('ruleset_select_amiibo_id_search').value;
    const ruleset_input = `&ruleset_id=${window.localStorage.getItem(ruleset_id)}`;

    document.getElementById('amiibo_id_found').innerText = (`Searching for amiibo...`);

    console.log('Searching for amiibo');
    
    match_count = `&per_page=${match_count}`;
    const rank_url_query = 'https://www.amiibots.com/api/amiibo?' + match_count + ruleset_input;
    const match_history_query = await fetch(rank_url_query);
    const match_history_response = await match_history_query.json();
    console.log('Recieved response');

    let content = document.getElementById('amiibo_list');
    let list = '<div class="flex_list_container">';
    let amiibo_count = 0;
    let status = 'no status';
    const match_history = match_history_response.data.map(
        function(index) {
            if (index.user.twitch_user_name === submitted_amiibots_name) {
                amiibo_count++;

                status = 'reset';

                if (index.match_selection_status == 'ACTIVE') {status = 'ACTIVE';}
                if (index.match_selection_status == 'STANDBY') {status = 'STANDBY';}
                if (index.match_selection_status == 'INACTIVE') {status = 'INACTIVE';}

                list += (
                `<div class="list_item ${status}" onclick="setAmiiboForSearch('${amiibots_id}', '${index.id}', '${ruleset_id}');">
                    <p class="stats">
                        <i>Amiibo Name:</i>  <b class="${status}">${index.name}</b> </br>
                        <i>Amiibo ID:</i>       ${index.id} </br>
                        <i>Rating:</i>          ${index.rating} </br>
                        <i>Total Matches:</i>   ${index.total_matches} </br>
                        <i>Status:</i>          ${index.match_selection_status}</br>
                        </br>
                    </p>
                </div>`
                );
            }
    });
    list += "</div>";
    content.innerHTML = list;

    document.getElementById('amiibo_id_found').innerText = (`Search complete!`);
    document.getElementById('amiibo_count').innerText = (`Amiibo found (${ruleset_id}): ${amiibo_count}`);
}





//                                                              SEARCH BAR MEMORY AND FUNCTIONALITY
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
function searchParameters() {
    //Get text field information
    const twitch_name = document.querySelector('#twitch_name').value;
    console.log('Twitch Name is: ' + twitch_name);

    const amiibo_name = document.querySelector('#amiibo_name').value;
    console.log('Amiibo Name is: ' + amiibo_name);

    const ruleset = document.querySelector('#ruleset').value;
    console.log('Ruleset is: ' + ruleset);

    //Put it into local storage
    window.localStorage.setItem("Twitch Name", twitch_name);
    window.localStorage.setItem("Amiibo Name", amiibo_name);
    window.localStorage.setItem("Ruleset", ruleset);
};





//                                                              CLICK ON LISTED AMIIBO AND GRAPH IT
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
function setAmiiboForSearch(twitch_name, amiibo_id, ruleset) {
    // Put information into local storage
    window.localStorage.setItem("Twitch Name", twitch_name);
    window.localStorage.setItem("Amiibo Name", amiibo_id);
    window.localStorage.setItem("Ruleset", ruleset);

    // Redirect to main page
    window.location.href = 'index.html';
}





//                                                              RE-RENDER CHART.JS CHARTS
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
function drawCharts(sorted) {
    document.getElementById('rating_history_chart_canvas').remove();
    document.getElementById('rating_history').innerHTML = '<canvas id="rating_history_chart_canvas"></canvas>';

    document.getElementById('amiibo_lost_to_chart_canvas').remove();
    document.getElementById('amiibo_lost_to').innerHTML = '<canvas id="amiibo_lost_to_chart_canvas"></canvas>';   

    RatingHistoryChart();
    characterMatchupChart(sorted);
}





//                                                              FUNCTION TO SET LOCAL STORAGE ITEMS
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
function setRuleset(whereToGetResult) {
    if (whereToGetResult == 'tierlist') {
        window.localStorage.setItem("Tierlist Ruleset", document.getElementById('tier_list_ruleset').value);
        console.log(`Ruleset set to ${document.getElementById('tier_list_ruleset').value}`)
    }
    window.location.reload();
}





//                                                              ALL TIERLIST FUNCTIONALITY
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
async function generateTierList(match_count) {

    let tier_list_ruleset_input = window.localStorage.getItem("Tierlist Ruleset");
    let tier_list_ruleset_select = window.localStorage.getItem(tier_list_ruleset_input);
    let tier_list_ruleset_id = `&ruleset_id=${tier_list_ruleset_select}`;

    document.querySelector('#tier_list_ruleset').placeholder = (`Current ruleset is: ${tier_list_ruleset_input}`);
    document.getElementById('tierlistTitle').innerHTML = `Amiibots Realtime Tierlist (${tier_list_ruleset_input})`;


    // Get all character ids
    // Get all character names
    let all_character_names = [];
    let all_character_id = [];
    const all_characters_query = await fetch('https://www.amiibots.com/api/utility/get_all_characters');
    const all_characters_response = await all_characters_query.json();

    const all_characters_data = all_characters_response.data.map(
        function(index) {
            all_character_names.push(index.name);
            all_character_id.push(index.id);
    });

    // Get all amiibo ratings
    // Get all amiibo corresponding char ids
    let leaderboard_rating = [];
    let leaderboard_char_id = [];
    match_count = `&per_page=${match_count}`;
    const tier_list_url = 'https://www.amiibots.com/api/amiibo?' + match_count + tier_list_ruleset_id + matchmaking_status;
    const tier_list_query = await fetch(tier_list_url);
    const tier_list_response = await tier_list_query.json();

    const tier_list_data = tier_list_response.data.map(
        function(index) {
            leaderboard_rating.push(index.rating);
            leaderboard_char_id.push(index.playable_character_id);
    });

    // For each character get top 10 ratings of the same character
    let tier_list_character_name = [];
    let tier_list_average_rating = [];
    let tier_list_character_id = [];
    for (let i = 0; i < all_character_id.length; i++) {
        let temp = [];
        let sum = 0;
        for (let x = 0; x < leaderboard_char_id.length; x++) {
            if ((all_character_id[i] == leaderboard_char_id[x]) && (temp.length <= 24)) {
                temp.push(leaderboard_rating[x]);
            }
        }

        // console.log(temp);


        if (temp.length != 0) {
            tier_list_character_name.push(all_character_names[i]);
            tier_list_character_id.push(all_character_id[i]);

            // Calculate the average rating
            temp.forEach(function(num) {sum += num});
            // Push character name and rating into an array
            tier_list_average_rating.push(sum / temp.length);
        }
    }

    // Sort array from highest to lowest
    // Combine arrays
    let combineSort = [];
    for (let i = 0; i < tier_list_average_rating.length; i++) {
        combineSort.push({'name': tier_list_character_name[i], 'rating': tier_list_average_rating[i], 'id': tier_list_character_id[i]});
    }

    // Sort arrays
    combineSort.sort(function(a, b) {
        return ((a.rating > b.rating) ? -1 : ((a.rating == b.rating)) ? 0 : 1);
    });

    // Seperate arrays
    for (let i = 0; i < combineSort.length; i++) {
        tier_list_character_name[i] = combineSort[i].name;
        tier_list_average_rating[i] = combineSort[i].rating;
        tier_list_character_id[i] = combineSort[i].id;
    }


    // Calculate the average rating
    let sum = 0;
    tier_list_average_rating.forEach(function(num) {sum += num});
    // Push character name and rating into an array
    let global_average_rating = (sum / tier_list_average_rating.length).toFixed(5);

    document.getElementById('global_average_rating').innerHTML = `Global Average Rating: (${global_average_rating})`;

    // Create tier cut offs
    let max_average_rating = Math.max.apply(null, tier_list_average_rating);
    let min_average_rating = Math.min.apply(null, tier_list_average_rating);
    let range = max_average_rating - min_average_rating;

    // U TIER
    let U_bound = (range * 0.85) + min_average_rating;
    console.log("U TIER: " + U_bound);

    // S TIER
    let S_bound = (range * 0.69) + min_average_rating;
    console.log("S TIER: " + S_bound);

    // A+ TIER
    let A_bound = (range * 0.59) + min_average_rating;
    console.log("A+ TIER: " + A_bound);

    // A TIER
    let a_bound = (range * 0.50) + min_average_rating;
    console.log("A TIER: " + a_bound);

    // B+ TIER
    let B_bound = (range * 0.40) + min_average_rating;
    console.log("B+ TIER: " + B_bound);

    // B TIER
    let b_bound = (range * 0.30) + min_average_rating;
    console.log("B TIER: " + b_bound);

    // C+ TIER
    let C_bound = (range * 0.20) + min_average_rating;
    console.log("C+ TIER: " + C_bound);

    // C TIER
    let c_bound = (range * 0.10) + min_average_rating;
    console.log("C TIER: " + c_bound);

    // D+ TIER
    let D_bound = (range * 0.02) + min_average_rating;
    console.log("D+ TIER: " + D_bound);


    // print array onto tier list
    let content = document.getElementById('U_TIER');
    let list = '<div class="tier_list_container" style="gap: 0px;">';
    for (let i = 0; i < tier_list_average_rating.length; i++) {
        if (tier_list_average_rating[i] >= U_bound) {
            list += 
                (
                `<div class="tier_list_item" onclick="clickTierlistItem('${tier_list_character_id[i]}', '${tier_list_ruleset_select}')">
                    <img src="images/${tier_list_character_name[i]}.png" class="tier_list_image">
                    <div class="tier_list_text_box">
                        <p class="tier_list_text">${tier_list_average_rating[i].toFixed(2)}</p>
                    </div>
                </div>`
                );
        }
    }
    list += "</div>";
    content.innerHTML = list;


    content = document.getElementById('S_TIER');
    list = '<div class="tier_list_container" style="gap: 0px;">';
    for (let i = 0; i < tier_list_average_rating.length; i++) {
        if ((tier_list_average_rating[i] < U_bound) && (tier_list_average_rating[i] >= S_bound)) {
            list += 
                (
                `<div class="tier_list_item" onclick="clickTierlistItem('${tier_list_character_id[i]}', '${tier_list_ruleset_select}')">
                    <img src="images/${tier_list_character_name[i]}.png" class="tier_list_image">
                    <div class="tier_list_text_box">
                        <p class="tier_list_text">${tier_list_average_rating[i].toFixed(2)}</p>
                    </div>
                </div>`
                );
        }
    }
    list += "</div>";
    content.innerHTML = list;
   
    
    content = document.getElementById('A+_TIER');
    list = '<div class="tier_list_container" style="gap: 0px;">';
    for (let i = 0; i < tier_list_average_rating.length; i++) {
        if ((tier_list_average_rating[i] < S_bound) && (tier_list_average_rating[i] >= A_bound)) {
            list += 
                (
                `<div class="tier_list_item" onclick="clickTierlistItem('${tier_list_character_id[i]}', '${tier_list_ruleset_select}')">
                    <img src="images/${tier_list_character_name[i]}.png" class="tier_list_image">
                    <div class="tier_list_text_box">
                        <p class="tier_list_text">${tier_list_average_rating[i].toFixed(2)}</p>
                    </div>
                </div>`
                );
        }
    }
    list += "</div>";
    content.innerHTML = list;


    content = document.getElementById('A_TIER');
    list = '<div class="tier_list_container" style="gap: 0px;">';
    for (let i = 0; i < tier_list_average_rating.length; i++) {
        if ((tier_list_average_rating[i] < A_bound) && (tier_list_average_rating[i] >= a_bound)) {
            list += 
                (
                `<div class="tier_list_item" onclick="clickTierlistItem('${tier_list_character_id[i]}', '${tier_list_ruleset_select}')">
                    <img src="images/${tier_list_character_name[i]}.png" class="tier_list_image">
                    <div class="tier_list_text_box">
                        <p class="tier_list_text">${tier_list_average_rating[i].toFixed(2)}</p>
                    </div>
                </div>`
                );
        }
    }
    list += "</div>";
    content.innerHTML = list;


    content = document.getElementById('B+_TIER');
    list = '<div class="tier_list_container" style="gap: 0px;">';
    for (let i = 0; i < tier_list_average_rating.length; i++) {
        if ((tier_list_average_rating[i] < a_bound) && (tier_list_average_rating[i] >= B_bound)) {
            list += 
                (
                `<div class="tier_list_item" onclick="clickTierlistItem('${tier_list_character_id[i]}', '${tier_list_ruleset_select}')">
                    <img src="images/${tier_list_character_name[i]}.png" class="tier_list_image">
                    <div class="tier_list_text_box">
                        <p class="tier_list_text">${tier_list_average_rating[i].toFixed(2)}</p>
                    </div>
                </div>`
                );
        }
    }
    list += "</div>";
    content.innerHTML = list;


    content = document.getElementById('B_TIER');
    list = '<div class="tier_list_container" style="gap: 0px;">';
    for (let i = 0; i < tier_list_average_rating.length; i++) {
        if ((tier_list_average_rating[i] < B_bound) && (tier_list_average_rating[i] >= b_bound)) {
            list += 
                (
                `<div class="tier_list_item" onclick="clickTierlistItem('${tier_list_character_id[i]}', '${tier_list_ruleset_select}')">
                    <img src="images/${tier_list_character_name[i]}.png" class="tier_list_image">
                    <div class="tier_list_text_box">
                        <p class="tier_list_text">${tier_list_average_rating[i].toFixed(2)}</p>
                    </div>
                </div>`
                );
        }
    }
    list += "</div>";
    content.innerHTML = list;


    content = document.getElementById('C+_TIER');
    list = '<div class="tier_list_container" style="gap: 0px;">';
    for (let i = 0; i < tier_list_average_rating.length; i++) {
        if ((tier_list_average_rating[i] < b_bound) && (tier_list_average_rating[i] >= C_bound)) {
            list += 
                (
                `<div class="tier_list_item" onclick="clickTierlistItem('${tier_list_character_id[i]}', '${tier_list_ruleset_select}')">
                    <img src="images/${tier_list_character_name[i]}.png" class="tier_list_image">
                    <div class="tier_list_text_box">
                        <p class="tier_list_text">${tier_list_average_rating[i].toFixed(2)}</p>
                    </div>
                </div>`
                );
        }
    }
    list += "</div>";
    content.innerHTML = list;


    content = document.getElementById('C_TIER');
    list = '<div class="tier_list_container" style="gap: 0px;">';
    for (let i = 0; i < tier_list_average_rating.length; i++) {
        if ((tier_list_average_rating[i] < C_bound) && (tier_list_average_rating[i] >= c_bound)) {
            list += 
                (
                `<div class="tier_list_item" onclick="clickTierlistItem('${tier_list_character_id[i]}', '${tier_list_ruleset_select}')">
                    <img src="images/${tier_list_character_name[i]}.png" class="tier_list_image">
                    <div class="tier_list_text_box">
                        <p class="tier_list_text">${tier_list_average_rating[i].toFixed(2)}</p>
                    </div>
                </div>`
                );
        }
    }
    list += "</div>";
    content.innerHTML = list;


    content = document.getElementById('D+_TIER');
    list = '<div class="tier_list_container" style="gap: 0px;">';
    for (let i = 0; i < tier_list_average_rating.length; i++) {
        if ((tier_list_average_rating[i] < c_bound)) {
            list += 
                (
                `<div class="tier_list_item" onclick="clickTierlistItem('${tier_list_character_id[i]}', '${tier_list_ruleset_select}')">
                    <img src="images/${tier_list_character_name[i]}.png" class="tier_list_image">
                    <div class="tier_list_text_box">
                        <p class="tier_list_text">${tier_list_average_rating[i].toFixed(2)}</p>
                    </div>
                </div>`
                );
        }
    }
    list += "</div>";
    content.innerHTML = list;

} // END OF generateTierList();





//                                                              CLICKABLE TIER LIST ICONS
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
async function clickTierlistItem(id, ruleset_id) {
    window.open(`https://www.amiibots.com/leaderboard?characterId=${id}&rulesetId=${ruleset_id}`);
};