# RSS News Spreeder
A spreeder for the Pebble Smartwatch.

# How to use
When you first get the app, there's a list of 8 rss feeds from an assortment of news sources. 

# Customize Feeds
To customize your feeds, open your pebble app on your smartphone and press the gear icon. There, any changes you make to the feeds will be reflected on the watchapp.

For example, you can press 'remove' for all of the feeds and then press 'add feed' and add one for Quora by typing 'Quora' into the Title field and pasting in the url 'http://www.quora.com/rss' in the Url field.

Afterwards, press confirm (or cancel if you change your mind), exit out of the pebble app, launch it again, and your feeds should be updated!

# Note
For some feeds, the 'content' category might start bringing up html tags and urls. If this happens, (or if you aren't satisfied with the text you're getting) then see if 'Parsed Article' gives better text. Instead of reading text from the RSS feed, it calls upon AlchemyAPI's web parser to give a cleaned-up (and complete) article. Especially useful for some news sources that only give small snippets or the article in their RSS.

# Known Issues
There is currently a small, rather annoying bug which occurs when the text is being displayed word by word. The pebble seems to occasionally lag a little big which causes it to fall behind, and then catch up. This messes up the timing and is detrimental to the user experience. Unfortunately I have not yet found a way around this.

# Future Improvements
* Better configuration webpage
* Allow to change delay between words.
* Fix 'lag' issue
