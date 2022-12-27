//                                                              AMIIBO ID SEARCH TOOL
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
async function amiiboIDSearch() {
    const submitted_amiibots_name = document.querySelector('#search_amiibo_name_and_id').value;
    const ruleset_input = document.getElementById('ruleset_select_amiibo_id_search').value;

    document.getElementById('amiibo_id_found').innerText = (`Searching for amiibo`);

    const ruleset_select = window.localStorage.getItem(ruleset_input);
    const ruleset_id = `&ruleset_id=${ruleset_select}`;

    console.log('Querying the API');
    const rank_url_query = 'https://www.amiibots.com/api/amiibo?' + per_page + ruleset_id + matchmaking_status;
    const match_history_query = await fetch(rank_url_query);
    const match_history_response = await match_history_query.json();
    console.log('Recieved response');

    let content = document.getElementById('amiibo_list');
    let list = '<div class="flex_list_container">'
    const match_history = match_history_response.data.map(
        function(index) {
            if (index.user.twitch_user_name === submitted_amiibots_name) {
                list += (
                `<div class="list_item"><p class="stats">
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

//                                                              AMIIBOTS ID SEARCH TOOL
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
    const twitchName = document.querySelector('#search_amiibo_name_and_id').value;

    document.getElementById('amiibo_id_found').innerText = (`Searching for trainer_id`);

    let amiibots_id = 'Trainer ID Not Found';

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

    document.getElementById('amiibo_id_found').innerText = (`Search complete!`);
    document.getElementById('amiibots_id_found').innerText = (amiibots_id);
}