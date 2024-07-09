// STARTER FUNCTION
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
window.onload = function () {
    // Set rulesets
    window.localStorage.setItem('vanilla', '44748ebb-e2f3-4157-90ec-029e26087ad0');
    window.localStorage.setItem('b5b', '328d8932-456f-4219-9fa4-c4bafdb55776');
    window.localStorage.setItem('ag', 'af1df0cd-3251-4b44-ba04-d48de5b73f8b');

    buttonHighlight('start');
    main();
};





// HIGHLIGHT RANK TOOL RULESET BUTTONS
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
function buttonHighlight(start, button_id) {
    if (start == 'start') {
        try {
            // Highlight ruleset buttons
            let highlightRulesetButton = window.localStorage.getItem('Rank Tool Ruleset');
            document.getElementById(`ruleset_${highlightRulesetButton}`).setAttribute("style", `background-color: rgba(220, 220, 220, 0.3)`);
        } catch (err) {
            window.localStorage.setItem('Rank Tool Ruleset', 'vanilla');
            let highlightRulesetButton = window.localStorage.getItem('Rank Tool Ruleset');
            document.getElementById(`ruleset_${highlightRulesetButton}`).setAttribute("style", `background-color: rgba(220, 220, 220, 0.3)`);
            console.log("Ruleset was empty");
        }
    }

    if (start != 'start') {
        try {
            let highlightRulesetButton = window.localStorage.getItem('Rank Tool Ruleset');
            document.getElementById(`ruleset_${highlightRulesetButton}`).removeAttribute("style", `background-color: rgba(220, 220, 220, 0.3)`);

            document.getElementById(`ruleset_${button_id}`).setAttribute("style", `background-color: rgba(220, 220, 220 , 0.3)`);
            window.localStorage.setItem('Rank Tool Ruleset', `${button_id}`);
            console.log('Ruleset is: ' + button_id);
        } catch (err) {
            document.getElementById(`ruleset_${button_id}`).setAttribute("style", `background-color: rgba(220, 220, 220 , 0.3)`);
            window.localStorage.setItem('Rank Tool Ruleset', `${button_id}`);
            console.log('Ruleset is: ' + button_id);
        }

        window.location.reload();
    }
}





let all_characters = [];
let all_trainer_data = [];

// const ruleset_id = '44748ebb-e2f3-4157-90ec-029e26087ad0';      // vanilla ruleset
// const ruleset_id = '328d8932-456f-4219-9fa4-c4bafdb55776';      // b5b ruleset
// const ruleset_id = 'af1df0cd-3251-4b44-ba04-d48de5b73f8b';      // ag ruleset

let ruleset_id = null;





// GET ALL TRAINERS AND THEIR AMIIBO AND GIVE THEM A SCORE BASED ON AMIIBO RANKS
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
async function main() {
    // Getting ruleset
    let ruleset_input = window.localStorage.getItem("Rank Tool Ruleset");
    ruleset_id = window.localStorage.getItem(ruleset_input);

    // get all character names and ids
    async function get_all_characters() {
        const url = `https://www.amiibots.com/api/utility/get_all_characters`;
        const query = await fetch(url);
        const response = await query.json();
        const data = response.data.map(index => index);

        console.log("Got all character names and ids");
        return data;
    }
    all_characters = await get_all_characters();

    // get all amiibo
    async function get_all_amiibo() {
        async function rank_tool_leaderboard_count() {
            // Check how many amiibo to search for on the leaderboard for vanilla
            let queryURL = `https://www.amiibots.com/api/amiibo?per_page=1&matchmaking_status=ACTIVE,STANDBY&ruleset_id=${ruleset_id}`;

            const query = await fetch(queryURL);
            const response = await query.json();
            const per_page = response.total;
            return per_page;
        }

        const per_page = await rank_tool_leaderboard_count();

        const url = `https://www.amiibots.com/api/amiibo?per_page=${per_page}&matchmaking_status=ACTIVE,STANDBY&ruleset_id=${ruleset_id}`;
        const query = await fetch(url);
        const response = await query.json();

        const data = response.data.map(index => index);

        // const data = [];
        // response.data.map(index => {
        //     if (index.total_matches >= 30) {
        //         data.push(index);
        //     }
        // });

        console.log("Got all amiibo");
        return data;
    }
    const all_amiibo = await get_all_amiibo();

    // rank each amiibo
    for (let i = 0; i < all_characters.length; i++) {
        let rank = 1;
        for (let x = 0; x < all_amiibo.length; x++) {
            if (all_characters[i].id == all_amiibo[x].playable_character_id) {
                all_amiibo[x].character_rank = rank;
                rank++;
            }
        }
    }

    // get all unique trainers
    const unique_trainers = [];
    all_amiibo.map(index => {
        if (!unique_trainers.some(trainer => trainer.id == index.user.id)) {
            unique_trainers.push({
                name: index.user.twitch_user_name,
                id: index.user.id
            });
        }
    });

    // create an object for each trainer with their amiibo 
    unique_trainers.map(trainer => {

        const trainer_data = {
            name: trainer.name,
            id: trainer.id,
            amiibo: []
        };

        const trainer_amiibo = [];

        all_amiibo.map(index => {
            if (trainer.id == index.user.id && index.character_rank <= 10) {
                trainer_amiibo.push({
                    name: index.name,
                    id: index.id,
                    character_rank: index.character_rank,
                    character: index.playable_character_id,
                    selection_status: index.match_selection_status
                })
            }
        });

        // Sort arrays
        trainer_amiibo.sort(function (a, b) {
            return ((a.character_rank < b.character_rank) ? -1 : ((a.character_rank == b.character_rank)) ? 0 : 1);
        });

        trainer_amiibo.map(amiibo => {
            if (!trainer_data.amiibo.some(highest_character => highest_character.character == amiibo.character)) {
                amiibo.highest = true;
                trainer_data.amiibo.push(amiibo);
            } else {
                amiibo.highest = false;
                trainer_data.amiibo.push(amiibo);
            }
        });

        all_trainer_data.push(trainer_data);
    });

    // Get the points assigned to each place
    async function get_points() {
        const url = `./json/points_system.json`;
        const query = await fetch(url);
        const data = await query.json();

        console.log("Got points system");
        return data;
    }
    const points_system = await get_points();

    // Give trainers their score
    all_trainer_data.map(trainer => {
        let trainer_score = 0;

        trainer.amiibo.map(amiibo => {
            if (amiibo.highest == true) {
                trainer_score += points_system[amiibo.character_rank];
            } else {
                trainer_score += 1;
            }

        });

        trainer.trainer_score = trainer_score;
    });

    // Sort arrays
    all_trainer_data.sort((a, b) => b.trainer_score - a.trainer_score);

    // Rank trainers
    let rank = 1;
    let previousScore = null;

    all_trainer_data.forEach((trainer, index) => {
        if (previousScore === trainer.trainer_score) {
            trainer.rank = rank;
        } else {
            previousScore = trainer.trainer_score;
            rank = index + 1;
            trainer.rank = rank;
        }
    });

    console.log("🚀 ~ main ~ all_trainer_data:", all_trainer_data);

    await printCharacterLeaderboard();
}




// DISPLAY ALL TRAINERS WITH A SCORE ONTO THE DOM
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
async function printCharacterLeaderboard() {

    let content = document.getElementById('test');
    let list = '<div class="list_item_container">';

    let username_input = document.getElementById('trainer_name');
    let username_filter = username_input.value.toUpperCase();

    for (let i = 0; i < all_trainer_data.length; i++) {

        if (all_trainer_data[i].amiibo.length > 0 && all_trainer_data[i].name.toUpperCase().indexOf(username_filter) > -1) {
            // display character icons with their rank
            let dropdown_list = '<div class="tier_list_container" style="gap: 0px;">';
            for (let x = 0; x < all_trainer_data[i].amiibo.length; x++) {

                all_characters.map(character => {
                    if (character.id == all_trainer_data[i].amiibo[x].character && all_trainer_data[i].amiibo[x].highest == true) {

                        dropdown_list += (
                            `<div class="tier_list_item" onclick="clickListItem('${character.id}', '${ruleset_id}')">
                                <img src="images/${character.name}.png" class="tier_list_image">
                                <div class="tier_list_text_box">
                                    <p class="tier_list_text">${all_trainer_data[i].amiibo[x].character_rank}</p>
                                </div>
                            </div>`
                        );

                    }
                });
            }
            dropdown_list += "</div>";

            // display trainer name and relavent info
            let uniqueAmiibo = 0;
            all_trainer_data[i].amiibo.map(amiibo => {
                if (amiibo.highest == true) {
                    uniqueAmiibo++;
                }
            });

            list += (
                `<div class="INACTIVE" style="width: 100%;">
                <div class="list_item" id="list_item_searchable">
                    <div class="list_stats_container" onclick="updateTrainerStatsTrainerID('${all_trainer_data[i].id}');">
                        <div class="list_stats">
                            <h1>${all_trainer_data[i].rank}. ${all_trainer_data[i].name}</h1>
                        </div>

                        <div class="list_stats">
                            <h2>Score:</h2>
                            <h1>${all_trainer_data[i].trainer_score} pts</h1>
                        </div>

                        <div class="list_stats">
                            <h2>Leaderboard Amiibo:</h2>
                            <h1>${all_trainer_data[i].amiibo.length}</h1>
                        </div>
                    </div>
                </div>

                <div class="trainer_rank_unique_amiibo" style="padding: 1rem; padding-top: 0;">
                    <h3>Highest Unique Characters (${uniqueAmiibo}):</h3>
                    <div>${dropdown_list}</div>
                </div>
            </div>`
            );
        }
    }

    list += "</div>";
    content.innerHTML = list;
}





// CLICKABLE AMIIBO ICONS
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
async function clickListItem(id, ruleset_id) {
    window.open(`https://www.amiibots.com/leaderboard?characterId=${id}&rulesetId=${ruleset_id}`);
}





// UPDATE TRAINER ID IN TRAINER STATS
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
async function updateTrainerStatsTrainerID(trainerID) {
    async function setStorage() {
        localStorage.setItem('trainer_stats_trainer_id', trainerID);
    }
    await setStorage();

    window.location.href = "../trainer_stats.html";
}