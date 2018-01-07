var sock = io();

$(function() {
  // DOM chargé
  sock.emit('id', {'id': getCookie('id'), 'username': getCookie('username')});

  sock.on('startVote', function (propositions) {
    var data = "";
    for (var i in propositions) {
      data += '<input type="radio" name="sub" value="'+propositions[i].id+'"> '+propositions[i].sub+'<br>';
    }
    data += '<input type="button" onclick="validVote()" value="Valider le vote">';
    $('#vote').append(data);
  });
});

function validVote() {
  sock.emit('vote', $('input[name=sub]:checked').val());
  $('#vote').empty();
  sock.on('voteResult', function (res) {
    console.log(res);
    var data = "";
    for (var i in res) {
      data += '<p>'+res[i].username+' ('+res[i].points+' points)'+': '+res[i].sub+'</p>';
    }
    $('#vote').append(data);

  });
}

$('#validSub').click(function () {
  var subtitle = $('#subtitle').val();
  sock.emit('sub', subtitle);
});

function getCookie(c_name) {
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + "=");
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1;
      c_end = document.cookie.indexOf(";", c_start);
      if (c_end == -1) c_end = document.cookie.length;
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return "";
}
