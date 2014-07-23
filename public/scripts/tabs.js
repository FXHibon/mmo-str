/**
 * Created by Fx on 16/07/2014.
 */

var tabs = document.querySelector('paper-tabs');
tabs.addEventListener('core-select', function () {
    console.log("Selected: " + tabs.selected);
});

document.addEventListener("google-signin-success", function(e) {
    // Access the GAPI instance passed back from authorization
    var gapi = e.detail.gapi;

    // Load V1 of the G+ API
    gapi.client.load('plus', 'v1', function() {
        // To retreive profile information for a user, use the
        // people.get API method. For profile info for the currently
        // authorized user, use the userId value of me.
        var request = gapi.client.plus.people.get({
            'userId': 'me'
        });

        request.execute(function(resp) {
            // Some useful profile information is now available
            // via the returned object (resp). For example, we
            // can discover the displayName, skills and so on.
            console.log(resp);
            console.log("You are now signed in.");
            socket.emit("signIn", {idGPlus: resp.id});
        });
    });
    ;
});

document.addEventListener("facebook-signin-success", function (e) {
    console.log(e);
});

document.addEventListener("google-signed-out", function() {
    console.log("You are now signed out.");
});

document.addEventListener("google-signout-attempted", function() {
    console.log("You attempted to sign out.");
});

document.addEventListener("internal-signin", function(e) {
    console.log(e);
    socket.emit("signIn", {id: e.detail.id, pwd: e.detail.pwd});
});