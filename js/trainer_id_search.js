let unique_trainers = [];





// GET ALL TRAINERS AND THEIR AMIIBO AND GIVE THEM A SCORE BASED ON AMIIBO RANKS
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
async function main() {
    const ruleset_id = document.getElementById("selectTierDropdown").value;
    console.log(ruleset_id);

    // get all amiibo
    async function get_all_amiibo() {
        console.log("Getting trainers");
        const url = `https://www.amiibots.com/api/amiibo?per_page=${Number.MAX_SAFE_INTEGER}&ruleset_id=${ruleset_id}`;
        const query = await fetch(url);
        const response = await query.json();

        const data = response.data.map(index => index);

        console.log("Got all trainers");
        return data;
    }
    const all_amiibo = await get_all_amiibo();

    // get all unique trainers
    all_amiibo.map(index => {
        if (!unique_trainers.some(trainer => trainer.id == index.user.id)) {
            unique_trainers.push({
                name: index.user.twitch_user_name,
                id: index.user.id
            });
        }
    });

    console.log(unique_trainers);

    await printCharacterLeaderboard();
}





// DISPLAY ALL TRAINERS WITH A SCORE ONTO THE DOM
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
async function printCharacterLeaderboard() {

    let content = document.getElementById('all_trainer_ids');
    let list = '<div class="list_item_container">';

    let username_input = document.getElementById('trainer_name');
    let username_filter = username_input.value.toUpperCase();

    unique_trainers.map(trainer => {
        if (trainer.name.toUpperCase().indexOf(username_filter) > -1) {
            list += (
                `<div class="INACTIVE highlight_hover" style="width: 100%;" onclick="updateTrainerStatsTrainerID('${trainer.id}');">
                    <h1 style="padding-left: 2rem;">${trainer.name}</h1>
                    <h2 style="padding-left: 2rem;">${trainer.id}</h2>
                </div>`
            );
        }
    });

    list += "</div>";
    content.innerHTML = list;
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