//                                                              STARTER FUNCTION
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
window.onload = function() {
    // Set rulesets
    window.localStorage.setItem('vanilla', '44748ebb-e2f3-4157-90ec-029e26087ad0');
    window.localStorage.setItem('b5b', '328d8932-456f-4219-9fa4-c4bafdb55776');
    window.localStorage.setItem('ag', 'af1df0cd-3251-4b44-ba04-d48de5b73f8b');

    usageTierlistRulesetHighlight('start');
    usageTierlistFilterHighlight('start');
    usage_tierlist('7000');
};





//                                                              HIGHLIGHT USAGE TIERLIST RULESET BUTTONS
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
function usageTierlistRulesetHighlight(start, button_id) {
    if (start == 'start') {
        try {
        // Highlight ruleset buttons
        let highlightRulesetButton = window.localStorage.getItem('Usage Tierlist Ruleset');
        document.getElementById(`ruleset_${highlightRulesetButton}`).setAttribute("style", `background-color: rgba(220, 220, 220, 0.3)`);
        } catch (err) {
            window.localStorage.setItem('Usage Tierlist Ruleset', 'vanilla');
            let highlightRulesetButton = window.localStorage.getItem('Usage Tierlist Ruleset');
            document.getElementById(`ruleset_${highlightRulesetButton}`).setAttribute("style", `background-color: rgba(220, 220, 220, 0.3)`);
            console.log("Ruleset was empty");
        }
    }

    if (start != 'start') {
        try {    
            let highlightRulesetButton = window.localStorage.getItem('Usage Tierlist Ruleset');
            document.getElementById(`ruleset_${highlightRulesetButton}`).removeAttribute("style", `background-color: rgba(220, 220, 220, 0.3)`);
    
            document.getElementById(`ruleset_${button_id}`).setAttribute("style", `background-color: rgba(220, 220, 220 , 0.3)`);
            window.localStorage.setItem('Usage Tierlist Ruleset', `${button_id}`);
            console.log('Ruleset is: ' + button_id);
        } catch (err) {
            document.getElementById(`ruleset_${button_id}`).setAttribute("style", `background-color: rgba(220, 220, 220 , 0.3)`);
            window.localStorage.setItem('Usage Tierlist Ruleset', `${button_id}`);
            console.log('Ruleset is: ' + button_id);
        }

        window.location.reload();
    }
}





//                                                              HIGHLIGHT USAGE TIERLIST FILTER BUTTONS
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
function usageTierlistFilterHighlight(start, button_id) {
    if (start == 'start') {
        try {
        // Highlight ruleset buttons
        let highlightRulesetButton = window.localStorage.getItem('Usage Tierlist Filter');
        document.getElementById(`filter_${highlightRulesetButton}`).setAttribute("style", `background-color: rgba(220, 220, 220, 0.3)`);
        } catch (err) {
            window.localStorage.setItem('Usage Tierlist Filter', 'active_standby');
            let highlightRulesetButton = window.localStorage.getItem('Usage Tierlist Filter');
            document.getElementById(`filter_${highlightRulesetButton}`).setAttribute("style", `background-color: rgba(220, 220, 220, 0.3)`);
            console.log("Filter was empty");
        }
    }

    if (start != 'start') {
        try {    
            let highlightRulesetButton = window.localStorage.getItem('Usage Tierlist Filter');
            document.getElementById(`filter_${highlightRulesetButton}`).removeAttribute("style", `background-color: rgba(220, 220, 220, 0.3)`);
    
            document.getElementById(`filter_${button_id}`).setAttribute("style", `background-color: rgba(220, 220, 220 , 0.3)`);
            window.localStorage.setItem('Usage Tierlist Filter', `${button_id}`);
            console.log('Filter is: ' + button_id);
        } catch (err) {
            document.getElementById(`filter_${button_id}`).setAttribute("style", `background-color: rgba(220, 220, 220 , 0.3)`);
            window.localStorage.setItem('Usage Tierlist Filter', `${button_id}`);
            console.log('Filter is: ' + button_id);
        }

        window.location.reload();
    }
}





//                                                              USAGE TIERLIST DATA FETCHER
//---------------------------------------------------------------------------------------------------------------------------------------------------------
let usage_tierlist_char_id = [];
let usage_tierlist_selection_status = [];
let all_character_names = [];
let all_character_id = [];

async function usage_tierlist(match_count) {

    // RULESET CODE
    let tier_list_ruleset_input = window.localStorage.getItem("Usage Tierlist Ruleset");
    let tier_list_ruleset_select = window.localStorage.getItem(tier_list_ruleset_input);
    let tier_list_ruleset_id = `&ruleset_id=${tier_list_ruleset_select}`;

    match_count = `&per_page=${await get_number_of_amiibo()}`;






    // call this function to find the exact amount of amiibo to search for
    async function get_number_of_amiibo() {
        const number_of_amiibo_query = await fetch(`https://www.amiibots.com/api/amiibo?per_page=1${tier_list_ruleset_id}`);
        const number_of_amiibo_response = await number_of_amiibo_query.json();
        console.log(`found ${number_of_amiibo_response.total} ${tier_list_ruleset_input} amiibo`);
        return number_of_amiibo_response.total;
    }






    document.getElementById('tierlistTitle').innerHTML = `Character Population Tierlist (${tier_list_ruleset_input})`;

    // Get all character ids
    // Get all character names
    const all_characters_query = await fetch('https://www.amiibots.com/api/utility/get_all_characters');
    const all_characters_response = await all_characters_query.json();
    const all_characters_data = all_characters_response.data.map(
        function(index) {
            all_character_names.push(index.name);
            all_character_id.push(index.id);
    });

    // Get all amiibo corresponding char ids
    // Get all selection statuses
    
    const tier_list_url = 'https://www.amiibots.com/api/amiibo?' + match_count + tier_list_ruleset_id;
    const tier_list_query = await fetch(tier_list_url);
    const tier_list_response = await tier_list_query.json();

    const tier_list_data = tier_list_response.data.map(
        function(index) {
            usage_tierlist_char_id.push(index.playable_character_id);
            usage_tierlist_selection_status.push(index.match_selection_status);
    });

    console.log("Data retrieved")
    filter_usage_tierlist();

}





//                                                              FILTER DATA FOR THE TIERLIST
//---------------------------------------------------------------------------------------------------------------------------------------------------------
let usage_tierlist_data = [];

function filter_usage_tierlist () {
    let filter = window.localStorage.getItem('Usage Tierlist Filter');
    console.log(`Preparing to filter ${usage_tierlist_char_id.length} results with ${filter}`);

    // count up all amiibo for each character
    // push count to an array

    if (filter == 'all') {
        for (let i = 0; i < all_character_id.length; i++) {
            let tempCounter = 0;
            for (let x = 0; x < usage_tierlist_char_id.length; x++) {
                if (usage_tierlist_char_id[x] == all_character_id[i]) {
                    tempCounter++;
                }
            }
            usage_tierlist_data.push(tempCounter);
        }

        console.log(usage_tierlist_data);
    }

    if (filter == 'active') {
        for (let i = 0; i < all_character_id.length; i++) {
            let tempCounter = 0;
            for (let x = 0; x < usage_tierlist_char_id.length; x++) {
                if ((usage_tierlist_char_id[x] == all_character_id[i]) && (usage_tierlist_selection_status[x] == 'ACTIVE')) {
                    tempCounter++;
                }
            }
            usage_tierlist_data.push(tempCounter);
        }

        console.log(usage_tierlist_data);
    }

    if (filter == 'active_standby') {
        for (let i = 0; i < all_character_id.length; i++) {
            let tempCounter = 0;
            for (let x = 0; x < usage_tierlist_char_id.length; x++) {
                if ((usage_tierlist_char_id[x] == all_character_id[i]) && (usage_tierlist_selection_status[x] == 'ACTIVE' || usage_tierlist_selection_status[x] == 'STANDBY')) {
                    tempCounter++;
                }
            }
            usage_tierlist_data.push(tempCounter);
        }

        console.log(usage_tierlist_data);
    }

    // Sort array from highest to lowest
    // Combine arrays
    let combineSort = [];
    for (let i = 0; i < usage_tierlist_data.length; i++) {
        combineSort.push({'name': all_character_names[i], 'count': usage_tierlist_data[i], 'id': all_character_id[i]});
    }

    // Sort arrays
    combineSort.sort(function(a, b) {
        return ((a.count > b.count) ? -1 : ((a.count == b.count)) ? 0 : 1);
    });

    // Seperate arrays
    for (let i = 0; i < combineSort.length; i++) {
        all_character_names[i] = combineSort[i].name;
        usage_tierlist_data[i] = combineSort[i].count;
        all_character_id[i] = combineSort[i].id;
    }

    console.log(combineSort);

    render_usage_tierlist();

}





//                                                              RENDER DATA ONTO SCREEN
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function render_usage_tierlist() {

    // Create tier cut offs
    let highest_character_count = usage_tierlist_data[0];
    let lowest_character_count = usage_tierlist_data[usage_tierlist_data.length - 1];
    let range = highest_character_count - lowest_character_count;



    // UBER TIER
    let UBER_bound = (range * 0.80) + lowest_character_count;
    console.log("UBER TIER: " + UBER_bound);

    // OU TIER
    let OU_bound = (range * 0.50) + lowest_character_count;
    console.log("OU TIER: " + OU_bound);

    // UU TIER
    let UU_bound = (range * 0.25) + lowest_character_count;
    console.log("UU TIER: " + UU_bound);

    // RU TIER
    let RU_bound = (range * 0.15) + lowest_character_count;
    console.log("RU TIER: " + RU_bound);

    // NU < RU

    // print array onto tier list
    let content = document.getElementById('UBER_TIER');
    let list = '<div class="tier_list_container" style="gap: 0px;">';
    for (let i = 0; i < usage_tierlist_data.length; i++) {
        if (usage_tierlist_data[i] >= UBER_bound) {
            list += 
                (
                `<div class="tier_list_item">
                    <img src="images/${all_character_names[i]}.png" class="tier_list_image">
                    <div class="tier_list_text_box">
                        <p class="tier_list_text">${usage_tierlist_data[i]}</p>
                    </div>
                </div>`
                );
        }
    }
    list += "</div>";
    content.innerHTML = list;


    content = document.getElementById('OU_TIER');
    list = '<div class="tier_list_container" style="gap: 0px;">';
    for (let i = 0; i < usage_tierlist_data.length; i++) {
        if ((usage_tierlist_data[i] < UBER_bound) && (usage_tierlist_data[i] >= OU_bound)) {
            list += 
                (
                `<div class="tier_list_item">
                    <img src="images/${all_character_names[i]}.png" class="tier_list_image">
                    <div class="tier_list_text_box">
                        <p class="tier_list_text">${usage_tierlist_data[i]}</p>
                    </div>
                </div>`
                );
        }
    }
    list += "</div>";
    content.innerHTML = list;


    content = document.getElementById('UU_TIER');
    list = '<div class="tier_list_container" style="gap: 0px;">';
    for (let i = 0; i < usage_tierlist_data.length; i++) {
        if ((usage_tierlist_data[i] < OU_bound) && (usage_tierlist_data[i] >= UU_bound)) {
            list += 
                (
                `<div class="tier_list_item">
                    <img src="images/${all_character_names[i]}.png" class="tier_list_image">
                    <div class="tier_list_text_box">
                        <p class="tier_list_text">${usage_tierlist_data[i]}</p>
                    </div>
                </div>`
                );
        }
    }
    list += "</div>";
    content.innerHTML = list;


    content = document.getElementById('RU_TIER');
    list = '<div class="tier_list_container" style="gap: 0px;">';
    for (let i = 0; i < usage_tierlist_data.length; i++) {
        if ((usage_tierlist_data[i] < UU_bound) && (usage_tierlist_data[i] >= RU_bound)) {
            list += 
                (
                `<div class="tier_list_item">
                    <img src="images/${all_character_names[i]}.png" class="tier_list_image">
                    <div class="tier_list_text_box">
                        <p class="tier_list_text">${usage_tierlist_data[i]}</p>
                    </div>
                </div>`
                );
        }
    }
    list += "</div>";
    content.innerHTML = list;


    content = document.getElementById('NU_TIER');
    list = '<div class="tier_list_container" style="gap: 0px;">';
    for (let i = 0; i < usage_tierlist_data.length; i++) {
        if (usage_tierlist_data[i] < RU_bound) {
            list += 
                (
                `<div class="tier_list_item">
                    <img src="images/${all_character_names[i]}.png" class="tier_list_image">
                    <div class="tier_list_text_box">
                        <p class="tier_list_text">${usage_tierlist_data[i]}</p>
                    </div>
                </div>`
                );
        }
    }
    list += "</div>";
    content.innerHTML = list;

}

