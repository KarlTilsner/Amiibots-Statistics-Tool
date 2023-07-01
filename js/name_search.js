//                                                              STARTER FUNCTION
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
window.onload = function() {
    nameSearchToolHighlight('start');
    nameSearchTool();
};





//                                                              HIGHLIGHT NAME SEARCH TOOL RULESET BUTTONS
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





//                                                              NAME SEARCH TOOL
//---------------------------------------------------------------------------------------------------------------------------------------------------------
let nst_list_response;
let all_character_names = [];
let all_character_id = [];

async function nameSearchTool() {
    // Getting ruleset
    let name_search_ruleset_input = window.localStorage.getItem("Name Search Tool Ruleset");
    let name_search_ruleset_select = window.localStorage.getItem(name_search_ruleset_input);
    let name_search_ruleset_id = `&ruleset_id=${name_search_ruleset_select}`;

    match_count = `&per_page=${await get_number_of_amiibo()}`;


    // call this function to find the exact amount of amiibo to search for
    async function get_number_of_amiibo() {
        const number_of_amiibo_query = await fetch(`https://www.amiibots.com/api/amiibo?per_page=1${name_search_ruleset_id}`);
        const number_of_amiibo_response = await number_of_amiibo_query.json();
        console.log(`found ${number_of_amiibo_response.total} ${name_search_ruleset_input} amiibo`);
        return number_of_amiibo_response.total;
    }

    // Get all character ids
    // Get all character names
    const all_characters_query = await fetch('https://www.amiibots.com/api/utility/get_all_characters');
    const all_characters_response = await all_characters_query.json();

    const all_characters_data = all_characters_response.data.map(
        function(index) {
            all_character_names.push(index.name);
            all_character_id.push(index.id);
    });

    // Get data from api to be displayed
    
    const nst_list_url = 'https://www.amiibots.com/api/amiibo?' + match_count + name_search_ruleset_id;
    const nst_list_query = await fetch(nst_list_url);
    nst_list_response = await nst_list_query.json();

    nameSearchBar();
}





//                                                              NAME SEARCH TOOL SEARCH BAR FUNCTION
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function nameSearchBar() {
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
    const nst_list_data = nst_list_response.data.map(
        function(index) {

            if (((index.name).toUpperCase().indexOf(filter) > -1) && ((index.user.twitch_user_name).toUpperCase().indexOf(username_filter) > -1)) {
                amiibo_count++;
                status = 'reset';
                characterIcon = 'reset';

                if (index.match_selection_status == 'ACTIVE') {status = 'ACTIVE';}
                if (index.match_selection_status == 'STANDBY') {status = 'STANDBY';}
                if (index.match_selection_status == 'INACTIVE') {status = 'INACTIVE';}

                // Match current character with icon
                for (let i = 0; i < all_character_id.length; i++) {
                    if (all_character_id[i] == index.playable_character_id) {
                        characterIcon = (`${all_character_names[i]}.png`)
                    }
                }
                
                // Put image onto the listed item when amiibots is fixed
                list += (
                `<div class="list_item_short ${status}" id="list_item_searchable">
                    <img src="images/${characterIcon}" class="list_image">
                    <p class="list_stats">
                        <i>Trainer Name:</i>    <b>${index.user.twitch_user_name}</b> </br>
                        <i id="list_item_amiibo_name">Amiibo Name:</i>     <b>${index.name}</b> </br>
                        <i>Rating:</i>          ${index.rating} </br>
                        <i>Total Matches:</i>   ${index.total_matches} </br>
                        <i>Status:</i>          <b class="${status}">${index.match_selection_status}</b> </br>
                        </br>
                    </p>
                </div>`
                );
    }});
    list += "</div>";
    content.innerHTML = list;

    document.getElementById('amiibo_count').innerText = (`Amiibo found: ${amiibo_count}`);
}