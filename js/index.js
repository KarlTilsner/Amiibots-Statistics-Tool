//                                                              STARTER FUNCTION
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
window.onload = function() {
    queryLength('singles_matches', 'fetchData');
};





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
let all_character_names = [];
let all_character_id = [];

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
let primary_background_colour =     'rgba(255, 99, 132, 0.2)';      // red
let primary_border_colour =         'rgba(255, 99, 132, 1)';        // red
let secondary_background_colour =   'rgba(170, 200, 100, 0.2)';     // green
let secondary_border_colour =       'rgba(170, 200, 100, 1)';       // green

// Tier List
const tiers = ['U TIER', 'S TIER', 'A+ TIER', 'A TIER', 'B+ TIER', 'B TIER', 'C+ TIER', 'C TIER', 'D+ TIER'];
const tier_list = [ 'U TIER', 'Incineroar', 
                    'S TIER', 'Kazuya', 'Min Min', 'King K. Rool', 'Terry', 'Bowser', 'Byleth', 
                    'A+ TIER', 'Mii Gunner', 'King Dedede', 'Ridley', 'Ness', 'Link', 
                    'A TIER', 'Olimar', 'Lucas', 'Hero', 'Ganondorf', 'Zelda', 'Piranha Plant', 'Snake', 'Mii Brawler', 'Captain Falcon', 'Mii Swordfighter', 'Donkey Kong', 'Pit', 'Dark Pit', 'Banjo & Kazooie', 
                    'B+ TIER', 'Sephiroth', 'Steve', 'Kirby', 'Dr. Mario', 'Ike', 'Pokemon Trainer', 'Shulk', 'Chrom', 'Little Mac', 'Cloud', 'Yoshi', 'Roy', 'Ryu', 
                    'B TIER', 'Luigi', 'Robin', 'Mega Man', 'Corrin', 'Isabelle', 'Meta Knight', 'Wolf', 'Lucina', 'Joker', 'Pac-Man', 'Palutena', 'Falco', 'Wario', 'Samus', 'Dark Samus', 'Bowser Jr.', 
                    'C+ TIER', 'Villager', 'Mewtwo', 'Ice Climbers', 'Marth', 'Duck Hunt', 'Lucario', 'Mario', 'Pikachu', 'Wii Fit Trainer', 'Greninja', 'Sonic', 'Simon', 'Richter', 'Rosalina & Luma', 
                    'C TIER', 'Peach', 'Daisy', 'Diddy Kong', 'Toon Link', 'R.O.B.', 'Young Link', 'Inkling', 'Pichu', 'Mr. Game & Watch', 'Ken', 
                    'D+ TIER', 'Jigglypuff', 'Sheik', 'Fox', 'Zero Suit Samus', 'Bayonetta'
                ];





//                                                              AUTO SEARCH HOW MANY MATCHES NEED TO BE QUERIED
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
async function queryLength(apiURL, data_outlet) {

let queryURL = `https://www.amiibots.com/api/${apiURL}?per_page=1`;
let match_count = 0;
let queryURL_leaderboard = 'https://www.amiibots.com/api/amiibo?per_page=1'
let leaderbaord_count = 0;

    // fetchData specific
    if (apiURL === 'singles_matches' && data_outlet === 'fetchData') {
        queryURL += created_at_start + user_id + ruleset_id;

        fetch(queryURL_leaderboard)
        .then(function(queryURL_response) {return queryURL_response.json();})
        .then(function(data) {
            leaderbaord_count = data.total;
            console.log(`Found ${leaderbaord_count} leaderboard matches!`); 
        });

        fetch(queryURL)
        .then(function(queryURL_response) {return queryURL_response.json();})
        .then(function(data) {
            match_count = data.total;
            console.log(`Found ${match_count} "${apiURL}" matches!`);
            if (data_outlet === 'fetchData') {fetchData(match_count, leaderbaord_count);}
        });
    } 
}





//                                                              FUNCTION WAY TOO BIG FOR ITS OWN GOOD
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
async function fetchData(match_count, leaderbaord_count) {

console.log(leaderbaord_count);
if (leaderbaord_count == 0) {
    window.location.reload();
}

// Query URL
const matches = match_count;
match_count = `&per_page=${match_count}`;

const url_matches = 'https://www.amiibots.com/api/singles_matches?' + match_count + user_id + ruleset_id + created_at_start; 
const url_get_all_characters = 'https://www.amiibots.com/api/utility/get_all_characters';

// Change placeholder text to show what is being searched
document.querySelector('#twitch_name').placeholder = ("Current Trainer ID is: " + window.localStorage.getItem("Twitch Name"));
document.querySelector('#amiibo_name').placeholder = ("Current Amiibo ID is: " + window.localStorage.getItem("Amiibo Name"));
// document.querySelector('#ruleset').placeholder = ("Current Ruleset is: " + window.localStorage.getItem("Ruleset"));

// Highlight buttons
let highlightRulesetButton = window.localStorage.getItem('Ruleset');
document.getElementById(`ruleset_${highlightRulesetButton}`).setAttribute("style", `background-color: rgba(220, 220, 220, 0.3)`);

window.localStorage.setItem('SortType', 'sort_by_tierlist');
let sort_type = window.localStorage.getItem('SortType');
document.getElementById(`${sort_type}`).setAttribute("style", `background-color: rgba(220, 220, 220, 0.3)`);

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

    // Display amiibo name on graphs
    document.getElementById('rating_history_chart_title').innerHTML = (`Rating History of: ${amiibo_name}`);
    document.getElementById('matchup_chart_title').innerHTML = (`Character Matchups of: ${amiibo_name}`);
    document.getElementById('extended_match_history').innerHTML = (`Match History of: ${amiibo_name}`);

    console.log(`${amiibo_name} has played ${rating.length} out of ${matches} matches searched`);


// Get all character ids
// Get all character names
all_character_names = [];
all_character_id = [];
const all_characters_query = await fetch('https://www.amiibots.com/api/utility/get_all_characters');
const all_characters_response = await all_characters_query.json();

const all_characters_data = all_characters_response.data.map(
    function(index) {
        all_character_names.push(index.name);
        all_character_id.push(index.id);
});


// List all matches onto page
let content = document.getElementById('amiibo_list');
let list = '<div class="flex_list_container">';
let characterIcon = 'no icon';
const extendedMatchHistory = datapoints.data.map(
    function(index) {
        if (index.winner_info.id === amiibo_id) {
            // Match current character with icon
            characterIcon = 'reset';
            for (let i = 0; i < all_character_id.length; i++) {
                if (all_character_id[i] == index.loser_info.character_id) {
                    characterIcon = (`${all_character_names[i]}.png`)
                }
            }
            
            // Put image onto the listed item when amiibots is fixed
            list += (
            `<div class="list_item_short wonMatch" id="list_item_searchable">
                <img src="images/${characterIcon}" class="list_image">
                <p class="list_stats">
                    <i>Trainer Name:</i>        <b>${index.loser_info.trainer_name}</b> </br>
                    <i>Amiibo Name:</i>         <b>${index.loser_info.name}</b> </br>
                    <i>Opponent Rating:</i>     ${(index.loser_info.rating).toFixed(3)} </br>
                    <i>Your Rating Change</i>   ${(index.winner_info.rating_change).toFixed(3)} </br>
                    </br>
                </p>
            </div>`
            );
        } 
        else if (index.loser_info.id === amiibo_id) {

            // Match current character with icon
            characterIcon = 'reset';
            for (let i = 0; i < all_character_id.length; i++) {
                if (all_character_id[i] == index.winner_info.character_id) {
                    characterIcon = (`${all_character_names[i]}.png`)
                }
            }
            
            // Put image onto the listed item when amiibots is fixed
            list += (
            `<div class="list_item_short lostMatch" id="list_item_searchable">
                <img src="images/${characterIcon}" class="list_image">
                <p class="list_stats">
                    <i>Trainer Name:</i>        <b>${index.winner_info.trainer_name}</b> </br>
                    <i>Amiibo Name:</i>         <b>${index.winner_info.name}</b> </br>
                    <i>Opponent Rating:</i>     ${(index.winner_info.rating).toFixed(3)} </br>
                    <i>Your Rating Change</i>   ${(index.loser_info.rating_change).toFixed(3)} </br>
                    </br>
                </p>
            </div>`
            );
        }    
    });
list += "</div>";
content.innerHTML = list;





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
    tier_list[36] = character_name[58]; // THIS IS THE FILTHIEST PIECE OF CODE I HAVE EVER WRITTEN IN DATA ENGINEERING I WANT A FIX TO THIS TRASH ASAP
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

    // Win rate calculator
    for (let i = 0; i < character_name_count.length; i++) { 
        if (character_defeated_id_count[i] == 0 && character_lost_to_id_count[i] == 0) {
            character_win_rate.push(character_name_count[i]);
        } else character_win_rate.push(`${character_name_count[i]} (${(((character_defeated_id_count[i])/(character_lost_to_id_count[i] + character_defeated_id_count[i]))*100).toFixed(2)}%)`);
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
    




//                                                              GETTING LEADERBOARD DATA
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
// Get leaderboard data
console.log('Querying leaderboard data');
const playable_character_id = `&playable_character_id=${my_character_id}`; //1874d724-bd91-43ab-91ae-a8b4a740b951
match_count = `&per_page=${leaderbaord_count}`;
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

// Update quick statistcs
document.getElementById('amiibo_rating').innerText = (`Rating: ${(rating_reversed[rating_reversed.length - 1]).toFixed(5)}`);
document.getElementById('amiibo_rating_max').innerText = (`Highest Rating: ${(Math.max.apply(null, rating_reversed).toFixed(5))}`);
document.getElementById('amiibo_rating_mu').innerText = (`Rating mu: ${(rating_mu[rating_mu.length - rating_mu.length + 1].toFixed(5))}`);
document.getElementById('amiibo_rating_sigma').innerText = (`Rating Sigma: ${(rating_sigma[rating_sigma.length - rating_sigma.length + 1]).toFixed(5)}`);

document.getElementById('amiibo_rank_overall').innerText = (`Rank (Overall): ${rank_overall} / ${leaderboard_amiibo_id.length}`);
document.getElementById('amiibo_rank_character').innerText = (`Rank (${my_character_name}): ${rank_character} / ${leaderboard_same_character_id.length}`);
document.getElementById('amiibo_next_rank_overall').innerText = (`Next Rank (Overall): ${next_rank_overall}`);
document.getElementById('amiibo_next_rank_character').innerText = (`Next Rank (${my_character_name}): ${next_rank_character}`);

console.log('Data Fetched!');
} // END OF fetchData();





//                                                              HIGHLIGHT SORT BUTTON
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
function highlightSortButton(button_id) {
    let sort_type = window.localStorage.getItem('SortType');
    document.getElementById(`${sort_type}`).removeAttribute("style", `background-color: rgba(220, 220, 220 , 0.3)`);

    document.getElementById(`${button_id}`).setAttribute("style", `background-color: rgba(220, 220, 220 , 0.3)`);
    window.localStorage.setItem('SortType', `${button_id}`);
}





//                                                              HIGHLIGHT RULESET BUTTON
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
function highlightRulesetButton(button_id) {
    try {    
        let highlightRulesetButton = window.localStorage.getItem('Ruleset');
        document.getElementById(`ruleset_${highlightRulesetButton}`).removeAttribute("style", `background-color: rgba(220, 220, 220, 0.3)`);

        document.getElementById(`ruleset_${button_id}`).setAttribute("style", `background-color: rgba(220, 220, 220 , 0.3)`);
        window.localStorage.setItem('Ruleset', `${button_id}`);
        console.log('Ruleset is: ' + button_id);
    } catch (err) {
        document.getElementById(`ruleset_${button_id}`).setAttribute("style", `background-color: rgba(220, 220, 220 , 0.3)`);
        window.localStorage.setItem('Ruleset', `${button_id}`);
        console.log('Ruleset is: ' + button_id);
    }
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





//                                                              SEARCH BAR MEMORY AND FUNCTIONALITY
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
function searchParameters() {
    //Get text field information
    const twitch_name = document.querySelector('#twitch_name').value;
    console.log('Twitch Name is: ' + twitch_name);

    const amiibo_name = document.querySelector('#amiibo_name').value;
    console.log('Amiibo Name is: ' + amiibo_name);

    // const ruleset = document.querySelector('#ruleset').value;
    // console.log('Ruleset is: ' + ruleset);

    //Put it into local storage
    window.localStorage.setItem("Twitch Name", twitch_name);
    window.localStorage.setItem("Amiibo Name", amiibo_name);
    // window.localStorage.setItem("Ruleset", ruleset);
};





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