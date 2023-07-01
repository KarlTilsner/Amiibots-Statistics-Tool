// RANK TOOL: SEARCH FOR AMIIBO AND PRINT THEM ON SCREEN
//---------------------------------------------------------------------------------------------------------------------------------------------------------
async function rank_tool() {
    let userInput = document.querySelector('#trainer_name').value;

    let amiibo_count = 0;

    let vanilla_top_place = [];
    let vanilla_top_ten = [];

    let b5b_top_place = [];
    let b5b_top_ten = [];

    let ag_top_place = [];
    let ag_top_ten = [];

    // spin up new workers
    const worker_vanilla = new Worker('./js/ranktool_worker_v.js');
    worker_vanilla.postMessage(userInput);

    const worker_b5b = new Worker('./js/ranktool_worker_b5b.js');
    worker_b5b.postMessage(userInput);

    const worker_ag = new Worker('./js/ranktool_worker_ag.js');
    worker_ag.postMessage(userInput);

    // get all character names and ids
    let all_character_ids = [];
    let all_character_names = [];
    async function get_all_characters() {
        const url = `https://www.amiibots.com/api/utility/get_all_characters`;
        const query = await fetch(url);
        const response = await query.json();
        const data = response.data.map(
            function(index) {
                all_character_ids.push(index.id);
                all_character_names.push(index.name);
            }
        );
        console.log("Got all character names and ids");
    }
    await get_all_characters();


    console.log(all_character_names);





    worker_vanilla.onmessage = function(message) {
        vanilla_top_place = message.data.topPlaceAmiibo;
        vanilla_top_ten = message.data.topTenAmiibo;

        amiibo_count += (vanilla_top_place.length + vanilla_top_ten.length);

        console.log("Vanilla top places: ", vanilla_top_place);
        console.log("Vanilla top 10s: ", vanilla_top_ten);
        
        function printTopPlace () {
            // Print every amiibo onto the screen
            let content = document.getElementById('vanilla_top_place');
            let list = '<div class="flex_list_container">';

            for (let i = 0; i < all_character_ids.length; i++) {
                for (let x = 0; x < vanilla_top_place.length; x++) {
                    let characterIcon = 0;

                    if (all_character_ids[i] == vanilla_top_place[x].character_id) {

                        // Match current character with icon
                        characterIcon = (`${all_character_names[i]}.png`);

                        // Put image onto the listed item when amiibots is fixed
                        list += (
                        `<div class="list_item_short" id="list_item_searchable">
                            <img src="./images/${characterIcon}" class="list_image">
                            <p class="list_stats">
                                <i>Trainer Name:</i>    <b>${userInput}</b> </br>
                                <i id="list_item_amiibo_name">Amiibo Name:</i>     <b>${vanilla_top_place[x].amiibo_name}</b> </br>
                                <i>Rating:</i>          ${vanilla_top_place[x].amiibo_rating} </br>
                                <i>Total Matches:</i>   ${vanilla_top_place[x].total_matches} </br>
                                <i>Character Rank:</i>   ${vanilla_top_place[x].amiibo_rank} </br>
                                </br>
                            </p>
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
        
                for (let i = 0; i < all_character_ids.length; i++) {
                    for (let x = 0; x < vanilla_top_ten.length; x++) {
                        let characterIcon = 0;
        
                        if (all_character_ids[i] == vanilla_top_ten[x].character_id) {
        
                            // Match current character with icon
                            characterIcon = (`${all_character_names[i]}.png`);
        
                            // Put image onto the listed item when amiibots is fixed
                            list += (
                            `<div class="list_item_short" id="list_item_searchable">
                                <img src="./images/${characterIcon}" class="list_image">
                                <p class="list_stats">
                                    <i>Trainer Name:</i>    <b>${userInput}</b> </br>
                                    <i id="list_item_amiibo_name">Amiibo Name:</i>     <b>${vanilla_top_ten[x].amiibo_name}</b> </br>
                                    <i>Rating:</i>          ${vanilla_top_ten[x].amiibo_rating} </br>
                                    <i>Total Matches:</i>   ${vanilla_top_ten[x].total_matches} </br>
                                    <i>Character Rank:</i>   ${vanilla_top_ten[x].amiibo_rank} </br>
                                    </br>
                                </p>
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
        b5b_top_place = message.data.topPlaceAmiibo;
        b5b_top_ten = message.data.topTenAmiibo;

        amiibo_count += (b5b_top_place.length + b5b_top_ten.length);

        console.log("B5B top places: ", b5b_top_place);
        console.log("B5B top 10s: ", b5b_top_ten);

        function printTopPlace () {
            // Print every amiibo onto the screen
            let content = document.getElementById('b5b_top_place');
            let list = '<div class="flex_list_container">';

            for (let i = 0; i < all_character_ids.length; i++) {
                for (let x = 0; x < b5b_top_place.length; x++) {
                    let characterIcon = 0;

                    if (all_character_ids[i] == b5b_top_place[x].character_id) {

                        // Match current character with icon
                        characterIcon = (`${all_character_names[i]}.png`);

                        // Put image onto the listed item when amiibots is fixed
                        list += (
                        `<div class="list_item_short" id="list_item_searchable">
                            <img src="./images/${characterIcon}" class="list_image">
                            <p class="list_stats">
                                <i>Trainer Name:</i>    <b>${userInput}</b> </br>
                                <i id="list_item_amiibo_name">Amiibo Name:</i>     <b>${b5b_top_place[x].amiibo_name}</b> </br>
                                <i>Rating:</i>          ${b5b_top_place[x].amiibo_rating} </br>
                                <i>Total Matches:</i>   ${b5b_top_place[x].total_matches} </br>
                                <i>Character Rank:</i>   ${b5b_top_place[x].amiibo_rank} </br>
                                </br>
                            </p>
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

            for (let i = 0; i < all_character_ids.length; i++) {
                for (let x = 0; x < b5b_top_ten.length; x++) {
                    let characterIcon = 0;

                    if (all_character_ids[i] == b5b_top_ten[x].character_id) {

                        // Match current character with icon
                        characterIcon = (`${all_character_names[i]}.png`);

                        // Put image onto the listed item when amiibots is fixed
                        list += (
                        `<div class="list_item_short" id="list_item_searchable">
                            <img src="./images/${characterIcon}" class="list_image">
                            <p class="list_stats">
                                <i>Trainer Name:</i>    <b>${userInput}</b> </br>
                                <i id="list_item_amiibo_name">Amiibo Name:</i>     <b>${b5b_top_ten[x].amiibo_name}</b> </br>
                                <i>Rating:</i>          ${b5b_top_ten[x].amiibo_rating} </br>
                                <i>Total Matches:</i>   ${b5b_top_ten[x].total_matches} </br>
                                <i>Character Rank:</i>   ${b5b_top_ten[x].amiibo_rank} </br>
                                </br>
                            </p>
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
        ag_top_place = message.data.topPlaceAmiibo;
        ag_top_ten = message.data.topTenAmiibo;

        amiibo_count += (ag_top_place.length + ag_top_ten.length);

        console.log("AG top places: ", ag_top_place);
        console.log("AG top 10s: ", ag_top_ten);

        function printTopPlace () {
            // Print every amiibo onto the screen
            let content = document.getElementById('ag_top_place');
            let list = '<div class="flex_list_container">';

            for (let i = 0; i < all_character_ids.length; i++) {
                for (let x = 0; x < ag_top_place.length; x++) {
                    let characterIcon = 0;

                    if (all_character_ids[i] == ag_top_place[x].character_id) {

                        // Match current character with icon
                        characterIcon = (`${all_character_names[i]}.png`);

                        // Put image onto the listed item when amiibots is fixed
                        list += (
                        `<div class="list_item_short" id="list_item_searchable">
                            <img src="./images/${characterIcon}" class="list_image">
                            <p class="list_stats">
                                <i>Trainer Name:</i>    <b>${userInput}</b> </br>
                                <i id="list_item_amiibo_name">Amiibo Name:</i>     <b>${ag_top_place[x].amiibo_name}</b> </br>
                                <i>Rating:</i>          ${ag_top_place[x].amiibo_rating} </br>
                                <i>Total Matches:</i>   ${ag_top_place[x].total_matches} </br>
                                <i>Character Rank:</i>   ${ag_top_place[x].amiibo_rank} </br>
                                </br>
                            </p>
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

            for (let i = 0; i < all_character_ids.length; i++) {
                for (let x = 0; x < ag_top_ten.length; x++) {
                    let characterIcon = 0;

                    if (all_character_ids[i] == ag_top_ten[x].character_id) {

                        // Match current character with icon
                        characterIcon = (`${all_character_names[i]}.png`);

                        // Put image onto the listed item when amiibots is fixed
                        list += (
                        `<div class="list_item_short" id="list_item_searchable">
                            <img src="./images/${characterIcon}" class="list_image">
                            <p class="list_stats">
                                <i>Trainer Name:</i>    <b>${userInput}</b> </br>
                                <i id="list_item_amiibo_name">Amiibo Name:</i>     <b>${ag_top_ten[x].amiibo_name}</b> </br>
                                <i>Rating:</i>          ${ag_top_ten[x].amiibo_rating} </br>
                                <i>Total Matches:</i>   ${ag_top_ten[x].total_matches} </br>
                                <i>Character Rank:</i>   ${ag_top_ten[x].amiibo_rank} </br>
                                </br>
                            </p>
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