//                                                              STARTER FUNCTION
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
window.onload = function() {
    tierlistRulesetHighlight('start');
    generateTierList();
};





//                                                              HIGHLIGHT TIERLIST RULESET BUTTONS
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
function tierlistRulesetHighlight(start, button_id) {
    if (start == 'start') {
        try {
        // Highlight ruleset buttons
        let highlightRulesetButton = window.localStorage.getItem('Tierlist Ruleset');
        document.getElementById(`ruleset_${highlightRulesetButton}`).setAttribute("style", `background-color: rgba(220, 220, 220, 0.3)`);
        } catch (err) {
            window.localStorage.setItem('Tierlist Ruleset', 'vanilla');
            let highlightRulesetButton = window.localStorage.getItem('Tierlist Ruleset');
            document.getElementById(`ruleset_${highlightRulesetButton}`).setAttribute("style", `background-color: rgba(220, 220, 220, 0.3)`);
            console.log("Ruleset was empty");
        }
    }

    if (start != 'start') {
        try {    
            let highlightRulesetButton = window.localStorage.getItem('Tierlist Ruleset');
            document.getElementById(`ruleset_${highlightRulesetButton}`).removeAttribute("style", `background-color: rgba(220, 220, 220, 0.3)`);
    
            document.getElementById(`ruleset_${button_id}`).setAttribute("style", `background-color: rgba(220, 220, 220 , 0.3)`);
            window.localStorage.setItem('Tierlist Ruleset', `${button_id}`);
            console.log('Ruleset is: ' + button_id);
        } catch (err) {
            document.getElementById(`ruleset_${button_id}`).setAttribute("style", `background-color: rgba(220, 220, 220 , 0.3)`);
            window.localStorage.setItem('Tierlist Ruleset', `${button_id}`);
            console.log('Ruleset is: ' + button_id);
        }

        window.location.reload();
    }
}





//                                                              ALL TIERLIST FUNCTIONALITY
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
async function generateTierList(match_count) {

    let tier_list_ruleset_input = window.localStorage.getItem("Tierlist Ruleset");
    let tier_list_ruleset_select = window.localStorage.getItem(tier_list_ruleset_input);
    let tier_list_ruleset_id = `&ruleset_id=${tier_list_ruleset_select}`;
    const matchmaking_status = '&matchmaking_status=ACTIVE,STANDBY';
    match_count = `&per_page=${await get_number_of_amiibo()}`;


    // call this function to find the exact amount of amiibo to search for
    async function get_number_of_amiibo() {
        const number_of_amiibo_query = await fetch(`https://www.amiibots.com/api/amiibo?per_page=1${tier_list_ruleset_id}&matchmaking_status=ACTIVE,STANDBY`);
        const number_of_amiibo_response = await number_of_amiibo_query.json();
        console.log(`found ${number_of_amiibo_response.total} ${tier_list_ruleset_input} amiibo`);
        return number_of_amiibo_response.total;
    }

    // update the title of the tierlist
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
            if ((all_character_id[i] == leaderboard_char_id[x]) && (temp.length <= 24)) { // top 25 amiibo of each character
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

            // Calculate median
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


    // Calculate the global average rating
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
    let U_bound = (range * 0.90) + min_average_rating;
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
    let c_bound = (range * 0.12) + min_average_rating;
    console.log("C TIER: " + c_bound);

    // D+ TIER < C TIER


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