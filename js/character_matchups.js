// STARTER FUNCTION
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
window.onload = function() {
    window.localStorage.setItem('SortType', 'sort_by_alphabetical');
    highlightSortButton('sort_by_alphabetical');
    getAllCharacters();
};





// Update this to the latest date for amiibots match data stored in "./json"
const latestFile = "2023-04-16";





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
    document.getElementById('rating_ditribution_canvas').remove();
    document.getElementById('rating_history_chart_canvas').remove();

    // Load data into card
    document.getElementById('list_img').src = `images/Blank Icon.png`;
    document.getElementById('list_rating').innerText = `Rating:`;
    document.getElementById('list_win_rate').innerText = `Win Rate:`;
    document.getElementById('list_wins').innerText = `Wins:`;
    document.getElementById('list_losses').innerText = `Losses:`;
    document.getElementById('list_total_matches').innerText = `Total Matches:`;

    document.getElementById('matchup_chart_title').innerText = `Character Matchup Chart of:`;

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


    // // load the zip file from github and open it into a json
    // async function readZip() {
    //     const file = 'https://raw.githubusercontent.com/KarlTilsner/Amiibots-Statistics-Tool/main/json/AmiibotsMatchHistory.zip';
    //     const zip = new JSZip();
      
    //     const response = await fetch(file);
    //     const buffer = await response.arrayBuffer();
    //     await zip.loadAsync(buffer);
      
    //     const jsonFile = zip.file('AmiibotsMatchHistory.json');
    //     if (!jsonFile) {
    //       throw new Error('.json file not found in zip');
    //     }
      
    //     const jsonContent = await jsonFile.async('string');
    //     return jsonContent;
    // }

    // // load the unzipped json data into arrays
    // async function processData() {
    //     const jsonContent = await readZip();
    //     const data = JSON.parse(jsonContent);
        
    //     // Example: Map each element in the data array to a new object with a modified property
    //     const processedData = data.map((index) => {

    //         // if the specified character is the winner then specifiedCharacter_wonTo loser Xcharacter
    //         if (specifiedCharacter == index.winner_character_id) {
    //             specifiedCharacter_wonTo.push(index.loser_character_id);
    //             specifiedCharacter_Rating.push(index.winner_rating);
    //         }

    //         if (specifiedCharacter == index.loser_character_id) {
    //             specifiedCharacter_lostTo.push(index.winner_character_id);
    //             specifiedCharacter_Rating.push(index.loser_rating);
    //         }

    //     });
    // }



// READ IN ALL THE JSON FILES AND PUSH TO ARRAY
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
    async function processData() {
        let dateToSearch = (new Date(latestFile)).toISOString().substring(0, 10);
        let fileCount = 0;

        for (let i = 0; i < Infinity; i++) {
            dateToSearch = (new Date(new Date(latestFile).getTime() - i * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
            fileCount++;
            let temp = [];

            try {
                // console.log(dateToSearch);
                const query = await fetch(`./json/Amiibots Matches ${dateToSearch}.json`);
                const response = await query.json();
                const file = response.map(
                    async function(index) {
                        // push everything to one array
                        temp.push(index);

                        // if the specified character is the winner then specifiedCharacter_wonTo loser Xcharacter
                        if (specifiedCharacter == index.winner_character_id) {
                            specifiedCharacter_wonTo.push(index.loser_character_id);
                            specifiedCharacter_Rating.push(index.winner_rating);
                        }

                        if (specifiedCharacter == index.loser_character_id) {
                            specifiedCharacter_lostTo.push(index.winner_character_id);
                            specifiedCharacter_Rating.push(index.loser_rating);
                        }
                    }
                );
                combinedAmiibotsMatchData.push(temp);
    
            // error is called when there are no more files to search for
            } catch (error) {
                // console.log("2020-01-18");
                const query = await fetch(`./json/Amiibots Matches 2020-01-18.json`);
                const response = await query.json();
                const file = response.map(
                    async function(index) {
                        // push everything to one array
                        temp.push(index);
                        
                        // if the specified character is the winner then specifiedCharacter_wonTo loser Xcharacter
                        if (specifiedCharacter == index.winner_character_id) {
                            specifiedCharacter_wonTo.push(index.loser_character_id);
                            specifiedCharacter_Rating.push(index.winner_rating);
                        }

                        if (specifiedCharacter == index.loser_character_id) {
                            specifiedCharacter_lostTo.push(index.winner_character_id);
                            specifiedCharacter_Rating.push(index.loser_rating);
                        }
                    }
                );
                combinedAmiibotsMatchData.push(temp);
                break;
            }
        }
        console.log(`${fileCount} Files found!`);
        // console.log(combinedAmiibotsMatchData);
    }

    



// AMIIBO MATCHUP CHART CODE
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    async function createMatchupChart() {
        let totalWins = 0;
        let totalLosses = 0;
        let totalMatches = 0;
    
        // count up the wins/losses against each character
        for (let i = 0; i < all_character_ids.length; i++) {
            let counter_wonTo = 0;
            let counter_lostTo = 0;
    
            // check through the ids of all characters played against, if the id matches the current one then increase the counter
            for (let x = 0; x < specifiedCharacter_wonTo.length; x++) {
                if (all_character_ids[i] == specifiedCharacter_wonTo[x]) {
                    totalWins++;
                    counter_wonTo++;
                }
            }
    
            for (let y = 0; y < specifiedCharacter_lostTo.length; y++) {
                if (all_character_ids[i] == specifiedCharacter_lostTo[y]) {
                    totalLosses++;
                    counter_lostTo++;
                }
            }
    
            totalMatches += counter_lostTo + counter_wonTo;
    
            console.log(`${specifiedCharacter_name} (W/L) ${counter_wonTo}/${counter_lostTo} against ${all_character_names[i]}`);
    
            // push wonTo data
            if (counter_wonTo > 0) {
                matchupChart_wonTo_data.push(counter_wonTo);
            } else {matchupChart_wonTo_data.push(0);}
    
            // push lostTo data
            if (counter_lostTo > 0) {
                matchupChart_lostTo_data.push(counter_lostTo);
            } else {matchupChart_lostTo_data.push(0);}
    
            // push any character that have been faced
            if (counter_wonTo > 0 || counter_lostTo > 0) {
                matchupChart_win_rate.push(`${((counter_wonTo / (counter_wonTo + counter_lostTo)) * 100).toFixed(2)}`);
                matchupChart_characterPlayed_data.push(`${all_character_names[i]} (${((counter_wonTo / (counter_wonTo + counter_lostTo)) * 100).toFixed(2)})`);
            }
    
        }
    
        console.log(matchupChart_win_rate);
        document.getElementById('matchup_chart_title').innerText = `Character Matchup Chart of: ${specifiedCharacter_name}`;
    
        // amiibo card code
        let characterIcon = 'no icon';
    
        // calculate average rating
        // must account for sigma value
        const sum = specifiedCharacter_Rating.reduce((acc, val) => acc + val, 0);
        averageRating = sum / specifiedCharacter_Rating.length;
    
            // Match current character with icon
            for (let i = 0; i < all_character_ids.length; i++) {
                if (all_character_ids[i] == specifiedCharacter) {
                    characterIcon = (`${all_character_names[i]}.png`)
                }
            }
            
        // Load data into card
        document.getElementById('list_img').src = `images/${characterIcon}`;
        document.getElementById('list_rating').innerText = `Rating: ${averageRating}`;
        document.getElementById('list_win_rate').innerText = `Win Rate: ${((totalWins / (totalWins + totalLosses)) * 100).toFixed(2)}`;
        document.getElementById('list_wins').innerText = `Wins: ${totalWins}`;
        document.getElementById('list_losses').innerText = `Losses: ${totalLosses}`;
        document.getElementById('list_total_matches').innerText = `Total Matches: ${totalMatches}`;
    
        specifiedCharacter_Rating.sort((a, b) => b - a);
    
        window.localStorage.setItem('SortType', 'sort_by_alphabetical');
    
        drawCharts('sorted');
    } 





// HIGHEST RATING HISTORY CODE
//---------------------------------------------------------------------------------------------------------------------------------------------------------
    async function createHighestRatingHistoryChart() {
        highestRatedHistory = [];
        rating = [];
        weeks = [];
        let currentWeek = 0;

        // start from the first week of matches on amiibots and sort through each week
        // filter the specified character in each week
        // find the highest rated character and the trainer for that week and assign a colour to that amiibo
        // remember the trainer id and the amiibo id
        // go to the next week
        // find the highest rated character and the trainer for that week 
        // if the trainer id and amiibo id are different, then assign a new colour

        // when searching, check if a trainer has already been recorded
        // if they have been previously recorded then remember theier colour and assign it back to them




        // filter highest rated amiibo
        for (let i = combinedAmiibotsMatchData.length - 1; i > 0 ; i--) {
            currentWeek++;
            let highestRating = 0;
            let highestRatingindex = 0;
            for (x = combinedAmiibotsMatchData[i].length - 1; x > 0 ; x--) {
                if (combinedAmiibotsMatchData[i][x].winner_character_id == specifiedCharacter) {
                    if (combinedAmiibotsMatchData[i][x].winner_rating > highestRating) {
                        highestRating = combinedAmiibotsMatchData[i][x].winner_rating;
                        highestRatingindex = x;
                    }
                }

                if (combinedAmiibotsMatchData[i][x].loser_character_id == specifiedCharacter) {
                    if (combinedAmiibotsMatchData[i][x].loser_rating > highestRating) {
                        highestRating = combinedAmiibotsMatchData[i][x].loser_rating;
                        highestRatingindex = x;
                    }
                }
            }

            if (highestRating != 0) {
                if (highestRatedHistory.length == 0) {
                    if (combinedAmiibotsMatchData[i][highestRatingindex].winner_rating == highestRating) {
                        highestRatedHistory.push({
                            "trainer_name": combinedAmiibotsMatchData[i][highestRatingindex].winner_trainer_name,
                            "trainer_id": combinedAmiibotsMatchData[i][highestRatingindex].winner_trainer_id,
                            "amiibo_name": combinedAmiibotsMatchData[i][highestRatingindex].winner_name,
                            "unique_amiibo_id": combinedAmiibotsMatchData[i][highestRatingindex].winner_unique_amiibo_id,
                            "rating": combinedAmiibotsMatchData[i][highestRatingindex].winner_rating,
                            "current_week": currentWeek
                        });
                    }
        
                    if (combinedAmiibotsMatchData[i][highestRatingindex].loser_rating == highestRating) {
                        highestRatedHistory.push({
                            "trainer_name": combinedAmiibotsMatchData[i][highestRatingindex].loser_trainer_name,
                            "trainer_id": combinedAmiibotsMatchData[i][highestRatingindex].loser_trainer_id,
                            "amiibo_name": combinedAmiibotsMatchData[i][highestRatingindex].loser_name,
                            "unique_amiibo_id": combinedAmiibotsMatchData[i][highestRatingindex].loser_unique_amiibo_id,
                            "rating": combinedAmiibotsMatchData[i][highestRatingindex].loser_rating,
                            "current_week": currentWeek
                        });
                    }
                }

                if ((i < combinedAmiibotsMatchData.length - 1) && highestRating > highestRatedHistory[highestRatedHistory.length - 1].rating) {
                    if (combinedAmiibotsMatchData[i][highestRatingindex].winner_rating == highestRating) {
                        highestRatedHistory.push({
                            "trainer_name": combinedAmiibotsMatchData[i][highestRatingindex].winner_trainer_name,
                            "trainer_id": combinedAmiibotsMatchData[i][highestRatingindex].winner_trainer_id,
                            "amiibo_name": combinedAmiibotsMatchData[i][highestRatingindex].winner_name,
                            "unique_amiibo_id": combinedAmiibotsMatchData[i][highestRatingindex].winner_unique_amiibo_id,
                            "rating": combinedAmiibotsMatchData[i][highestRatingindex].winner_rating,
                            "current_week": currentWeek
                        });
                    }

                    if (combinedAmiibotsMatchData[i][highestRatingindex].loser_rating == highestRating) {
                        highestRatedHistory.push({
                            "trainer_name": combinedAmiibotsMatchData[i][highestRatingindex].loser_trainer_name,
                            "trainer_id": combinedAmiibotsMatchData[i][highestRatingindex].loser_trainer_id,
                            "amiibo_name": combinedAmiibotsMatchData[i][highestRatingindex].loser_name,
                            "unique_amiibo_id": combinedAmiibotsMatchData[i][highestRatingindex].loser_unique_amiibo_id,
                            "rating": combinedAmiibotsMatchData[i][highestRatingindex].loser_rating,
                            "current_week": currentWeek
                        });
                    }
                }

                if ((i < combinedAmiibotsMatchData.length - 1) && highestRating < highestRatedHistory[highestRatedHistory.length - 1].rating) {
                    highestRatedHistory.push({
                        "trainer_name": highestRatedHistory[highestRatedHistory.length - 1].trainer_name,
                        "trainer_id": highestRatedHistory[highestRatedHistory.length - 1].trainer_id,
                        "amiibo_name": highestRatedHistory[highestRatedHistory.length - 1].amiibo_name,
                        "unique_amiibo_id": highestRatedHistory[highestRatedHistory.length - 1].unique_amiibo_id,
                        "rating": highestRatedHistory[highestRatedHistory.length - 1].rating,
                        "current_week": currentWeek
                    });
                }
            }
        }

        console.log(highestRatedHistory);
        // drawCharts('sorted');






        // collect every unique trainer id
        let uniqueTrainers = [];
        for (let i = 0; i < highestRatedHistory.length; i++) {
            if (uniqueTrainers.indexOf(highestRatedHistory[i].trainer_id) === -1) {
                uniqueTrainers.push(highestRatedHistory[i].trainer_id);
            }
        }

        console.log(uniqueTrainers);

        // split trainers into their own array
        let trainerGraphRatingData = [];
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

        console.log(trainerGraphRatingData);

        // get the latest username for each unique trainer
        let latestTrainerNames = [];
        for (let i = 0; i < uniqueTrainers.length; i++) {
            let latestName = 0;
            for (let x = 0; x < highestRatedHistory.length; x++) {
                if (uniqueTrainers[i] == highestRatedHistory[x].trainer_id) {
                    latestName = highestRatedHistory[x].trainer_name;
                }
            }
            latestTrainerNames.push(latestName);
        }

        console.log(latestTrainerNames);

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




        
          

        const datasets = [];
        for (let i = 0; i < trainerGraphRatingData.length; i++) {
            let yAxis_rating = [];
            for (let x = 0; x < trainerGraphRatingData[i].length; x++) {
                yAxis_rating.push(trainerGraphRatingData[i][x]);
            }
          
            console.log(yAxis_rating);
            await getRandomColor();
          
            const newDataset = {
                label: `${latestTrainerNames[i]}`,
                data: yAxis_rating,
                backgroundColor: randomBackgroundColour,
                borderColor: randomBorderColour,
                fill: true,
                borderWidth: 1,
                pointRadius: 3,
                pointHoverRadius: 5,
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
    await processData();
    await createMatchupChart();
    await createHighestRatingHistoryChart();

}





// CREATE NEW CANVASES TO RENDER GRAPHS ON
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
function drawCharts(sorted) {
    document.getElementById('amiibo_lost_to').innerHTML = '<canvas id="amiibo_lost_to_chart_canvas"></canvas>';   
    document.getElementById('rating_ditribution').innerHTML = '<canvas id="rating_ditribution_canvas"></canvas>';
    ratingDistribution(specifiedCharacter_Rating, averageRating);
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
    document.getElementById('rating_ditribution_canvas').remove();

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