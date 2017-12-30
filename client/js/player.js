var sock = io();
var urlVideo = "https://www.youtube.com/embed/fGPPfZIvtCw?start=11&end=14";

var SUBS;
var VIDEO;

$(function() {
  // DOM chargé
  sock.emit('player');
  sock.on('play', function (subs) {
    SUBS = subs;
    selectSub();
  });

  $('#startPlayer').click(function () {
    sock.emit('playVideo');
  });
  sock.on('playVideo', function (video) {
    VIDEO = video;
    playVideo(VIDEO);
  });
});


// autoplay video
function onPlayerReady(event) {
	event.target.playVideo();
}

// when video ends
function onPlayerStateChange(event) {
	if (event.data === 0) {
    $('#video').remove();
    $('.youtube-external-subtitle').remove();
    if(SUBS.length != 0){
      selectSub();
    } else {
      // VOTE
      sock.emit('startVote');
    }
	}
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function selectSub() {
  var r = Math.floor((Math.random() * SUBS.length));
  var sub = SUBS.splice(r, 1)[0];
  playVideo(VIDEO, sub);
}

function playVideo(video, sub='...') {
  var subtitle = [
    {
      "start": video.original_start,
      "end": video.original_end,
      "text": video.original_sub
    },
    {
      "start": video.sub_start,
      "end": video.sub_end,
      "text": sub
  }];
  var urlVideo = "https://www.youtube.com/embed/"+video.code+'?start='+video.start+'&end='+video.end;
  $('div.video').append('<iframe id="video" width="100%" height="800px" src="'+urlVideo+'&cc_load_policy=3&rel=0&controls=0&autoplay=1&showinfo=0&iv_load_policy=3" frameborder="0" allowfullscreen="true"></iframe>');

  var youtubeExternalSubtitle = new YoutubeExternalSubtitle.Subtitle(
    document.getElementById('video'), subtitle);
}
