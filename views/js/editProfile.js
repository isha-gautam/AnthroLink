function init() {
    $.ajax({
        url: '/getCurrUser',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (!data)
                alert("Cannot get current user details. Please try to login again.")
            else {
                if (data.hasOwnProperty('img'))
                    document.getElementById('img').src = data.img;
                if (data.name != null)
                    document.getElementById('name').value = data.name;
                if (data._id != null)
                    document.getElementById('email').value = data._id;
                if (data.type == null)
                    $('#typeL').html("<select id='type' name='type' class='form-control' required><option>Not specified yet</option><option>Citizen</option><option>Organisation</option></select>");
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

$(document).ready(function () {
    $("#submit").click(function (e) {
        e.preventDefault();
        form = {
            "name": $("#name").val(),
            "_id": $("#email").val(),
            "typeL": $("#typeL option:selected").text(),
            "address": $("#address").val(),
            "phone": $("#phone").val(),
            "bio": $("#bio").val(),
        };
        $.ajax({
            url: '/editProfile',
            type: 'POST',
            dataType: 'text',
            data: { form: form },
            success: function (data) {
                alert(data);
            }, error: function (xhr) {
                alert("An error occured: " + xhr.status + " " + xhr.statusText);
            }
        });
    })
});



