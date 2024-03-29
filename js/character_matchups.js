// STARTER FUNCTION
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
window.onload = function() {
    window.localStorage.setItem('SortType', 'sort_by_alphabetical');
    highlightSortButton('sort_by_alphabetical');
    getAllCharacters();
};





// GLOBAL PARAMETERS
//---------------------------------------------------------------------------------------------------------------------------------------------------------  
let specifiedCharacter_name = '???';
let specifiedCharacter_Rating = [];

let matchupChart_wonTo_data = [];
let matchupChart_lostTo_data = [];
let matchupChart_characterPlayed_data = [];
let matchupChart_win_rate = [];

let all_character_names = [];
let all_character_ids = [];

let averageRating = 0;

// Chart Theme Colours
let primary_background_colour =     'rgba(255, 99, 132, 0.2)';      // red
let primary_border_colour =         'rgba(255, 99, 132, 1)';        // red
let secondary_background_colour =   'rgba(170, 200, 100, 0.2)';     // green
let secondary_border_colour =       'rgba(170, 200, 100, 1)';       // green

let highestRatedHistory = [];
let xAxis_weeks = [];





// GET ALL AMIIBO NAMES AN ID'S AND ADD THEM INTO THE DROPDOWN
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
async function getAllCharacters() {
    // Get all names and id's of amiibo
    const all_characters_query = await fetch('https://www.amiibots.com/api/utility/get_all_characters');
    const all_characters_response = await all_characters_query.json();

    const all_characters_data = all_characters_response.data.map(
        function(index) {
            all_character_names.push(index.name);
            all_character_ids.push(index.id);

            // Add characters to dropdown
            const dropdown = document.getElementById("selectCharacterDropdown");
            const newOption = document.createElement("option");
            newOption.value = `${index.name}`;
            newOption.id = `${index.id}`;
            newOption.className = 'dropdownMenuOption';
            const optionTextNode = document.createTextNode(`${index.name}`);
            newOption.appendChild(optionTextNode);
            dropdown.appendChild(newOption);
    });
}





// AMIIBO MATCHUP CHART DATA
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
async function characterMatchup(selectedOption) {

    let combinedAmiibotsMatchData = [];

    // reset elements if this function is called
    document.getElementById('amiibo_lost_to_chart_canvas').remove();
    document.getElementById('rating_history_chart_canvas').remove();

    // // Load data into card
    document.getElementById('list_img').src = `images/Blank Icon.png`;
    document.getElementById('list_rating').innerText = `--.--`;
    document.getElementById('list_win_rate').innerText = `--.--%`;
    document.getElementById('list_wins').innerText = `----`;
    document.getElementById('list_losses').innerText = `----`;
    document.getElementById('list_total_matches').innerText = `----`;

    highlightSortButton('sort_by_alphabetical');

    const specifiedCharacter = selectedOption.options[selectedOption.selectedIndex].id;
    specifiedCharacter_name = '???';
    specifiedCharacter_Rating = [];
    matchupChart_characterPlayed_data = [];
    matchupChart_wonTo_data = [];
    matchupChart_lostTo_data = [];
    matchupChart_win_rate = [];

    for (let i = 0; i < all_character_ids.length; i++) {
        if (all_character_ids[i] == specifiedCharacter) {
            specifiedCharacter_name = all_character_names[i];
        }
    }

    let specifiedCharacter_wonTo = [];
    let specifiedCharacter_lostTo = [];





// AMIIBO MATCHUP CHART CODE
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    async function createMatchupChart() {

        // Push specific amiibo data into array for matchup chart
        const matchups_query = await fetch('./json/AmiibotsMatchupData.json');
        const matchups_data = await matchups_query.json();
        console.log("🚀 ~ createMatchupChart ~ matchups_data:", matchups_data);

        // Data for amiibo card
        let specified_character_rating = 0;
        let specified_character_wins = 0;
        let specified_character_losses = 0;

        matchups_data.map(function(index) {
            if (index.id == specifiedCharacter) {
                index.data.map(element => {
                    specified_character_wins += element.wins;
                    specified_character_losses += element.losses;
                    
                    matchupChart_wonTo_data.push(element.wins);
                    matchupChart_lostTo_data.push(element.losses);

                    matchupChart_characterPlayed_data.push(`${element.name} (${((element.wins / (element.wins + element.losses)) * 100).toFixed(2)})`);
                    matchupChart_win_rate.push(`${((element.wins / (element.wins + element.losses)) * 100).toFixed(2)}`);

                });
            }
        });

        document.getElementById('matchup_chart_title').innerText = `Character Matchup Chart of: ${specifiedCharacter_name}`;
    
        // Match current character with icon
        let characterIcon = 'no icon';
        for (let i = 0; i < all_character_ids.length; i++) {
            if (all_character_ids[i] == specifiedCharacter) {
                characterIcon = (`${all_character_names[i]}.png`)
            }
        }
  
        // Load data into card
        document.getElementById('list_img').src = `images/${characterIcon}`;
        document.getElementById('list_win_rate').innerText = `${((specified_character_wins / (specified_character_wins + specified_character_losses)) * 100).toFixed(2)}%`;
        document.getElementById('list_wins').innerText = specified_character_wins;
        document.getElementById('list_losses').innerText = specified_character_losses;
        document.getElementById('list_total_matches').innerText = specified_character_wins + specified_character_losses;

        window.localStorage.setItem('SortType', 'sort_by_alphabetical');
    
        drawCharts('sorted');
    } 





// HIGHEST RATING HISTORY CODE
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    async function createHighestRatingHistoryChart() {
        document.getElementById('rating_history_chart_title').innerText = `Rating History of: ${specifiedCharacter_name}`;
        highestRatedHistory = [];

        // Push specified amiibo data into array for rating history chart
        const rating_history_query = await fetch(`./json/Rating History/${specifiedCharacter_name} Rating History.json`);
        const rating_history_data = await rating_history_query.json();
        console.log("🚀 ~ createHighestRatingHistoryChart ~ rating_history_data:", rating_history_data);

        // get highest rating
        let highest_rating = 0;
        rating_history_data.rating_history.map(index => {
            if (index.rating > highest_rating) {
                highest_rating = index.rating;
                document.getElementById('list_rating').innerText = highest_rating.toFixed(3);
            }
            highestRatedHistory.push(index);
        });

        // get most dominant player for the character
        function topPlayers() {    
            const trainerIdCounts = rating_history_data.rating_history.reduce((counts, item) => {
                const trainerId = item.trainer_id;
                const trainerName = item.trainer_name;
            
                if (counts[trainerId]) {
                if (trainerName !== counts[trainerId].trainerName) {
                    counts[trainerId].trainer_name = trainerName; // Update trainerName
                }
                counts[trainerId].days++;
                } else {
                counts[trainerId] = { trainer_name: trainerName, days: 1 };
                }
            
                return counts;
            }, {});

            const sortedResults = Object.values(trainerIdCounts);
            sortedResults.sort((a, b) => b.days - a.days);
            console.log("Tally of trainer_ids:", sortedResults);

            document.getElementById('list_longest_streak_trainer').innerText = sortedResults[0].trainer_name;
            document.getElementById('list_longest_streak').innerText = `~${sortedResults[0].days} Days`;


            let content = document.getElementById('dominantPlayerDropdownContent');
            content.innerHTML = `<div class="flex_list_container" id="dominantPlayerDropdownContent"></div>`;
            
            sortedResults.map(index => {
                content.innerHTML += (
                    `<div class="list_item" id="list_item_searchable">
                        <div class="list_stats_container">
                            <div class="list_stats">
                                <h1>${index.trainer_name}</h1>
                            </div>
        
                            <div class="list_stats">
                                <h2>Percentage of history</h2>
                                <h1>~${((index.days / highestRatedHistory.length) * 100).toFixed(2)}%</h1>
                            </div>
        
                            <div class="list_stats">
                                <h2>Time as highest trainer</h2>
                                <h1>~${index.days} Days</h1>
                            </div>
                        </div>
        
                    </div>`
                );
            });






















        }
        topPlayers();

        // collect every unique trainer id
        let uniqueTrainers = [];
        for (let i = 0; i < highestRatedHistory.length; i++) {
            if (uniqueTrainers.indexOf(highestRatedHistory[i].trainer_id) === -1) {
                uniqueTrainers.push(highestRatedHistory[i].trainer_id);
            }
        }

        // split trainers into their own array
        const trainerGraphRatingData = [];
        for (let i = 0; i < uniqueTrainers.length; i++) {
            let temp = [];
            for (let x = 0; x < highestRatedHistory.length; x++) {
                if (uniqueTrainers[i] == highestRatedHistory[x].trainer_id) {
                    temp.push(highestRatedHistory[x].rating);
                }

                if (uniqueTrainers[i] != highestRatedHistory[x].trainer_id) {
                    temp.push(null);
                }
            }
            trainerGraphRatingData.push(temp);
        }

        // get the latest username for each unique trainer
        const latestTrainerNames = [];
        for (let i = 0; i < uniqueTrainers.length; i++) {
            let latestName = 0;
            for (let x = 0; x < highestRatedHistory.length; x++) {
                if (uniqueTrainers[i] == highestRatedHistory[x].trainer_id) {
                    latestName = highestRatedHistory[x].trainer_name;
                }
            }
            latestTrainerNames.push(latestName);
        }

        // push data for the graph to read into arrays
        xAxis_weeks = [];
        for (let i = 0; i < highestRatedHistory.length; i++) {
            xAxis_weeks.push(highestRatedHistory[i].current_week);
        }

        // get random colours for each trainer
        let randomBorderColour = 0;
        let randomBackgroundColour = 0;
        async function getRandomColor() {
            const r = Math.floor(Math.random() * 256); // Random value for red (0-255)
            const g = Math.floor(Math.random() * 256); // Random value for green (0-255)
            const b = Math.floor(Math.random() * 256); // Random value for blue (0-255)
          
            randomBorderColour = `rgba(${r}, ${g}, ${b}, 1)`
            randomBackgroundColour = `rgba(${r}, ${g}, ${b}, 0.2)`;
        }

        // Create datasets for the chart
        const datasets = [];
        for (let i = 0; i < trainerGraphRatingData.length; i++) {
            let yAxis_rating = [];
            for (let x = 0; x < trainerGraphRatingData[i].length; x++) {
                yAxis_rating.push(trainerGraphRatingData[i][x]);
            }
          
            // console.log(yAxis_rating);
            await getRandomColor();
          
            const newDataset = {
                label: `${latestTrainerNames[i]}`,
                data: yAxis_rating,
                backgroundColor: randomBackgroundColour,
                borderColor: randomBorderColour,
                fill: true,
                borderWidth: 1,
                pointRadius: 1,
                pointHoverRadius: 1,
            };
          
            datasets.push(newDataset);
        }

        let test = [];
        for (let i = 0; i < highestRatedHistory.length; i++) {
            test.push(highestRatedHistory[i].rating)
        }

        const newDataset = {
            label: `Highest Rating`,
            data: test,
            backgroundColor: `rgba(75, 75, 75, 0.2)`,
            borderColor: `rgba(255, 255, 255, 1)`,
            fill: true,
            borderWidth: 1,
            pointRadius: 0.1,
            pointHoverRadius: 0.1,
        };
      
        datasets.push(newDataset);

        drawRatingHistory(datasets);
    }





// RUN THE FUNCTIONS TO PUT DATA ONTO THE SCREEN
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    await createMatchupChart();
    await createHighestRatingHistoryChart();

}





// CREATE NEW CANVASES TO RENDER GRAPHS ON
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
function drawCharts(sorted) {
    document.getElementById('amiibo_lost_to').innerHTML = '<canvas id="amiibo_lost_to_chart_canvas"></canvas>';   
    characterMatchupChart(sorted);
}

function drawRatingHistory(datasets) {
    document.getElementById('rating_history').innerHTML = '<canvas id="rating_history_chart_canvas"></canvas>';  
    RatingHistoryChart(datasets);
}





// COPY CANVAS TO CLIPBOARD
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function copyCanvas(targetCanvas) {
    const canvas = document.getElementById(`${targetCanvas}`);

    canvas.toBlob(function(blob) { 
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item]); 
    });

}





// SORT MATCHUP CHART
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function sortMatchupChartData(sortType) {
    document.getElementById('amiibo_lost_to_chart_canvas').remove();

    if (sortType === 'alphabetical') {
        // Sort array from highest to lowest
        // Combine arrays
        let combineSort = [];
        for (let i = 0; i < matchupChart_characterPlayed_data.length; i++) {
            combineSort.push({
                'name': matchupChart_characterPlayed_data[i], 
                'lostTo': matchupChart_lostTo_data[i], 
                'defeated': matchupChart_wonTo_data[i], 
                'winRate': matchupChart_win_rate[i]
            });
        }

        // Sort arrays
        combineSort.sort(function(a, b) {
            return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
        });

        // Seperate data into arrays
        for (let i = 0; i < combineSort.length; i++) {
            matchupChart_characterPlayed_data[i] = combineSort[i].name;
            matchupChart_lostTo_data[i] = combineSort[i].lostTo;
            matchupChart_wonTo_data[i] = combineSort[i].defeated;
            matchupChart_win_rate[i] = combineSort[i].winRate;
        }

        // Fix 99.99
        for (let i = 0; i < combineSort.length; i++) {
            if (matchupChart_win_rate[i] == "99.99")
            matchupChart_win_rate[i] = "100.00";
        }
    }

    if (sortType === 'winRate') {
        // Sort array from lowest to highest
        // Combine arrays
        let combineSort = [];
        for (let i = 0; i < matchupChart_characterPlayed_data.length; i++) {
            combineSort.push({  'name': matchupChart_characterPlayed_data[i], 
                                'lostTo': matchupChart_lostTo_data[i], 
                                'defeated': matchupChart_wonTo_data[i], 
                                'winRate': Number(matchupChart_win_rate[i])
                            });
        }

        // Sort arrays
        combineSort.sort(function(a, b) {
            return ((a.winRate < b.winRate) ? -1 : ((a.winRate == b.winRate)) ? 0 : 1);
        });

        // Seperate data into arrays
        for (let i = 0; i < combineSort.length; i++) {
            matchupChart_characterPlayed_data[i] = combineSort[i].name;
            matchupChart_lostTo_data[i] = combineSort[i].lostTo;
            matchupChart_wonTo_data[i] = combineSort[i].defeated;
            matchupChart_win_rate[i] = combineSort[i].winRate;
        }

        // Fix 99.99
        for (let i = 0; i < combineSort.length; i++) {
            if (matchupChart_win_rate[i] == "99.99")
            matchupChart_win_rate[i] = "100.00";
        }
    }

    console.log(matchupChart_characterPlayed_data);
    drawCharts('sorted');
}





// HIGHLIGHT SORT BUTTON
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
function highlightSortButton(button_id) {
    let sort_type = window.localStorage.getItem('SortType');
    document.getElementById(`${sort_type}`).removeAttribute("style", `background-color: rgba(220, 220, 220 , 0.3)`);

    document.getElementById(`${button_id}`).setAttribute("style", `background-color: rgba(220, 220, 220 , 0.3)`);
    window.localStorage.setItem('SortType', `${button_id}`);
}




// Open or close the dropdowwn with the other dominant players
function listDominantPlayers() {
    var element = document.getElementById("dominantPlayerDropdown");
    if (element.style.display === "none") {
        element.style.display = "block"; // or "inline" or any other display property you want
    } else {
        element.style.display = "none";
    }
}