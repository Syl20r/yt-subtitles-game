var sock = io();

$(function() {
  // DOM chargé
  sock.emit('player');
  sock.on('play', function (sub) {
    var subtitle = [{
      "start": 0,
      "end": 11.5,
      "text": sub
    }];
    console.log(sub);
    var urlVideo = "https://www.youtube.com/embed/fGPPfZIvtCw?cc_load_policy=3&rel=0&controls=0&autoplay=0&showinfo=0&iv_load_policy=3";
    $('div.video').append('<iframe id="video" width="100%" height="900px" src="'+urlVideo+'" frameborder="0" allowfullscreen="true"></iframe>');

    var youtubeExternalSubtitle = new YoutubeExternalSubtitle.Subtitle(
      document.getElementById('video'), subtitle);
  });
});
