//                                                              GLOBAL PARAMETERS
//---------------------------------------------------------------------------------------------------------------------------------------------------------  
// Gathered data
const amiibo_name = [];
const rating_change = [];
const rating_reversed = [0];
const rating = [];
const character_name = [];
const rating_mu = [];
const rating_sigma = [];
let my_character_id = 'null';
let my_character_name = 'null';

// Leaderboard
const leaderboard_character_id = [];
const leaderboard_amiibo_id = [];
const leaderbaord_same_character_id = [];
const leaderboard_rating_overall = [];
const leaderbaord_rating_character = [];
let rank_overall = 0;
let rank_character = 0;
let next_rank_overall = 0;
let next_rank_character = 0;

// Amiibo lost to / defeated
const amiibo_lost_to_id = [];
const amiibo_defeated_id = [];

const character_id = [];
const character_defeated_id = [];

const character_id_count = [];
const character_defeated_id_count = [];

const character_name_count = [];

const character_win_rate = [];

// Chart axis data
const yAxis = rating_reversed;      
const xAxis = [];

//                                                              FETCH DATA
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
async function fetchData() {
// Test Searches
    // User id
        // notkarl_         5cd165e0-7360-44da-a691-36afbd644d8d
        // nozzly           4539dd7d-7207-426c-889b-f519b44e753d
        // gemsbane         c4b03d82-1d1d-4a8b-88fa-e72a4bc06052
        // jozz             0369ba61-e623-47e6-b13d-a13d6dcb8dd9

    // vanilla
        // U DED            4b7bf68b-5b9a-48ba-a0cc-10a941ddb146
        // Herobrine        45a76dde-f016-44e8-a6f8-433108cc96ea
        // Herobrine 2      65173c73-e265-4608-84a9-f7cdb99194a4
        // AnalTrauma       4d1798a9-6624-4b06-a21a-a7b0fc5a0808
        // NachoMan         8b165b39-f13f-4ae0-b434-350767cba758
        // NoAnalHere       fd49d206-d214-42f0-9a35-98288928919a
        // ChonkTerry(ben)  26680dc4-8cbd-4de5-ab92-f6e018f63f73
        // Smol Terry(ben)  cb33e248-569b-428e-9e34-d065d18748c6
        // O_O              df9531c4-023e-4bf2-9d56-2a946318bd0c

    // b5b
        // hero (nozzly)    13511eda-deef-4d5c-81a9-719300d4dee6
        // Astraeus□        96b00b92-3ec7-44e3-a701-7aac47dcfac4
        // SaladCombo       19d9a16c-af54-4396-bc9c-e67c572d8000

    // ag
        // Hellcat          695545f5-a0a3-4332-98fb-c197829db5e7
        // TheGreat         54cb15e9-5613-41d9-86d5-2e2eea8a809a
        // Are U OK?        9aed8e42-0d18-4342-b2b9-e374f229b2c0

// Search parameters 
const number_of_matches = 5000;
const Amiibots_id = window.localStorage.getItem("Twitch Name");
const amiibo_id = window.localStorage.getItem("Amiibo Name");
            
// Ruleset Selector
window.localStorage.setItem("vanilla", '44748ebb-e2f3-4157-90ec-029e26087ad0');
window.localStorage.setItem("b5b", '328d8932-456f-4219-9fa4-c4bafdb55776');
window.localStorage.setItem("ag", 'af1df0cd-3251-4b44-ba04-d48de5b73f8b');
const ruleset_input = window.localStorage.getItem("Ruleset");
const ruleset_select = window.localStorage.getItem(ruleset_input);

// Query URL
const per_page = `&per_page=${number_of_matches}`;
const user_id = `&user_id=${Amiibots_id}`;
const ruleset_id = `&ruleset_id=${ruleset_select}`;
const created_at_start = '&created_at_start=2018-11-10T00%3A00%3A00Z';
const matchmaking_status = '&matchmaking_status=ACTIVE,STANDBY';

const url_matches = 'https://www.amiibots.com/api/singles_matches?' + per_page + user_id + ruleset_id + created_at_start; 
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
    console.log(`This trainer has ${datapoints.data.length} out of ${number_of_matches} matches searched`);
    // console.log(get_all_characters_json);

    // Push rating changes into array
    console.log('Pusing data into arrays');
    const ratingChange = datapoints.data.map(
        function(index) {
            if (index.winner_info.id === amiibo_id) {
                rating_change.push(index.winner_info.rating_change);
                rating_mu.push(index.winner_info.rating_mu);
                rating_sigma.push(index.winner_info.rating_sigma);
                rating.push(index.winner_info.rating);
                amiibo_name.push(index.winner_info.name);
                amiibo_defeated_id.push(index.loser_info.character_id);
                my_character_id = index.winner_info.character_id;
                return(index.winner_info.rating_change);
            } 
            else if (index.loser_info.id === amiibo_id) {
                rating_change.push(index.loser_info.rating_change);
                rating_mu.push(index.loser_info.rating_mu);
                rating_sigma.push(index.loser_info.rating_sigma);
                rating.push(index.loser_info.rating);
                amiibo_name.push(index.loser_info.name);
                amiibo_lost_to_id.push(index.winner_info.character_id);
                my_character_id = index.loser_info.character_id;
                return(index.loser_info.rating_change);
            }    
            else return (0);     
        })

        console.log('Data successfully pushed into arrays');

        // console.log(rating_mu);
        // console.log(rating_sigma);
        // console.log(rating);
        // console.log("Rating change pushed into array!");
        // console.log("Amiibo name retrieved!");
        // console.log(amiibo_defeated_id);
        // console.log(amiibo_lost_to_id);
        console.log(`${amiibo_name[0]} has played ${rating.length} out of ${number_of_matches} matches searched`);

    // Generate data for X and Y axis for characters that won
    const pushCharacterData = get_all_characters_json.data.map(
        function(index) {
            character_name.push(index.name);
            character_id.push(index.id);

            if (index.id === my_character_id) {
                my_character_name = index.name;
            }
        });

        // console.log(my_character_name);
        // console.log(get_all_characters_json);
        // console.log(character_name);
        // console.log(character_id);

    console.log('Calculating amiibo defeated and lost to');
    
    // Amiibo defeated and lost to data
    for (let c_id = 0; c_id < character_id.length; c_id++) {
        let id_counter = 0;
        let defeated_id_counter = 0;
        for (let a_lt = 0; a_lt < amiibo_lost_to_id.length; a_lt++) {
            if (character_id[c_id] == amiibo_lost_to_id[a_lt]) {
                id_counter++;
                // console.log(id_counter);
            }
        }
        for (let d_id = 0; d_id < amiibo_defeated_id.length; d_id++) {
            if (character_id[c_id] == amiibo_defeated_id[d_id]) {
                defeated_id_counter++;
                // console.log(defeated_id_counter);
            }
        }

        // character_name_count.push(character_name[c_id]);
        if (id_counter > 0) {
            character_id_count.push(id_counter);
        }
        if (id_counter == 0 && defeated_id_counter > 0) {
            character_id_count.push(id_counter);
        }
        if (defeated_id_counter > 0) {
            character_defeated_id_count.push(defeated_id_counter);
        }
        if (defeated_id_counter == 0 && id_counter > 0) {
            character_defeated_id_count.push(defeated_id_counter);
        }

        if ((id_counter > 0 && defeated_id_counter > 0) || (id_counter > 0) || (defeated_id_counter > 0)) {
            character_name_count.push(character_name[c_id]);
        }
    }

    console.log('Calculated amiibo defeated and lost to');

    console.log('Querying leaderboard data');

    // Get leaderboard data
    const playable_character_id = `&playable_character_id=${my_character_id}`; //1874d724-bd91-43ab-91ae-a8b4a740b951
    const rank_url_query = 'https://www.amiibots.com/api/amiibo?' + per_page + ruleset_id + matchmaking_status;

    const amiibo_ranks_data_query = await fetch(rank_url_query);
    const amiibo_ranks_data = await amiibo_ranks_data_query.json();

    console.log('Recieved response');

    const amiibo_ranks_data_loop = amiibo_ranks_data.data.map(
        function(index) {
            leaderboard_amiibo_id.push(index.id);
            leaderboard_character_id.push(index.playable_character_id);
            leaderboard_rating_overall.push(index.rating);
    });

    console.log('Pushed data into arrays');
    
    for (let i = 0; i < leaderboard_amiibo_id.length; i++) {
        // Get leaderbaord rank overall
        if (leaderboard_amiibo_id[i] === amiibo_id) {
            rank_overall = i + 1;

            if (rank_overall != 1) {
                next_rank_overall = (leaderboard_rating_overall[i] - leaderboard_rating_overall[i + 1]).toFixed(5);
            }
        }

        // Get all same character leaderboard data
        if (leaderboard_character_id[i] === my_character_id) {
            leaderbaord_same_character_id.push(leaderboard_amiibo_id[i]);
            leaderbaord_rating_character.push(leaderboard_rating_overall[i])
        }
    }

    console.log('Calculated overall rank');
    // console.log(rank_overall)

    for (let i = 0; i < leaderbaord_same_character_id.length; i++) {
        if (leaderbaord_same_character_id[i] === amiibo_id) {
            rank_character = i + 1;

            if (rank_character != 1) {
                next_rank_character = (leaderbaord_rating_character[i] - leaderbaord_rating_character[i + 1]).toFixed(5);
            }
        }
    }

    console.log('Calculated character specific rank');
    // console.log(rank_character);

    //Console Logs
        // console.log(character_id_count);
        // console.log(datapoints);
        // console.log(amiibo_ranks_data_query);
        // console.log(ratingChange);
        // console.log(rating);
        // console.log(amiibo_lost_to);
        // console.log(leaderboard_data);

    return(ratingChange);
}

//                                                              GENERATE RATING HISTORY ARRAYS
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
async function dataGenerator() {
await fetchData();
    for (let i = rating.length - 1; i >= 0; i--) {
        rating_reversed.push(rating[i]);
    }

    for (let i = 0; i < rating_reversed.length; i++) {
        xAxis.push(i);   
    }

    console.log(`Rating: ${rating_reversed[rating_reversed.length - 1]}`);

    document.getElementById('amiibo_rating').innerText = (`Current Rating: ${(rating_reversed[rating_reversed.length - 1]).toFixed(5)}`);
    document.getElementById('amiibo_rating_max').innerText = (`Highest Rating: ${(Math.max.apply(null, rating_reversed).toFixed(5))}`);
    document.getElementById('amiibo_rating_mu').innerText = (`Current Rating mu: ${(rating_mu[rating_mu.length - rating_mu.length + 1].toFixed(5))}`);
    document.getElementById('amiibo_rating_sigma').innerText = (`Current Rating Sigma: ${(rating_sigma[rating_sigma.length - rating_sigma.length + 1]).toFixed(5)}`);

    document.getElementById('amiibo_rank_overall').innerText = (`Rank (Overall): ${rank_overall} / ${leaderboard_amiibo_id.length}`);
    document.getElementById('amiibo_rank_character').innerText = (`Rank (${my_character_name}): ${rank_character} / ${leaderbaord_same_character_id.length}`);
    document.getElementById('amiibo_next_rank_overall').innerText = (`Next Rank (Overall): ${next_rank_overall}`);
    document.getElementById('amiibo_next_rank_character').innerText = (`Next Rank (${my_character_name}): ${next_rank_character}`);

    // Win rate calculator
    for (let i = 0; i < character_name_count.length; i++) {
        character_win_rate.push(
            `${character_name_count[i]} (${(((character_defeated_id_count[i])/(character_id_count[i] + character_defeated_id_count[i]))*100).toFixed(2)}%)`);
    }
    // console.log(character_win_rate);

    console.log('Data Fetched!');
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