# Change Log:
## v1.3.1
- Added a loading status tab in trainer stats
    - Displays the trainer_id, and ruleset_id
    - Displays the status of each endpoint
    - Alerts with errors if conditions are not met
- Added a trainer_id search inside the loading status tab
    - Select the ruleset and then click any trainer to see their stats
- Fixed ruleset selection in trainer stats

## v1.3.0
- Added trainer stats page
    - General statistics:
        - First match
        - Last match
        - Total matches
        - Trainer win rate
        - Trainer average ratings
        - Longest winstreak
        - Longest losestreak
        - Favourite characters
        - Most faced opponent trainers
    - Current leaderboard position
    - All amiibo runs:
        - Graph of every rating history of all amiibo
        - Darker colour indicates newer amiibo
        - Lighter colour indicates older amiibo
    - Top 50 trainer vs trainer matchups
    - Trainer vs character matchups
    - Top 50 trainer vs amiibo matchups
    - Display of all amiibo trainer has:
        - Character icon
        - Amiibo name
        - Win rate
        - Wins
        - Losses
        - Amiibo character rank
        - Match selection status
    - Full match history for selected ruleset:
        - Highlighted green for a win
        - Highlighted red for a loss
        - Amiibo name
        - Opponent amiibo name
        - Trainer name
        - Opponent trainer name
        - Amiibo rating
        - Opponent amiibo rating
- Trainer stats can be accessed through the side menu or by clicking on a trainer in the trainer leaderboard
- Updated chart axis titles

## v1.2.7.3
- Updated matchup data

## v1.2.7.2
- Surrounding amiibo now display rating_mu instaed of rating

## v1.2.7.1
- Surrounding amiibo now displays the count of amiibo and now an encounter % for each character

## v1.2.7
- Amiibo search can now sort by tierlist

## v1.2.6.2
- Updated matchup data

## v1.2.6.1
- Added the name of the tool to the title of each page
- Updated matchup data

## v1.2.6
- Updated amiibo matchup data
- Overhauled amiibots rating history to be much more accurate
    - Now shows any decreases over time for the top amiibo instead of only counting rating increases
    - Shows the most dominant trainers for each character and how long they were on top for
    - X-axis resolution increased from 1 week at a time to 1 day (~7x more datapoints)
    - Only allows amiibo with a sigma of 2.5 or lower to count towards the rating history
    - Rating history theoretically loads faster

## v1.2.5
- Added search history
    - 10 amiibo can be seen in the search history
    - Displays information about the amiibo and how long ago it was searched
- Added a graph showing the frequency of characters within matchup range in amiibo stats
    - Filters amiibo that can be matched into acording to your matchmaking status
    - Click on a character icon to see all amiibo for that character
- Improved code for navbar
- Fixed bug where inactive amiibo had an overall rank in amiibo search
- Fixed missing stats for character matchups

## v1.2.4
- Added unofficial trainer leaderboard
    - Uses a points based system similar to formula 1 to rank trainers
    - Highest character recieves full points
    - Duplicate characters recieve 1 point

## v1.2.3.2
- Fixed minor bug

## v1.2.3.1
- Updated amiibo matchup data

## v1.2.3
- Overhauled how data is processed in the matchup tool
    - Greatly increased the speed that the matchups loads
- Removed the rating distribution chart in the matchup tool

## v1.2.2
- All amiibo listed in any tool is now clickable
    - Clicking on an amiibo will redirect to the amiibo stats tool and display all their stats (as long as they havent been deleted or havent got enough games)
- Tweaked the font sizes and GUI to make tools that list amiibo more mobile friendly
- The "ID Search Tool" has been retired and will be replaced by the rebranded "Amiibo Search" tool previously known as the "Name Search Tool"
- Improved stability and slayed bugs

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



## Upcoming Ideas
- DISPLAY AMIIBO AS INACTIVE IF LEADERBOARD RANK IS 0

- Fix error on micro leaderboard with less than 5 amiibo on the character rank

- Compare two amiibo against eachother

- Add more filters to matchups to get highest performing amiibo instead

- gather statistics on the most successful amiibo

- Cache data

- Add loading animation