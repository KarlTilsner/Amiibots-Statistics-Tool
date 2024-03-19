// STARTER FUNCTION
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
window.onload = function() {
    // Set rulesets
    window.localStorage.setItem('vanilla', '44748ebb-e2f3-4157-90ec-029e26087ad0');
    window.localStorage.setItem('b5b', '328d8932-456f-4219-9fa4-c4bafdb55776');
    window.localStorage.setItem('ag', 'af1df0cd-3251-4b44-ba04-d48de5b73f8b');
    
    nameSearchToolHighlight('start');
    nameSearchTool();
};





// UPDATE THE STORED AMIIBO ID AND REDIRECT TO THE STATS TOOL
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function updateStatsSearch(new_id) {
    console.log('updated id');
    window.localStorage.setItem('saved_amiibo_id', new_id);
    window.location.href = "index.html";
}





// HIGHLIGHT NAME SEARCH TOOL RULESET BUTTONS
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
function nameSearchToolHighlight(start, button_id) {
    if (start == 'start') {
        try {
        // Highlight ruleset buttons
        let highlightRulesetButton = window.localStorage.getItem('Name Search Tool Ruleset');
        document.getElementById(`ruleset_${highlightRulesetButton}`).setAttribute("style", `background-color: rgba(220, 220, 220, 0.3)`);
        } catch (err) {
            window.localStorage.setItem('Name Search Tool Ruleset', 'vanilla');
            let highlightRulesetButton = window.localStorage.getItem('Name Search Tool Ruleset');
            document.getElementById(`ruleset_${highlightRulesetButton}`).setAttribute("style", `background-color: rgba(220, 220, 220, 0.3)`);
            console.log("Ruleset was empty");
        }
    }

    if (start != 'start') {
        try {    
            let highlightRulesetButton = window.localStorage.getItem('Name Search Tool Ruleset');
            document.getElementById(`ruleset_${highlightRulesetButton}`).removeAttribute("style", `background-color: rgba(220, 220, 220, 0.3)`);
    
            document.getElementById(`ruleset_${button_id}`).setAttribute("style", `background-color: rgba(220, 220, 220 , 0.3)`);
            window.localStorage.setItem('Name Search Tool Ruleset', `${button_id}`);
            console.log('Ruleset is: ' + button_id);
        } catch (err) {
            document.getElementById(`ruleset_${button_id}`).setAttribute("style", `background-color: rgba(220, 220, 220 , 0.3)`);
            window.localStorage.setItem('Name Search Tool Ruleset', `${button_id}`);
            console.log('Ruleset is: ' + button_id);
        }

        window.location.reload();
    }
}





// Queries all character names and IDs and pushed them into arrays
//---------------------------------------------------------------------------------------------------------------------------------------------------------
let all_characters = [];
async function get_all_characters() {
    const url = `https://www.amiibots.com/api/utility/get_all_characters`;
    const query = await fetch(url);
    const response = await query.json();
    const data = response.data.map(index => index);
    
    console.log("Got all character names and ids");
    return data;
}





// Queries all character names and IDs and pushed them into arrays
//---------------------------------------------------------------------------------------------------------------------------------------------------------
const tierlist = {};
async function getTiers() {
    // Getting ruleset
    let ruleset_input = window.localStorage.getItem("Name Search Tool Ruleset");
    let ruleset_select = window.localStorage.getItem(ruleset_input);
    let ruleset = `&ruleset_id=${ruleset_select}`;

    const url = `https://www.amiibots.com/api/tier_list/first_dataset_of_given_month?${ruleset}`;
    const query = await fetch(url);
    const response = await query.json();

    console.log(response.data.tiers);

    response.data.tiers.map(index => {
        tierlist[index.name] = [];

        index.character_placements.map(placement => {
            tierlist[index.name].push({name: placement.playable_character.character_name, id:placement.playable_character.id});
        });

        // Add tiers to dropdown
        const dropdown = document.getElementById("selectTierDropdown");
        const newOption = document.createElement("option");
        newOption.className = 'dropdownMenuOption';
        newOption.value = `${index.name}`;
        const optionTextNode = document.createTextNode(`Tier: ${index.name} (${tierlist[index.name].length})`);
        newOption.appendChild(optionTextNode);
        dropdown.appendChild(newOption);
    });

    console.log(tierlist);
}
getTiers();





// NAME SEARCH TOOL
//---------------------------------------------------------------------------------------------------------------------------------------------------------
const all_amiibo_data = [];

async function nameSearchTool() {
    // Getting ruleset
    let name_search_ruleset_input = window.localStorage.getItem("Name Search Tool Ruleset");
    let name_search_ruleset_select = window.localStorage.getItem(name_search_ruleset_input);
    let name_search_ruleset_id = `&ruleset_id=${name_search_ruleset_select}`;

    match_count = `&per_page=${await get_number_of_amiibo()}`;

    // Call this function to find the exact amount of amiibo to search for
    async function get_number_of_amiibo() {
        const number_of_amiibo_query = await fetch(`https://www.amiibots.com/api/amiibo?per_page=1${name_search_ruleset_id}`);
        const number_of_amiibo_response = await number_of_amiibo_query.json();
        console.log(`found ${number_of_amiibo_response.total} ${name_search_ruleset_input} amiibo`);
        return number_of_amiibo_response.total;
    }

    all_characters = await get_all_characters();

    // Get data from api to be displayed    
    const url = 'https://www.amiibots.com/api/amiibo?' + match_count + name_search_ruleset_id;
    const query = await fetch(url);
    const response = await query.json();
    response.data.map(
        function(index) {
            all_amiibo_data.push({
                'trainer_name': index.user.twitch_user_name,
                'amiibo_name': index.name,
                'amiibo_id': index.id,
                'character_id': index.playable_character_id,
                'rating': index.rating,
                'matches': index.total_matches,
                'overall_rank': 0,
                'character_rank': 0,
                'match_selection_status': index.match_selection_status
            });
        }
    );

    // Find overall ranks for every amiibo
    let overall_rank = 0;
    for (let i = 0; i < all_amiibo_data.length; i++) {
        if (all_amiibo_data[i].match_selection_status != 'INACTIVE') {
            overall_rank++;
            all_amiibo_data[i].overall_rank = overall_rank;
        }
    }

    // Find character ranks for every amiibo
    for (let i = 0; i < all_characters.length; i++) {
        let character_rank = 1;
        for (let x = 0; x < all_amiibo_data.length; x++) {
            if (all_characters[i].id == all_amiibo_data[x].character_id && all_amiibo_data[x].match_selection_status != 'INACTIVE') {
                all_amiibo_data[x].character_rank = character_rank;
                character_rank++;
            }
        }
    }
    
    nameSearchBar();
}





//                                                              NAME SEARCH TOOL SEARCH BAR FUNCTION
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function nameSearchBar(selectedOption) {


    let selectedTier;

    try {
        selectedTier = selectedOption.options[selectedOption.selectedIndex].value;
    } catch (error) {
        selectedTier = "All";
    }

    console.log(selectedTier);
    
    // Get keyboard input
    let input = document.getElementById('search_amiibo_name');
    let filter = input.value.toUpperCase();
    let username_input = document.getElementById('search_trainer_name');
    let username_filter = username_input.value.toUpperCase();

    let content = document.getElementById('amiibo_list');
    let list = '<div class="flex_list_container">';
    let amiibo_count = 0;
    let status = 'no status';
    let characterIcon = 'no icon';


    if (selectedTier != "All") {
        all_amiibo_data.map(index => {

            tierlist[selectedTier].map(character => {
                if (index.character_id == character.id) {

                    if (((index.amiibo_name).toUpperCase().indexOf(filter) > -1) && ((index.trainer_name).toUpperCase().indexOf(username_filter) > -1)) {
                        amiibo_count++;
                        status = 'reset';
                        characterIcon = 'reset';
        
                        if (index.match_selection_status == 'ACTIVE') {status = 'ACTIVE';}
                        if (index.match_selection_status == 'STANDBY') {status = 'STANDBY';}
                        if (index.match_selection_status == 'INACTIVE') {status = 'INACTIVE';}
        
                        // Match current character with icon
                        for (let i = 0; i < all_characters.length; i++) {
                            if (all_characters[i].id == index.character_id) {
                                characterIcon = (`${all_characters[i].name}.png`)
                            }
                        }
        
                        // Put image onto the listed item when amiibots is fixed
                        list += (
                        `<div class="list_item ${status}" id="list_item_searchable" onclick="updateStatsSearch('${index.amiibo_id}'), addAmiiboToSearchHistory('${index.trainer_name}', '${index.amiibo_name}', '${index.amiibo_id}', '${index.character_id}', '${window.localStorage.getItem(window.localStorage.getItem("Name Search Tool Ruleset"))}', '${new Date()}')">
        
                            <img src="./images/${characterIcon}" class="list_image">
        
                            <div class="list_stats_grid_container">
                                <div class="list_stats amiibo_trainer_name_title">
                                    <h2>${index.trainer_name}</h2>
                                    <h1>${index.amiibo_name}</h1>
                                </div>
                            </div>
        
                            <div class="list_stats_container">
                                <div class="list_stats">
                                    <h2>Rating:</h2>
                                    <h1>${index.rating.toFixed(2)}</h1>
                                </div>
        
                                <div class="list_stats">
                                    <h2>Matches:</h2>
                                    <h1>${index.matches}</h1>
                                </div>
        
                                <div class="list_stats">
                                    <h2>Rank (Overall):</h2>
                                    <h1>${index.overall_rank}</h1>
                                </div>
        
                                <div class="list_stats">
                                    <h2>Rank (Character):</h2>
                                    <h1>${index.character_rank}</h1>
                                </div>
        
                                <div class="list_stats mobile_remove">
                                    <h2>Status:</h2>   
                                    <h1>${index.match_selection_status}</h1>
                                </div>
        
                            </div>
        
                        </div>`
                        );
                    }

                    list += "</div>";
                    content.innerHTML = list;
            
                    document.getElementById('amiibo_count').innerText = (`Amiibo found: ${amiibo_count}`);
                }
            });
        });

    } else {
        all_amiibo_data.map(index => {
            if (((index.amiibo_name).toUpperCase().indexOf(filter) > -1) && ((index.trainer_name).toUpperCase().indexOf(username_filter) > -1)) {
                amiibo_count++;
                status = 'reset';
                characterIcon = 'reset';

                if (index.match_selection_status == 'ACTIVE') {status = 'ACTIVE';}
                if (index.match_selection_status == 'STANDBY') {status = 'STANDBY';}
                if (index.match_selection_status == 'INACTIVE') {status = 'INACTIVE';}

                // Match current character with icon
                for (let i = 0; i < all_characters.length; i++) {
                    if (all_characters[i].id == index.character_id) {
                        characterIcon = (`${all_characters[i].name}.png`)
                    }
                }

                // Put image onto the listed item when amiibots is fixed
                list += (
                `<div class="list_item ${status}" id="list_item_searchable" onclick="updateStatsSearch('${index.amiibo_id}'), addAmiiboToSearchHistory('${index.trainer_name}', '${index.amiibo_name}', '${index.amiibo_id}', '${index.character_id}', '${window.localStorage.getItem(window.localStorage.getItem("Name Search Tool Ruleset"))}', '${new Date()}')">

                    <img src="./images/${characterIcon}" class="list_image">

                    <div class="list_stats_grid_container">
                        <div class="list_stats amiibo_trainer_name_title">
                            <h2>${index.trainer_name}</h2>
                            <h1>${index.amiibo_name}</h1>
                        </div>
                    </div>

                    <div class="list_stats_container">
                        <div class="list_stats">
                            <h2>Rating:</h2>
                            <h1>${index.rating.toFixed(2)}</h1>
                        </div>

                        <div class="list_stats">
                            <h2>Matches:</h2>
                            <h1>${index.matches}</h1>
                        </div>

                        <div class="list_stats">
                            <h2>Rank (Overall):</h2>
                            <h1>${index.overall_rank}</h1>
                        </div>

                        <div class="list_stats">
                            <h2>Rank (Character):</h2>
                            <h1>${index.character_rank}</h1>
                        </div>

                        <div class="list_stats mobile_remove">
                            <h2>Status:</h2>   
                            <h1>${index.match_selection_status}</h1>
                        </div>

                    </div>

                </div>`
                );
            }
        });
        list += "</div>";
        content.innerHTML = list;

        document.getElementById('amiibo_count').innerText = (`Amiibo found: ${amiibo_count}`);
    }

}