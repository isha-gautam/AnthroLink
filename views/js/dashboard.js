function init() {
    var currUser;
    $.ajax({
        url: 'https://localhost:8080/getCurrUser',
        type: 'GET',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        complete: function (data) {
            alert(data)
        },
        success: function (data) {
            currUser = data;
            document.getElementById('img').src = currUser.img;
            document.getElementById('name').value = currUser.name;
            document.getElementById('email').value = currUser.email;
        }, error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    })
}