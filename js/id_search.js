async function amiiboIDSearch() {

//                                                              AMIIBOTS ID SEARCH TOOL
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
    const twitchName = document.querySelector('#search_amiibo_name_and_id').value;

    document.getElementById('amiibo_id_found').innerText = (`Searching for trainer_id`);

    let amiibots_id = 'Trainer ID Not Found';

    const ruleset_input = document.getElementById('ruleset_select_amiibo_id_search').value;
    const ruleset_select = window.localStorage.getItem(ruleset_input);
    const ruleset_id = `&ruleset_id=${ruleset_select}`;

    console.log('Querying the API');

    const id_url_query = 'https://www.amiibots.com/api/singles_matches?' + per_page + ruleset_id;
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

//                                                              AMIIBO ID SEARCH TOOL
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
    const submitted_amiibots_name = document.querySelector('#search_amiibo_name_and_id').value;

    document.getElementById('amiibo_id_found').innerText = (`Searching for amiibo...`);

    console.log('Querying the API');
    const number_of_amiibo = 6000;
    const per_page_leaderboard = `&per_page=${number_of_amiibo}`;
    const rank_url_query = 'https://www.amiibots.com/api/amiibo?' + per_page_leaderboard + ruleset_id;
    const match_history_query = await fetch(rank_url_query);
    const match_history_response = await match_history_query.json();
    console.log('Recieved response');

    let content = document.getElementById('amiibo_list');
    let list = '<div class="flex_list_container">'
    const match_history = match_history_response.data.map(
        function(index) {

            if (index.user.twitch_user_name === submitted_amiibots_name) {
                list += (
                `<div class="list_item" onclick="setAmiiboForSearch('${amiibots_id}', '${index.id}', '${ruleset_input}');"><p class="stats">
                <i>Amiibo Name:</i>  <b>${index.name}</b> </br>
                <i>Amiibo ID:</i>       ${index.id} </br>
                <i>Rating:</i>          ${index.rating} </br>
                </br>
                </p></div>`
                );
            }
    });
    list += "</div>";
    content.innerHTML = list;


    document.getElementById('amiibo_id_found').innerText = (`Search complete!`);
}

//                                                              CLICK ON LISTED AMIIBO AND GRAPH IT
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
function setAmiiboForSearch(twitch_name, amiibo_id, ruleset) {
        //Get text field information
        console.log('Twitch Name is: ' + twitch_name);
    
        console.log('Amiibo Name is: ' + amiibo_id);
    
        console.log('Ruleset is: ' + ruleset);
    
        //Put it into local storage
        window.localStorage.setItem("Twitch Name", twitch_name);
        window.localStorage.setItem("Amiibo Name", amiibo_id);
        window.localStorage.setItem("Ruleset", ruleset);

        window.location.href = 'index.html';
}