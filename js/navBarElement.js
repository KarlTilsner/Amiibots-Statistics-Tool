// STARTER FUNCTION
//--------------------------------------------------------------------------------------------------------------------------------------------------------- 
// document.addEventListener('DOMContentLoaded', function() {
//     let content = document.getElementById('documentNavbar');
//     let navbar = '<ul class="navbar_nav">';

//     navbar += (
//         `


        // <li class="nav_item" onclick="window.location.href = 'index_new.html'">

        //     <li class="nav_item" onclick="window.location.href = 'index.html'">
        //         <a href="#" class="nav_link">
        //             <img class="nav_img" src="images/icon_amiibo_stats.png">
        //             <h2 class="link_text">Amiibo Stats</h2>
        //         </a>
        //     </li>

        //     <li class="nav_item" onclick="window.location.href = 'amiibo_search.html'">
        //         <a href="#" class="nav_link">
        //             <img class="nav_img" src="images/icon_amiibo_search.png">
        //             <h2 class="link_text">Browse All Amiibo</h2>
        //         </a>
        //     </li>

        //     <li class="nav_item" onclick="window.location.href = 'rank_tool.html'">
        //         <a href="#" class="nav_link">
        //             <img class="nav_img" src="images/icon_rank_tool.png">
        //             <h2 class="link_text">Trainer Leaderboard</h2>
        //         </a>
        //     </li>

        //     <li class="nav_item" onclick="window.location.href = 'character_matchups.html'">
        //         <a href="#" class="nav_link">
        //             <img class="nav_img" src="images/icon_matchup_tool.png">
        //             <h2 class="link_text">Amiibots Matchups (WIP)</h2>
        //         </a>
        //     </li>

        //     <li class="nav_item" onclick="window.location.href = 'tierlist.html'">
        //         <a href="#" class="nav_link">
        //             <img class="nav_img" src="images/icon_live_tierlist.png">
        //             <h2 class="link_text">Live Tierlist</h2>
        //         </a>
        //     </li>

        //     <li class="nav_item" onclick="window.location.href = 'usage_tierlist.html'">
        //         <a href="#" class="nav_link">
        //             <img class="nav_img" src="images/icon_usage_tierlist.png">
        //             <h2 class="link_text">Amiibo Usage Tierlist</h2>
        //         </a>
        //     </li> 
            
//         `
//     );
            
//     navbar += "</ul>";
//     content.innerHTML = navbar;
// });





document.addEventListener('DOMContentLoaded', async function() {
    let content = document.getElementById('documentNavbar');

    try {
        const navbarResponse = await fetch('navbar.html');
        const navbarContent = await navbarResponse.text();
        
        content.innerHTML = navbarContent;
    } catch (error) {
        console.error('Error loading content:', error);
    }
});