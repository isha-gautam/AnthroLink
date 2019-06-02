function init() {
    $.ajax({
        url: '/getCurrUser',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (!data)
                alert("Cannot get current user details. Please try to login again.")
            else {
                document.getElementById('img').src = data.img;
                document.getElementById('name').value = data.name;
                document.getElementById('email').value = data.email;
                document.getElementById('type').value = data.type;
                if (data.hasOwnProperty('phone'))
                    document.getElementById('phone').value = data.phone;
                if (data.hasOwnProperty('address'))
                    document.getElementById('address').value = data.address;
            }
        }, error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    })
}
