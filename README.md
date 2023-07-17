# Change Log:
## v1.2.1
- Overhauled code for the amiibo stats page
    - Utilises the new API endpoints for faster loading
    - Implemented a micro leaderboard to display the amiibo around your amiibo on the leaderboard
    - Graphs now display more information
    - Matchup chart now storts by the official amiibots monthly tierlist
    - UI changes to the match history
    - Amiibo stats no longer requires a trainer ID to search an amiibo
- Adjustments to navbar titles
- Changed Background Image

## v1.2.0
- Name search tool now allows you to search for a trainer name to filter all their amiibo
- Added a matchup graph for an entire character
    - Use a dropdown to select the character
    - Shows how a specified character performs against every character
    - Shows a rating distribution of the specified character
    - Sort feature for all of the matchups, see the worst to best matchups
- Added a rank tool to display how many amiibo a specified trainer has in the top 10
    - displays amiibo ranked 1st on leaderboards
    - displays amiibo ranked top 10 on leaderboards
- Added the history of the highest rating for a specified character
    - displays the highest rating ever recorded at a resolution of one week

## v1.1.3
- Added an extended match history specifically for the amiibo being graphed
- Added a name searching tool to search every valid amiibo on amiibots
- Added a tierlist based on character population
- Removed NaN% on the matchup chart

## v1.1.2
- Minor changes to CSS
- Fixed matchup chart bug with introduction to kazuya and sephiroth

## v1.1.1
- Ruleset is now selected using buttons rather than typing the ruleset into a searchbar
- Fixed a bug displaying an amiibo's rank incorrectly
- Graphs are now rendered before searching leaderboard data to improve perceived loading times
- Rearanged some divs and elements to become more mobile friendly
- ID search tool now displays the corresponding character icon for each amiibo
- ID search tool will only search for a trainer ID if one hasnt been found already (speeds up search times)
- Improved ID Tool search performance

## v1.1.0
- Width of highest rating bar on rating history chart scales with matches and is less intrusive at smaller game counts
- Automatically searches all of a users games in the graphing tool
- ID search tool now shows the number of amiibo you have for a given ruleset
- ID search tool highlights the status colour onto the listed amiibo
- Matchup chart is now sorted by the CTL tier list by default
- Added a tierlist that updates in real time with amiibots results
    - Shows results for each ruleset
    - Displays each characters average rating
    - Dsiplays the global average rating across all characters
    - Characters that dont have any active or standby amiibo will not display on the tierlist
    - Each character on the tierlist can be clicked on to redirect to the official amiibots leaderboard
- Added Navigation bar for each tool
- Added matchup chart sorting (tierlist, win rate, encounters, most lost to)

## v1.0.4
- Amiibo search now lists all amiibo instead of just amiibo on active or standby
- Listed amiibo can now be clicked on to be automatically graphed 

## v1.0.3
- Added Amiibots ID search
    - Type in a Twitch username or Amiibots display name to search for the hidden Amiibots ID
    - Type in a Twitch username or Amiibots display name to search for all amiibo IDs a trainer has
- Highest rating value is now highlighted on the rating history

## v1.0.2
- Overhauled CSS code
    - Cleaned up CSS
    - Elements scale much better
    - Added future support for themes
- Added leaderboard information
    - Displays current rank overall and based on character
    - Displays rating until next rank overall and based on character

## v1.0.1
- Added disclaimer message
- Cleaned up JS code
- Fixed charts not displaying ruleset
- Increased width of charts
- Changed font sizes

## v1.0.0
- Added rating history chart
- Added character matchup chart
- Added search fields
- Added some hidden statistics
- Added current rating and max rating
- Searches are saved in LocalStorage
- ID's and ruleset are shown in search fields
- Character matchup chart scales with number of characters displayed
- Character matchup chart displays win %
