//                                                              GLOBAL PARAMETERS
//---------------------------------------------------------------------------------------------------------------------------------------------------------  
let specifiedCharacter_name = '???';
let specifiedCharacter_Rating = [];
let winRate = '???%';
let matchupChart_wonTo_data = [];
let matchupChart_lostTo_data = [];
let matchupChart_characterPlayed_data = [];

let all_character_names = [];
let all_character_ids = [];

let averageRating = 0;

// Chart Theme Colours
let primary_background_colour =     'rgba(255, 99, 132, 0.2)';      // Red
let primary_border_colour =         'rgba(255, 99, 132, 1)';        // red
let secondary_background_colour =   'rgba(170, 200, 100, 0.2)';     // green
let secondary_border_colour =       'rgba(170, 200, 100, 1)';       // green

// Tier List
const tiers = ['U TIER', 'S TIER', 'A+ TIER', 'A TIER', 'B+ TIER', 'B TIER', 'C+ TIER', 'C TIER', 'D+ TIER'];
const tier_list = [ 'U TIER', 'Incineroar', 
                    'S TIER', 'Kazuya', 'Min Min', 'King K. Rool', 'Terry', 'Bowser', 'Byleth', 
                    'A+ TIER', 'Mii Gunner', 'King Dedede', 'Ridley', 'Ness', 'Link', 
                    'A TIER', 'Olimar', 'Lucas', 'Hero', 'Ganondorf', 'Zelda', 'Piranha Plant', 'Snake', 'Mii Brawler', 'Captain Falcon', 'Mii Swordfighter', 'Donkey Kong', 'Pit', 'Dark Pit', 'Banjo & Kazooie', 
                    'B+ TIER', 'Sephiroth', 'Steve', 'Kirby', 'Dr. Mario', 'Ike', 'Pokemon Trainer', 'Shulk', 'Chrom', 'Little Mac', 'Cloud', 'Yoshi', 'Roy', 'Ryu', 
                    'B TIER', 'Luigi', 'Robin', 'Mega Man', 'Corrin', 'Isabelle', 'Meta Knight', 'Wolf', 'Lucina', 'Joker', 'Pac-Man', 'Palutena', 'Falco', 'Wario', 'Samus', 'Dark Samus', 'Bowser Jr.', 
                    'C+ TIER', 'Villager', 'Mewtwo', 'Ice Climbers', 'Marth', 'Duck Hunt', 'Lucario', 'Mario', 'Pikachu', 'Wii Fit Trainer', 'Greninja', 'Sonic', 'Simon', 'Richter', 'Rosalina & Luma', 
                    'C TIER', 'Peach', 'Daisy', 'Diddy Kong', 'Toon Link', 'R.O.B.', 'Young Link', 'Inkling', 'Pichu', 'Mr. Game & Watch', 'Ken', 
                    'D+ TIER', 'Jigglypuff', 'Sheik', 'Fox', 'Zero Suit Samus', 'Bayonetta'
                ];





async function getAllCharacters() {
    // get all names and id's of amiibo
    const all_characters_query = await fetch('https://www.amiibots.com/api/utility/get_all_characters');
    const all_characters_response = await all_characters_query.json();

    const all_characters_data = all_characters_response.data.map(
        function(index) {
            all_character_names.push(index.name);
            all_character_ids.push(index.id);

            const dropdown = document.getElementById("selectCharacterDropdown");
            const newOption = document.createElement("option");
            newOption.value = `${index.name}`;
            newOption.id = `${index.id}`;
            const optionTextNode = document.createTextNode(`${index.name}`);
            newOption.appendChild(optionTextNode);
            dropdown.appendChild(newOption);
    });
}





//                                                              AMIIBO MATCHUP CHART DATA
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
async function characterMatchup(selectedOption) {

    document.getElementById('amiibo_lost_to_chart_canvas').remove();
    document.getElementById('rating_ditribution_canvas').remove();

    const specifiedCharacter = selectedOption.options[selectedOption.selectedIndex].id;
    specifiedCharacter_name = '???';
    specifiedCharacter_Rating = [];
    winRate = '???%';
    matchupChart_wonTo_data = [];
    matchupChart_lostTo_data = [];
    matchupChart_characterPlayed_data = [];

    for (let i = 0; i < all_character_ids.length; i++) {
        if (all_character_ids[i] == specifiedCharacter) {
            specifiedCharacter_name = all_character_names[i];
        }
    }




    async function readZip() {
        const file = 'https://raw.githubusercontent.com/KarlTilsner/Amiibots-Statistics-Tool/main/json/AmiibotsMatchHistory.zip';
        const zip = new JSZip();
      
        const response = await fetch(file);
        const buffer = await response.arrayBuffer();
        await zip.loadAsync(buffer);
      
        const jsonFile = zip.file('AmiibotsMatchHistory.json');
        if (!jsonFile) {
          throw new Error('.json file not found in zip');
        }
      
        const jsonContent = await jsonFile.async('string');
        return jsonContent;
      }



      let specifiedCharacter_wonTo = [];
      let specifiedCharacter_lostTo = [];



      async function processData() {
        const jsonContent = await readZip();
        const data = JSON.parse(jsonContent);
        
        // Example: Map each element in the data array to a new object with a modified property
        const processedData = data.map((index) => {

            // if the specified character is the winner then specifiedCharacter_wonTo loser Xcharacter
            if (specifiedCharacter == index.winner_character_id) {
                specifiedCharacter_wonTo.push(index.loser_character_id);
                specifiedCharacter_Rating.push(index.winner_rating);
            }

            if (specifiedCharacter == index.loser_character_id) {
                specifiedCharacter_lostTo.push(index.winner_character_id);
                specifiedCharacter_Rating.push(index.loser_rating);
            }

        });
        
        // Do something with the processed data
        console.log(processedData);
      }

      await processData();



    // // fetch AmiibotsMatchHistory.json and insert the character_id of the winner into an array and the loser into an array.
    // let specifiedCharacter_wonTo = [];
    // let specifiedCharacter_lostTo = [];

    // const allMatchesResponse = await processData();
    // // const allMatchesResponse = await allMatchesQuery.json();
    // const allMatchesData = allMatchesResponse.map(
    //     function(index) {

    //         // if the specified character is the winner then specifiedCharacter_wonTo loser Xcharacter
    //         if (specifiedCharacter == index.winner_character_id) {
    //             specifiedCharacter_wonTo.push(index.loser_character_id);
    //             specifiedCharacter_Rating.push(index.winner_rating);
    //         }

    //         if (specifiedCharacter == index.loser_character_id) {
    //             specifiedCharacter_lostTo.push(index.winner_character_id);
    //             specifiedCharacter_Rating.push(index.loser_rating);
    //         }

    // });

    // add a matchup chart sorting method here
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
            matchupChart_characterPlayed_data.push(`${all_character_names[i]} (${((counter_wonTo / (counter_wonTo + counter_lostTo)) * 100).toFixed(2)})`);
        }

    }

    document.getElementById('matchup_chart_title').innerText = `Character Matchup Chart of: ${specifiedCharacter_name}`;

    





    // amiibo card code
    let content = document.getElementById('test');
    let list = '<div class="flex_list_container">';
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
                
                // Put image onto the listed item when amiibots is fixed
                list += (
                `<div class="list_item_short" id="list_item_searchable">
                    <img src="images/${characterIcon}" class="list_image">
                    <p class="list_stats">
                        <i>Rating:</i>          ${averageRating} </br>
                        <i>Win Rate:</i>        ${((totalWins / (totalWins + totalLosses)) * 100).toFixed(2)} </br>
                        <i>Wins:</i>            ${totalWins} </br>
                        <i>Losses:</i>          ${totalLosses} </br>
                        <i>Total Matches:</i>   ${totalMatches} </br>
                        </br>
                    </p>
                </div>`
                );
            

    list += "</div>";
    content.innerHTML = list;



    specifiedCharacter_Rating.sort((a, b) => b - a);

    drawCharts('sorted');

}





function drawCharts(sorted) {
    document.getElementById('amiibo_lost_to').innerHTML = '<canvas id="amiibo_lost_to_chart_canvas"></canvas>';   
    document.getElementById('rating_ditribution').innerHTML = '<canvas id="rating_ditribution_canvas"></canvas>'; 
    ratingDistribution(specifiedCharacter_Rating, averageRating);
    characterMatchupChart(sorted);
}





//                                                              VERSION NUMBER
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function copyCanvas(targetCanvas) {
    const canvas = document.getElementById(`${targetCanvas}`);



    canvas.toBlob(function(blob) { 
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item]); 
    });

}






//                                                              VERSION NUMBER
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function versionNo() {
    document.getElementById('versionNo').innerHTML = "matchup_tool_alpha";
}



