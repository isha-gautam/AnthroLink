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
                document.getElementById('email').value = data._id;
                if (data.type == null)
                    $('#typeL').html("<select id='type' name='type' class='form-control' required><option>Citizen</option><option>Organisation</option></select>");
                else
                    $('#typeL').html("<div name='type' id='type' class='form-control' readonly>" + data.type + "</div>");
                if (data.hasOwnProperty('phone'))
                    document.getElementById('phone').value = data.phone;
                if (data.hasOwnProperty('address'))
                    document.getElementById('address').value = data.address;
                if (data.hasOwnProperty('bio'))
                    document.getElementById('bio').value = data.bio;
            }
        }, error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    })
}
