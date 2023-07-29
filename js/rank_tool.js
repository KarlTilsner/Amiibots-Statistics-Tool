// UPDATE THE STORED AMIIBO ID AND REDIRECT TO THE STATS TOOL
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function updateStatsSearch(new_id) {
    console.log('updated id');
    window.localStorage.setItem('saved_amiibo_id', new_id);
    window.location.href = "./index.html";
}





// RANK TOOL: SEARCH FOR AMIIBO AND PRINT THEM ON SCREEN
//---------------------------------------------------------------------------------------------------------------------------------------------------------
async function rank_tool() {
    let userInput = document.querySelector('#trainer_name').value;

    let amiibo_count = 0;

    // spin up new workers
    const worker_vanilla = new Worker('./js/ranktool_worker_v.js');
    worker_vanilla.postMessage(userInput);

    const worker_b5b = new Worker('./js/ranktool_worker_b5b.js');
    worker_b5b.postMessage(userInput);

    const worker_ag = new Worker('./js/ranktool_worker_ag.js');
    worker_ag.postMessage(userInput);


    
    // get all character names and ids
    async function get_all_characters() {
        const url = `https://www.amiibots.com/api/utility/get_all_characters`;
        const query = await fetch(url);
        const response = await query.json();
        const data = response.data.map(index => index);
        
        console.log("Got all character names and ids");
        return data;
    }
    const all_characters = await get_all_characters();








    worker_vanilla.onmessage = function(message) {
        const vanilla_top_place = message.data.topPlaceAmiibo;
        const vanilla_top_ten = message.data.topTenAmiibo;

        amiibo_count += (vanilla_top_place.length + vanilla_top_ten.length);

        console.log("Vanilla top places: ", vanilla_top_place);
        console.log("Vanilla top 10s: ", vanilla_top_ten);

        document.getElementById('vanilla_top_place_title').innerText = `1st Place (${vanilla_top_place.length})`;
        document.getElementById('vanilla_top_ten_title').innerText = `Top 10 (${vanilla_top_ten.length})`;
        
        function printTopPlace () {
            // Print every amiibo onto the screen
            let content = document.getElementById('vanilla_top_place');
            let list = '<div class="flex_list_container">';

            for (let i = 0; i < all_characters.length; i++) {
                for (let x = 0; x < vanilla_top_place.length; x++) {
                    let characterIcon = 0;

                    if (all_characters[i].id == vanilla_top_place[x].character_id) {

                        // Match current character with icon
                        characterIcon = (`${all_characters[i].name}.png`);

                        // Put image onto the listed item when amiibots is fixed
                        list += (
           
                        `<div class="list_item ${vanilla_top_place[x].match_selection_status}" id="list_item_searchable" onclick="updateStatsSearch('${vanilla_top_place[x].amiibo_id}')">
                            <img src="./images/${characterIcon}" class="list_image">

                            <div class="list_stats_grid_container">
                                <div class="list_stats amiibo_trainer_name_title">
                                    <h2>${userInput}</h2>
                                    <h1>${vanilla_top_place[x].amiibo_name}</h1>
                                </div>
                            </div>

                            <div class="list_stats_container">
                                <div class="list_stats">
                                    <h2>Rating:</h2>
                                    <h1>${vanilla_top_place[x].amiibo_rating.toFixed(2)}</h1>
                                </div>

                                <div class="list_stats">
                                    <h2>Matches:</h2>   
                                    <h1>${vanilla_top_place[x].total_matches}</h1>
                                </div>

                                <div class="list_stats">
                                    <h2>Rank:</h2>   
                                    <h1>${vanilla_top_place[x].amiibo_rank}</h1>
                                </div>
                            </div>

                        </div>`

                        );
                    }
                }
            }
            list += "</div>";
            content.innerHTML = list;
        }

        function printTopTen () {
                // Print every amiibo onto the screen
                let content = document.getElementById('vanilla_top_ten');
                let list = '<div class="flex_list_container">';
        
                for (let i = 0; i < all_characters.length; i++) {
                    for (let x = 0; x < vanilla_top_ten.length; x++) {
                        let characterIcon = 0;
        
                        if (all_characters[i].id == vanilla_top_ten[x].character_id) {
        
                            // Match current character with icon
                            characterIcon = (`${all_characters[i].name}.png`);
        
                            // Put image onto the listed item when amiibots is fixed
                            list += (
                                `<div class="list_item ${vanilla_top_ten[x].match_selection_status}" id="list_item_searchable" onclick="updateStatsSearch('${vanilla_top_ten[x].amiibo_id}')">
                                    <img src="./images/${characterIcon}" class="list_image">
        
                                    <div class="list_stats_grid_container">
                                        <div class="list_stats amiibo_trainer_name_title">
                                            <h2>${userInput}</h2>
                                            <h1>${vanilla_top_ten[x].amiibo_name}</h1>
                                        </div>
                                    </div>
        
                                    <div class="list_stats_container">
                                        <div class="list_stats">
                                            <h2>Rating:</h2>
                                            <h1>${vanilla_top_ten[x].amiibo_rating.toFixed(2)}</h1>
                                        </div>
        
                                        <div class="list_stats">
                                            <h2>Matches:</h2>   
                                            <h1>${vanilla_top_ten[x].total_matches}</h1>
                                        </div>
        
                                        <div class="list_stats">
                                            <h2>Rank:</h2>   
                                            <h1>${vanilla_top_ten[x].amiibo_rank}</h1>
                                        </div>
                                    </div>
        
                                </div>`
                            );
                        }
                    }
                }
                list += "</div>";
                content.innerHTML = list;
        }

        printTopPlace();
        printTopTen();
    };



    worker_b5b.onmessage = function(message) {
        const b5b_top_place = message.data.topPlaceAmiibo;
        const b5b_top_ten = message.data.topTenAmiibo;

        amiibo_count += (b5b_top_place.length + b5b_top_ten.length);

        console.log("B5B top places: ", b5b_top_place);
        console.log("B5B top 10s: ", b5b_top_ten);

        document.getElementById('b5b_top_place_title').innerText = `1st Place (${b5b_top_place.length})`;
        document.getElementById('b5b_top_ten_title').innerText = `Top 10 (${b5b_top_ten.length})`;

        function printTopPlace () {
            // Print every amiibo onto the screen
            let content = document.getElementById('b5b_top_place');
            let list = '<div class="flex_list_container">';

            for (let i = 0; i < all_characters.length; i++) {
                for (let x = 0; x < b5b_top_place.length; x++) {
                    let characterIcon = 0;

                    if (all_characters[i].id == b5b_top_place[x].character_id) {

                        // Match current character with icon
                        characterIcon = (`${all_characters[i].name}.png`);

                        // Put image onto the listed item when amiibots is fixed
                        list += (
                            `<div class="list_item ${b5b_top_place[x].match_selection_status}" id="list_item_searchable" onclick="updateStatsSearch('${b5b_top_place[x].amiibo_id}')">
                                <img src="./images/${characterIcon}" class="list_image">

                                <div class="list_stats_grid_container">
                                    <div class="list_stats amiibo_trainer_name_title">
                                        <h2>${userInput}</h2>
                                        <h1>${b5b_top_place[x].amiibo_name}</h1>
                                    </div>
                                </div>

                                <div class="list_stats_container">
                                    <div class="list_stats">
                                        <h2>Rating:</h2>
                                        <h1>${b5b_top_place[x].amiibo_rating.toFixed(2)}</h1>
                                    </div>

                                    <div class="list_stats">
                                        <h2>Matches:</h2>   
                                        <h1>${b5b_top_place[x].total_matches}</h1>
                                    </div>

                                    <div class="list_stats">
                                        <h2>Rank:</h2>   
                                        <h1>${b5b_top_place[x].amiibo_rank}</h1>
                                    </div>
                                </div>

                            </div>`
                        );
                    }
                }
            }
            list += "</div>";
            content.innerHTML = list;
        }

        function printTopTen () {
            // Print every amiibo onto the screen
            let content = document.getElementById('b5b_top_ten');
            let list = '<div class="flex_list_container">';

            for (let i = 0; i < all_characters.length; i++) {
                for (let x = 0; x < b5b_top_ten.length; x++) {
                    let characterIcon = 0;

                    if (all_characters[i].id == b5b_top_ten[x].character_id) {

                        // Match current character with icon
                        characterIcon = (`${all_characters[i].name}.png`);

                        // Put image onto the listed item when amiibots is fixed
                        list += (
                            `<div class="list_item ${b5b_top_ten[x].match_selection_status}" id="list_item_searchable" onclick="updateStatsSearch('${b5b_top_ten[x].amiibo_id}')">
                                <img src="./images/${characterIcon}" class="list_image">

                                <div class="list_stats_grid_container">
                                    <div class="list_stats amiibo_trainer_name_title">
                                        <h2>${userInput}</h2>
                                        <h1>${b5b_top_ten[x].amiibo_name}</h1>
                                    </div>
                                </div>

                                <div class="list_stats_container">
                                    <div class="list_stats">
                                        <h2>Rating:</h2>
                                        <h1>${b5b_top_ten[x].amiibo_rating.toFixed(2)}</h1>
                                    </div>

                                    <div class="list_stats">
                                        <h2>Matches:</h2>   
                                        <h1>${b5b_top_ten[x].total_matches}</h1>
                                    </div>

                                    <div class="list_stats">
                                        <h2>Rank:</h2>   
                                        <h1>${b5b_top_ten[x].amiibo_rank}</h1>
                                    </div>
                                </div>

                            </div>`
                        );
                    }
                }
            }
            list += "</div>";
            content.innerHTML = list;
        }
        printTopPlace();
        printTopTen();
    };



    worker_ag.onmessage = function(message) {
        const ag_top_place = message.data.topPlaceAmiibo;
        const ag_top_ten = message.data.topTenAmiibo;

        amiibo_count += (ag_top_place.length + ag_top_ten.length);

        console.log("AG top places: ", ag_top_place);
        console.log("AG top 10s: ", ag_top_ten);

        document.getElementById('ag_top_place_title').innerText = `1st Place (${ag_top_place.length})`;
        document.getElementById('ag_top_ten_title').innerText = `Top 10 (${ag_top_ten.length})`;

        function printTopPlace () {
            // Print every amiibo onto the screen
            let content = document.getElementById('ag_top_place');
            let list = '<div class="flex_list_container">';

            for (let i = 0; i < all_characters.length; i++) {
                for (let x = 0; x < ag_top_place.length; x++) {
                    let characterIcon = 0;

                    if (all_characters[i].id == ag_top_place[x].character_id) {

                        // Match current character with icon
                        characterIcon = (`${all_characters[i].name}.png`);

                        // Put image onto the listed item when amiibots is fixed
                        list += (
                            `<div class="list_item ${ag_top_place[x].match_selection_status}" id="list_item_searchable" onclick="updateStatsSearch('${ag_top_place[x].amiibo_id}')">
                                <img src="./images/${characterIcon}" class="list_image">

                                <div class="list_stats_grid_container">
                                    <div class="list_stats amiibo_trainer_name_title">
                                        <h2>${userInput}</h2>
                                        <h1>${ag_top_place[x].amiibo_name}</h1>
                                    </div>
                                </div>

                                <div class="list_stats_container">
                                    <div class="list_stats">
                                        <h2>Rating:</h2>
                                        <h1>${ag_top_place[x].amiibo_rating.toFixed(2)}</h1>
                                    </div>

                                    <div class="list_stats">
                                        <h2>Matches:</h2>   
                                        <h1>${ag_top_place[x].total_matches}</h1>
                                    </div>

                                    <div class="list_stats">
                                        <h2>Rank:</h2>   
                                        <h1>${ag_top_place[x].amiibo_rank}</h1>
                                    </div>
                                </div>

                            </div>`
                        );
                    }
                }
            }
            list += "</div>";
            content.innerHTML = list;
        }

        function printTopTen () {
            // Print every amiibo onto the screen
            let content = document.getElementById('ag_top_ten');
            let list = '<div class="flex_list_container">';

            for (let i = 0; i < all_characters.length; i++) {
                for (let x = 0; x < ag_top_ten.length; x++) {
                    let characterIcon = 0;

                    if (all_characters[i].id == ag_top_ten[x].character_id) {

                        // Match current character with icon
                        characterIcon = (`${all_characters[i].name}.png`);

                        // Put image onto the listed item when amiibots is fixed
                        list += (
                            `<div class="list_item ${ag_top_ten[x].match_selection_status}" id="list_item_searchable" onclick="updateStatsSearch('${ag_top_ten[x].amiibo_id}')">
                                <img src="./images/${characterIcon}" class="list_image">

                                <div class="list_stats_grid_container">
                                    <div class="list_stats amiibo_trainer_name_title">
                                        <h2>${userInput}</h2>
                                        <h1>${ag_top_ten[x].amiibo_name}</h1>
                                    </div>
                                </div>

                                <div class="list_stats_container">
                                    <div class="list_stats">
                                        <h2>Rating:</h2>
                                        <h1>${ag_top_ten[x].amiibo_rating.toFixed(2)}</h1>
                                    </div>

                                    <div class="list_stats">
                                        <h2>Matches:</h2>   
                                        <h1>${ag_top_ten[x].total_matches}</h1>
                                    </div>

                                    <div class="list_stats">
                                        <h2>Rank:</h2>   
                                        <h1>${ag_top_ten[x].amiibo_rank}</h1>
                                    </div>
                                </div>

                            </div>`
                        );
                    }
                }
            }
            list += "</div>";
            content.innerHTML = list;
        }
        printTopPlace();
        printTopTen();
    };

}