//                                                              STARTER FUNCTION
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
window.onload = function() {
    idSearchHighlight('start');
    amiibotsIDSearch();
};





//                                                              HIGHLIGHT ID TOOL RULESET BUTTONS
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
function idSearchHighlight(start, button_id) {
    if (start == 'start') {
        try {
        // Highlight ruleset buttons
        let highlightRulesetButton = window.localStorage.getItem('ID_Tool_Ruleset');
        document.getElementById(`ruleset_${highlightRulesetButton}`).setAttribute("style", `background-color: rgba(220, 220, 220, 0.3)`);
        } catch (err) {
            window.localStorage.setItem('ID_Tool_Ruleset', 'vanilla');
            let highlightRulesetButton = window.localStorage.getItem('ID_Tool_Ruleset');
            document.getElementById(`ruleset_${highlightRulesetButton}`).setAttribute("style", `background-color: rgba(220, 220, 220, 0.3)`);
            console.log("Ruleset was empty");
        }
    }

    if (start != 'start') {
        try {    
            let highlightRulesetButton = window.localStorage.getItem('ID_Tool_Ruleset');
            document.getElementById(`ruleset_${highlightRulesetButton}`).removeAttribute("style", `background-color: rgba(220, 220, 220, 0.3)`);
    
            document.getElementById(`ruleset_${button_id}`).setAttribute("style", `background-color: rgba(220, 220, 220 , 0.3)`);
            window.localStorage.setItem('ID_Tool_Ruleset', `${button_id}`);
            console.log('Ruleset is: ' + button_id);
        } catch (err) {
            document.getElementById(`ruleset_${button_id}`).setAttribute("style", `background-color: rgba(220, 220, 220 , 0.3)`);
            window.localStorage.setItem('ID_Tool_Ruleset', `${button_id}`);
            console.log('Ruleset is: ' + button_id);
        }
    }
}





//                                                              AMIIBOTS ID SEARCH TOOL
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
async function amiibotsIDSearch() {
    let twitchName = document.querySelector('#search_amiibo_name_and_id').value;
    let stored_trainer_name = window.localStorage.getItem('trainer_name');


    if (stored_trainer_name != twitchName) {
        window.localStorage.setItem('trainer_name', 'no_trainer_name');

        // Prepare for search
        const ruleset_input = window.localStorage.getItem('ID_Tool_Ruleset');
        const ruleset_select = window.localStorage.getItem(ruleset_input);
        const ruleset_id = `&ruleset_id=${ruleset_select}`;
        match_count = `&per_page=${2500}`;

        // Search for trainer_id
        console.log('Searching 2500 matches for trainer_id');
        document.getElementById('amiibo_id_found').innerText = (`Searching 2500 matches for trainer_id...`);
        const id_url_query = 'https://www.amiibots.com/api/singles_matches?' + match_count + ruleset_id;
        const id_data_query = await fetch(id_url_query);
        const id_data_response = await id_data_query.json();
        console.log('Recieved response');

        // Push trainer_id into variable
        const id_data = id_data_response.data.map(
            function(index) {
                if (index.fp1.trainer_name === twitchName) {
                    window.localStorage.setItem('trainer_name', index.fp1.trainer_name);
                    window.localStorage.setItem('trainer_id', index.fp1.trainer_id);
                    amiibots_id = window.localStorage.getItem('trainer_id');
                } else if (index.fp2.trainer_name === twitchName) {
                    window.localStorage.setItem('trainer_name', index.fp2.trainer_name);
                    window.localStorage.setItem('trainer_id', index.fp2.trainer_id);
                    amiibots_id = window.localStorage.getItem('trainer_id');
                }
        });
    }

    // Update HTML
    document.getElementById('amiibots_id_found').innerText = window.localStorage.getItem('trainer_id');

    // Update amiibots_id
    amiibots_id = window.localStorage.getItem('trainer_id');

    // Call the listing tool
    amiiboListingTool();
}





//                                                              AMIIBO LISTING TOOL
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
async function amiiboListingTool() {
    const submitted_amiibots_name = document.querySelector('#search_amiibo_name_and_id').value;
    ruleset_id = window.localStorage.getItem('ID_Tool_Ruleset');
    const ruleset_input = `&ruleset_id=${window.localStorage.getItem(ruleset_id)}`;

    match_count = `&per_page=${await get_number_of_amiibo()}`;

    // call this function to find the exact amount of amiibo to search for
    async function get_number_of_amiibo() {
        const number_of_amiibo_query = await fetch(`https://www.amiibots.com/api/amiibo?per_page=1${ruleset_input}&matchmaking_status=ACTIVE,STANDBY`);
        const number_of_amiibo_response = await number_of_amiibo_query.json();
        console.log(`found ${number_of_amiibo_response.total} ${ruleset_id} amiibo`);
        return number_of_amiibo_response.total;
    }

    document.getElementById('amiibo_id_found').innerText = (`Searching for amiibo...`);
    console.log('Searching for amiibo');

    // Get all character names and ids
    let character_name = [];
    let character_id = [];

    const url_get_all_characters = 'https://www.amiibots.com/api/utility/get_all_characters';
    const get_all_characters = await fetch(url_get_all_characters);
    const get_all_characters_json = await get_all_characters.json();
    const pushCharacterData = get_all_characters_json.data.map(
        function(index) {
            character_name.push(index.name);
            character_id.push(index.id);
        });

    // List all amiibo onto page
    const rank_url_query = 'https://www.amiibots.com/api/amiibo?' + match_count + ruleset_input;
    const match_history_query = await fetch(rank_url_query);
    const match_history_response = await match_history_query.json();
    console.log('Recieved response');

    let content = document.getElementById('amiibo_list');
    let list = '<div class="flex_list_container">';
    let amiibo_count = 0;
    let status = 'no status';
    let characterIcon = 'no icon';
    const match_history = match_history_response.data.map(
        function(index) {
            if (index.user.twitch_user_name === submitted_amiibots_name) {
                amiibo_count++;
                status = 'reset';
                characterIcon = 'reset';

                if (index.match_selection_status == 'ACTIVE') {status = 'ACTIVE';}
                if (index.match_selection_status == 'STANDBY') {status = 'STANDBY';}
                if (index.match_selection_status == 'INACTIVE') {status = 'INACTIVE';}

                // Match current character with icon
                for (let i = 0; i < character_id.length; i++) {
                    if (character_id[i] == index.playable_character_id) {
                        characterIcon = (`${character_name[i]}.png`)
                    }
                }
                
                // Put image onto the listed item when amiibots is fixed
                list += (
                `<div class="list_item ${status}" onclick="setAmiiboForSearch('${amiibots_id}', '${index.id}', '${ruleset_id}');">
                    <img src="images/${characterIcon}" class="list_image">
                    <p class="list_stats">
                        <i>Amiibo Name:</i>     <b>${index.name}</b> </br>
                        <i>Amiibo ID:</i>       ${index.id} </br>
                        <i>Rating:</i>          ${index.rating} </br>
                        <i>Total Matches:</i>   ${index.total_matches} </br>
                        <i>Status:</i>          <b class="${status}">${index.match_selection_status}</b> </br>
                        </br>
                    </p>
                </div>`
                );
            }
    });
    list += "</div>";
    content.innerHTML = list;

    // Update status
    document.getElementById('amiibo_id_found').innerText = (`Search complete!`);
    document.getElementById('amiibo_count').innerText = (`Amiibo found (${ruleset_id}): ${amiibo_count}`);
}





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