var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var Vibe = require('ui/vibe');
var Settings = require('settings');



if(!Settings.option('menu_items')) {
	Settings.option('menu_items', [
		{
			title: 'CNN',
			url: 'http://rss.cnn.com/rss/cnn_topstories.rss'
		},
		{
			title: 'BBC',
			url: 'http://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml?edition=int'
		},
		{
			title: 'NYT',
			url: 'http://feeds.nytimes.com/nyt/rss/HomePage'
		},
		{
			title: 'NPR',
			url: 'http://www.npr.org/rss/rss.php?id=1001'
		},
		{
			title: 'AP',
			url: 'http://hosted.ap.org/lineups/USHEADS-rss_2.0.xml?SITE=SCAND&SECTION=HOME'
		},
		{
			title: 'USA TODAY',
			url: 'http://rssfeeds.usatoday.com/usatoday-NewsTopStories'
		},
		{
			title: 'WP',
			url: 'http://feeds.washingtonpost.com/rss/world'
		},
		{
			title: 'TOP NEWS',
			url: 'http://feeds.reuters.com/reuters/topNews'
		}
	]);
}

Settings.config(
	{ url: 'https://dvappel.me/stuff/spreeder-config.html'},
	function(e) {
		console.log('opened config');
	},
	function(e) {
		console.log('closed config');
		console.log(JSON.stringify(e.options));
		
		if( e.failed ){
			console.log(e.response);
		} else {
			Settings.option('menu_items', e.options);
		}
	}
);

var main = new UI.Menu({
	sections: [{
		items: Settings.option('menu_items')
	}]
});

main.show();

main.on('select', function(e) {

	var rss_url = e.item.url;
	rss_url = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&q=' + encodeURIComponent(rss_url);

	var rss_callback = function (rss_data) {
		var rss_feed;
		var rss_response_data = rss_data.responseData;
		if( rss_data.responseStatus == 200) {
			rss_feed = rss_response_data.feed.entries;
		} else {
			return;
		}
		
		display_rss_feed(rss_feed);
	};
	request_json(rss_url, rss_callback);
});

function display_rss_feed(rss_feed) {
	var menu_items = get_menu_items_from_rss_feed(rss_feed);
	var rss_menu = new UI.Menu({
		sections: [{
			items: menu_items
		}]
	});
	rss_menu.show();

	rss_menu.on('select', function(e) {

		var article_sub_menu = new UI.Menu({
			sections: [{
				items:[
					{
						title: 'Title',
						content: e.item.title
					},
					{
						title: 'Content',
						content: e.item.content
					},
					{
						title: 'Parsed Article',
						subtitle: 'AlchemyAPI',
						content: e.item.link
					}
				]
			}]
		});
		
		article_sub_menu.show();
		
		article_sub_menu.on('select', function(e) {
			if(e.item.subtitle == 'AlchemyAPI') {
				request_json(e.item.content, function(response) { read_content(response.text); });
			} else {
				read_content(e.item.content);	
			}
		});
	});
}

function get_menu_items_from_rss_feed(rss_feed) {
	var menu_items = [rss_feed.length];
	var i;
	for(i = 0; i < rss_feed.length; i++) {
		menu_items[i] = {
			title: rss_feed[i].title,
			content: rss_feed[i].content,
			link: construct_readability_request_url(rss_feed[i].link),
		};
	}
	return menu_items;
}

function read_content(text) {
	var wind = new UI.Window();
	var textfield = new UI.Text({
		position: new Vector2(0, 50),
		size: new Vector2(144, 30),
		font: 'gothic-24-bold',
		text: '',
		textAlign: 'center'
	});
	
	wind.add(textfield);
	wind.show();
	
	text = text.split(' ');
	
	var show_words = function () {
		var show_word = function(next_index) {
			if(next_index < text.length) {
				textfield.text(text[next_index]);
				wait_then_show_word(next_index + 1);
			} else {
				Vibe.vibrate('long');
				textfield.text('End of article');
				setTimeout( function () {
					textfield.remove();
					wind.hide();
				}, 1000);
			}	
		};
		var wait_then_show_word = function(index) {
			setTimeout( function(){
				show_word(index);
			}, 400);	
		};
		wait_then_show_word(0);
	};
	show_words();
}

function construct_readability_request_url(url) {
	return 'http://access.alchemyapi.com/calls/url/URLGetText?apikey=2e290d8d3ec6fbb70b08debdbd67cca22f721e1f&outputMode=json&url=' + encodeURIComponent(url);
}

function request_json(request_url, callback) {
	ajax(
		{
			url: request_url,
			type: 'json'
		},
		function(data, status, request) {
			callback(data);
		},
		function(error, status, request) {
			console.log(error);
		}
	);
}