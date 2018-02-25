(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-50571901-1', 'auto');
ga('require', 'linkid', 'linkid.js');
ga('send', 'pageview');


jQuery(document).ready(function() {
	var filetypes = /\.(zip|jar|exe|dmg|pdf|doc.?|xls.?|ppt.?|mp3|txt|rar|wma|mov|avi|wmv|flv|wav)$/i;
	var baseHref = (jQuery('base').attr('href') != 'undefined') ? jQuery('base').attr('href') : '';
	var time = new Date().getTime();
	
	jQuery('a').on('click', function() {
		var element = jQuery(this);
		var href = (typeof(element.attr('href')) != 'undefined') ? element.attr('href') : '';
		
		var event = [];
		event.action = "Click";
		event.location = href;
		event.time = Math.round((new Date().getTime() - time) / 1000);
		
		if (href.match(/^https?\:/i)) {
			event.category = "External";
			event.label = href.replace(/^https?\:\/\//i, '');
		} else if (href.match(filetypes)) {
			event.category = "Download";
			event.label = href.replace(/ /g, '-');
			event.location = baseHref + href;
		} else if (href.match(/^javascript:/i)) {
			event.category = "Javascript";
			event.label = element.attr('id');
		} if (href.match(/^mailto\:/i)) {
			event.category = "Email";
			event.label = href.replace(/^mailto\:/i, '');
		} else if (href.match(/^tel\:/i)) {
			event.category = "Telephone";
			event.label = href.replace(/^tel\:/i, '');
		}
		
		ga('send', 'event', event.category, event.action, event.label, event.time);
		
		if ($('base').attr('target') != '_blank' && element.attr('target') != '_blank') {
			setTimeout(function() { location.href = event.location; }, 400);
			return false;
		}
	});
});


var tag = document.createElement('script');
tag.src = "//www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

$(window).load(function() {
	jQuery('iframe').each(function() {
		var iframe = $(this);
		var src = iframe.attr('src');
		if (src) {
			var matches = src.match(/(?:https?:)?\/\/www\.youtube\.com\/embed\/([\w-]{11})(?:\?.*)?/);
			if (matches && matches.length > 1) {
				var id = matches[1];
				iframe.attr('id', id);
				createPlayer(id);
			}
		}
	});
});

function createPlayer(id) {
    $.getJSON('//gdata.youtube.com/feeds/api/videos/' + id + '?v=2&alt=json', function(data, status, xhr) {
		var player = new YT.Player(id, { videoId: id, events: { 'onStateChange': onPlayerStateChange } });
		player.title = data.entry.title.$t + " (by " + data.entry.author[0].name.$t + ")";
		player.pause = false;
    });
}

function onPlayerStateChange(event) {
	var player = event.target;
	var time = Math.round(player.getCurrentTime());
    if (event.data == YT.PlayerState.PLAYING) {
	    ga('send', 'event', 'Video', 'Play', player.title, time);
		player.pause = false;
	} else if (event.data == YT.PlayerState.PAUSED && !player.pause) {
		ga('send', 'event', 'Video', 'Pause', player.title, time);
		player.pause = true;
	} else if (event.data == YT.PlayerState.ENDED) {
		ga('send', 'event', 'Video', 'End', player.title);
	}
}
