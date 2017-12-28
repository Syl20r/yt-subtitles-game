var sock = io();

$(function() {
  // DOM chargé
  sock.emit('id', {'id': getCookie('id'), 'username': getCookie('username')});
});

$('#validSub').click(function() {
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
