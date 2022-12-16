//                                                              GLOBAL PARAMETERS
//---------------------------------------------------------------------------------------------------------------------------------------------------------  
//Gathered data
const amiibo_name = [];
const rating_change = [];
const rating_reversed = [0];
const rating = [];
const character_name = [];
const rating_mu = [];
const rating_sigma = [];

//Amiibo lost to / defeated
const amiibo_lost_to_id = [];
const amiibo_defeated_id = [];

const character_id = [];
const character_defeated_id = [];

const character_id_count = [];
const character_defeated_id_count = [];

const character_name_count = [];

const character_win_rate = [];

//Chart axis data
const yAxis = rating_reversed;      
const xAxis = [];

//                                                              FETCH DATA
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
async function fetchData() {
//Test Searches
    //User id
        // notkarl_         5cd165e0-7360-44da-a691-36afbd644d8d
        // nozzly           4539dd7d-7207-426c-889b-f519b44e753d
        // gemsbane         c4b03d82-1d1d-4a8b-88fa-e72a4bc06052
        // jozz             0369ba61-e623-47e6-b13d-a13d6dcb8dd9

    //vanilla
        // U DED            4b7bf68b-5b9a-48ba-a0cc-10a941ddb146
        // Herobrine        45a76dde-f016-44e8-a6f8-433108cc96ea
        // Herobrine 2      65173c73-e265-4608-84a9-f7cdb99194a4
        // NachoMan         8b165b39-f13f-4ae0-b434-350767cba758
        // NoAnalHere       fd49d206-d214-42f0-9a35-98288928919a
        // ChonkTerry(ben)  26680dc4-8cbd-4de5-ab92-f6e018f63f73
        // Smol Terry(ben)  cb33e248-569b-428e-9e34-d065d18748c6

    //b5b
        // Salad Combo      19d9a16c-af54-4396-bc9c-e67c572d8000
        // hero (nozzly)    13511eda-deef-4d5c-81a9-719300d4dee6
        //

    //ag
        // Hellcat          695545f5-a0a3-4332-98fb-c197829db5e7
        // TheGreat         54cb15e9-5613-41d9-86d5-2e2eea8a809a
        //   

//Search parameters 
const number_of_matches = 5000;
const Amiibots_id = window.localStorage.getItem("Twitch Name");
const amiibo_id = window.localStorage.getItem("Amiibo Name");
            
//Ruleset Selector
window.localStorage.setItem("vanilla", '44748ebb-e2f3-4157-90ec-029e26087ad0');
window.localStorage.setItem("b5b", '328d8932-456f-4219-9fa4-c4bafdb55776');
window.localStorage.setItem("ag", 'af1df0cd-3251-4b44-ba04-d48de5b73f8b');
const ruleset_input = window.localStorage.getItem("Ruleset");
const ruleset_select = window.localStorage.getItem(ruleset_input);

//Query URL
const per_page = `&per_page=${number_of_matches}`;
const user_id = `&user_id=${Amiibots_id}`;
const ruleset_id = `&ruleset_id=${ruleset_select}`;
const created_at_start = '&created_at_start=2018-11-10T00%3A00%3A00Z';

const url_matches = 'https://www.amiibots.com/api/singles_matches?' + per_page + user_id + ruleset_id + created_at_start; 
const url_get_all_characters = 'https://www.amiibots.com/api/utility/get_all_characters';

//Change placeholder text to show what is being searched
document.querySelector('#twitch_name').placeholder = ("Current Trainer ID is: " + window.localStorage.getItem("Twitch Name"));
document.querySelector('#amiibo_name').placeholder = ("Current Amiibo Name is: " + window.localStorage.getItem("Amiibo Name"));
document.querySelector('#ruleset').placeholder = ("Current Ruleset is: " + window.localStorage.getItem("Ruleset"));

    // Fetch data from Amiibots API
    const singles_matches = await fetch(url_matches);
    const get_all_characters = await fetch(url_get_all_characters);

    //After response is recieved
    const datapoints = await singles_matches.json();
    const get_all_characters_json = await get_all_characters.json();

    //Filter data and push it into an array
    console.log(`This trainer has ${datapoints.data.length} out of ${number_of_matches} matches searched`);
    // console.log(get_all_characters_json);

    //Push rating changes into array
    const ratingChange = datapoints.data.map(
        function(index) {
            if (index.winner_info.id === amiibo_id) {
                rating_change.push(index.winner_info.rating_change);
                rating_mu.push(index.winner_info.rating_mu);
                rating_sigma.push(index.winner_info.rating_sigma);
                rating.push(index.winner_info.rating);
                amiibo_name.push(index.winner_info.name);
                amiibo_defeated_id.push(index.loser_info.character_id);
                return(index.winner_info.rating_change);
            } 
            else if (index.loser_info.id === amiibo_id) {
                rating_change.push(index.loser_info.rating_change);
                rating_mu.push(index.loser_info.rating_mu);
                rating_sigma.push(index.loser_info.rating_sigma);
                rating.push(index.loser_info.rating);
                amiibo_name.push(index.loser_info.name);
                amiibo_lost_to_id.push(index.winner_info.character_id);
                return(index.loser_info.rating_change);
            }    
            else return (0);     
        })
        
        // console.log(rating_mu);
        // console.log(rating_sigma);
        // console.log(rating);
        console.log("Rating change pushed into array!");
        console.log("Amiibo name retrieved!");
        // console.log(amiibo_defeated_id);
        // console.log(amiibo_lost_to_id);
        console.log(`${amiibo_name[0]} has played ${rating.length} out of ${number_of_matches} matches searched`);

        //Generate data for X and Y axis for characters that won
        const pushCharacterData = get_all_characters_json.data.map(
            function(index) {
                character_name.push(index.name);
                character_id.push(index.id);
            })

            // console.log(get_all_characters_json);
            // console.log(character_name);
            // console.log(character_id);
    
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

    //Console Logs
        // console.log(character_id_count);
        // console.log(datapoints);
        // console.log(ratingChange);
        // console.log(rating);
        // console.log(amiibo_lost_to);
        console.log("Data fetched!");

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

    // Win rate calculator
    for (let i = 0; i < character_name_count.length; i++) {
        character_win_rate.push(
            `${character_name_count[i]} (${(((character_defeated_id_count[i])/(character_id_count[i] + character_defeated_id_count[i]))*100).toFixed(2)}%)`);
    }
    // console.log(character_win_rate);
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
