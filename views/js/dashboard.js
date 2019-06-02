function init() {
    $.ajax({
        url: '/getCurrUser',
        type: 'GET',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            if (!data)
                alert("Cannot get current user details. Please try to login again.")
            else {
                console.log(data);
                document.getElementById('img').src = data.img;
                document.getElementById('name').innerText = data.name;
                document.getElementById('email').innerText = data._id;
            }
        }, error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    })
}