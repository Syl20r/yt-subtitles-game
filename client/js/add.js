var sock = io();

$('#addVideo').click(function(){
  var obj = {
    "code": $('#code').val(),
    "start": $('#start').val(),
    "end": $('#end').val(),
    "original_sub": $('#original_sub').val(),
    "original_start": $('#original_start').val(),
    "original_end": $('#original_end').val(),
    "sub_start": $('#sub_start').val(),
    "sub_end": $('#sub_end').val()
  };
  sock.emit('addVideo', obj);
});
