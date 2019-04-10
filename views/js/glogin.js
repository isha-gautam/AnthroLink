var googleUser = {};
var startApp = function (button, name) {

  gapi.load('auth2', function () {

    // Retrieve the singleton for the GoogleAuth library and set up the client.

    auth2 = gapi.auth2.init({
      client_id: '594743792021-tvffn11n961cqea8mbufm9gnts372m0n.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
    });

    console.log(button.id);

    auth2.attachClickHandler(button, {},
      function (googleUser) {
        name.innerText = "Signed in: " +
          googleUser.getBasicProfile().getName();
      }, function (error) {
        alert(JSON.stringify(error, undefined, 2));
      });

  });
}
