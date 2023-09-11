// Queries all character names and IDs and loads them into an object
//---------------------------------------------------------------------------------------------------------------------------------------------------------
async function get_all_characters_search_history() {
    const url = `https://www.amiibots.com/api/utility/get_all_characters`;
    const query = await fetch(url);
    const response = await query.json();
    const data = response.data.map(index => index);
    
    console.log("Got all character names and ids");
    return data;
}





// Queries all rulesets and load them into an object
//---------------------------------------------------------------------------------------------------------------------------------------------------------
async function get_rulesets() {
    const url = `https://www.amiibots.com/api/rulesets/public_rulesets`;
    const query = await fetch(url);
    const response = await query.json();
    const data = response.data.map(index => index);
    
    console.log("Got rulesets");
    return data;
}





// Adds new amiibo to the search history in local storage
//---------------------------------------------------------------------------------------------------------------------------------------------------------
async function addAmiiboToSearchHistory(trainer_name, amiibo_name, amiibo_id, character_id, ruleset, date_searched) {

    const newSearchItem = {
        trainer_name: trainer_name,
        amiibo_name: amiibo_name,
        amiibo_id: amiibo_id,
        character_id: character_id,
        ruleset: ruleset,
        date_searched: date_searched
    }

    // check if not null before pushing new search item
    const storedSearchHistory = JSON.parse(localStorage.getItem('Search History'));
    if (storedSearchHistory != null) {
        
        let match = false;

        // If amiibo is already in search history, update its date
        storedSearchHistory.map(index => {
            if (index.amiibo_id == amiibo_id) {
                index.date_searched = date_searched;
                match = true;
            }
        });

        // If amiibo is not in search history, add new amiibo
        if (match == false) {
            storedSearchHistory.push(newSearchItem);
        }
        
        storedSearchHistory.sort((a, b) => new Date(a.date_searched) - new Date(b.date_searched));
        const searchHistory = storedSearchHistory.slice(-10);
        window.localStorage.setItem("Search History", JSON.stringify(searchHistory));

    } else {
        const newSearchHistory = [];
        newSearchHistory.push(newSearchItem);
        window.localStorage.setItem("Search History", JSON.stringify(newSearchHistory));
    }
}





// Gets all the amiibo from local storage and lists them
//---------------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async function() {

    const all_characters = await get_all_characters_search_history();
    const all_rulesets = await get_rulesets();

    // check if not null before pushing new search item
    const storedSearchHistory = JSON.parse(localStorage.getItem('Search History'));
    let content = document.getElementById('searchHistoryDropdownContent');

    if (storedSearchHistory != null) {
        storedSearchHistory.reverse().map(index => {

            // Calculate date searched from now
            function calculateTimeAgo(targetDate) {
                const now = new Date();
                const elapsedMilliseconds = now - targetDate;
                
                // Calculate years, months, days, hours, minutes, and seconds
                const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
                const elapsedMinutes = Math.floor(elapsedSeconds / 60);
                const elapsedHours = Math.floor(elapsedMinutes / 60);
                const elapsedDays = Math.floor(elapsedHours / 24);
                const elapsedMonths = Math.floor(elapsedDays / 30); // Approximation
                const elapsedYears = Math.floor(elapsedMonths / 12); // Approximation
              
                if (elapsedYears > 0) {
                     return `${elapsedYears} ${elapsedYears === 1 ? 'year' : 'years'} ago`;
                } else if (elapsedMonths > 0) {
                      return `${elapsedMonths} ${elapsedMonths === 1 ? 'month' : 'months'} ago`;
                } else if (elapsedDays > 0) {
                    return `${elapsedDays} ${elapsedDays === 1 ? 'day' : 'days'} ago`;
                } else if (elapsedHours > 0) {
                    return `${elapsedHours} ${elapsedHours === 1 ? 'hour' : 'hours'} ago`;
                } else if (elapsedMinutes > 0) {
                    return `${elapsedMinutes} ${elapsedMinutes === 1 ? 'minute' : 'minutes'} ago`;
                } else {
                    return `${elapsedSeconds} ${elapsedSeconds === 1 ? 'second' : 'seconds'} ago`;
                }
            }
              
            // Example usage
            const targetDate = new Date(index.date_searched);
            const timeAgo = calculateTimeAgo(targetDate);

            // Match current character with icon
            let characterIcon;
            for (let i = 0; i < all_characters.length; i++) {
                if (all_characters[i].id == index.character_id) {
                    characterIcon = (`${all_characters[i].name}.png`)
                }
            }

            // Match current character with icon
            let ruleset_name;
            for (let i = 0; i < all_rulesets.length; i++) {
                if (all_rulesets[i].id == index.ruleset) {
                    ruleset_name = all_rulesets[i].name;
                }
            }

            // Load everything onto the DOM
            content.innerHTML += (
                `<div class="list_item INACTIVE" id="list_item_searchable" onclick="updateStatsSearch('${index.amiibo_id}'), addAmiiboToSearchHistory('${index.trainer_name}', '${index.amiibo_name}', '${index.amiibo_id}', '${index.character_id}', '${index.ruleset}', '${new Date()}')">

                    <img src="./images/${characterIcon}" class="list_image">

                    <div class="list_stats_grid_container">
                        <div class="list_stats amiibo_trainer_name_title">
                            <h2>${index.trainer_name}</h2>
                            <h1>${index.amiibo_name}</h1>
                        </div>
                    </div>

                    <div class="list_stats_container">
                        <div class="list_stats">
                            <h2>Ruleset</h2>   
                            <h1>${ruleset_name}</h1>
                        </div>

                        <div class="list_stats">
                            <h2>Searched</h2>   
                            <h1>${timeAgo}</h1>
                        </div>

                    </div>

                </div>`
            );
        });

        
    } else {
        content.innerHTML = `<h2 style="margin: auto;">No search history to show :/</h2>`;
    }
});





// Show/hide the search history
//---------------------------------------------------------------------------------------------------------------------------------------------------------
function toggleVisibility() {
    var element = document.getElementById("searchHistoryDropdown");
    if (element.style.display === "none") {
        element.style.display = "block"; // or "inline" or any other display property you want
    } else {
        element.style.display = "none";
    }
}








  