Change Log:
v1.1.2

v1.1.1
- Ruleset is now selected using buttons rather than typing the ruleset into a searchbar
- Fixed a bug displaying an amiibo's rank incorrectly
- Graphs are now rendered before searching leaderboard data to improve perceived loading times
- Rearanged some divs and elements to become more mobile friendly
- ID search tool now displays the corresponding character icon for each amiibo
- ID search tool will only search for a trainer ID if one hasnt been found already (speeds up search times)
- Improved ID Tool search performance

v1.1.0
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

v1.0.4
- Amiibo search now lists all amiibo instead of just amiibo on active or standby
- Listed amiibo can now be clicked on to be automatically graphed 

v1.0.3
- Added Amiibots ID search
    - Type in a Twitch username or Amiibots display name to search for the hidden Amiibots ID
    - Type in a Twitch username or Amiibots display name to search for all amiibo IDs a trainer has
- Highest rating value is now highlighted on the rating history

v1.0.2
- Overhauled CSS code
    - Cleaned up CSS
    - Elements scale much better
    - Added future support for themes
- Added leaderboard information
    - Displays current rank overall and based on character
    - Displays rating until next rank overall and based on character

v1.0.1
- Added disclaimer message
- Cleaned up JS code
- Fixed charts not displaying ruleset
- Increased width of charts
- Changed font sizes

v1.0.0
- Added rating history chart
- Added character matchup chart
- Added search fields
- Added some hidden statistics
- Added current rating and max rating
- Searches are saved in LocalStorage
- ID's and ruleset are shown in search fields
- Character matchup chart scales with number of characters displayed
- Character matchup chart displays win %
