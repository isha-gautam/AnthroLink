function init() {
    $.ajax({
        url: '/othPro',
        type: 'GET',
        dataType: 'json',
        data: { othPro: window.location.search.substring(8) },
        success: function (data) {
            if (!data)
                alert("Cannot get current user details. Please try to login again.")
            else {
                if (data.hasOwnProperty('img') && data.img != null)
                    document.getElementById('img').src = data.img;
                if (data.name != null)
                    document.getElementById('name').innerText = data.name;
                if (data._id != null)
                    document.getElementById('email').innerText = data._id;
                if (data.hasOwnProperty('phone'))
                    document.getElementById('phone').innerText = data.phone;
                if (data.hasOwnProperty('address'))
                    document.getElementById('address').innerText = data.address;
                if (data.hasOwnProperty('bio'))
                    document.getElementById('bio').innerText = data.bio;
                if (data.type == "Organisation")
                    $("#raiseT").html("<button class='btn btn-primary' onclick='raiseTick()'>Raise Ticket</button>");
            }
        }, error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    })
}
function raiseTick() {
    othPro = window.location.search.substring(8)
    window.open('/ticket?othPro=' + othPro);
}
