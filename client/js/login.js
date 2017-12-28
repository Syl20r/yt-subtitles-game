function login() {
  var username = $('#username').val();
  setCookie('id', Math.random(), 30);
  setCookie('username', username, 30);
  location.href = 'game.html';
}

function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
