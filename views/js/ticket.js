function init() {
    $.ajax({
        url: '/getCurrUser',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (!data)
                alert("Cannot get current user details. Please try to login again.")
            else {
                if (data.name != null)
                    document.getElementById('citName').value = data.name;
                if (data._id != null)
                    document.getElementById('citEmail').value = data._id;
            }
        }, error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });

    $.ajax({
        url: '/othPro',
        type: 'GET',
        dataType: 'json',
        data: { othPro: window.location.search.substring(8) },
        success: function (data) {
            if (!data)
                alert("Cannot get current user details. Please try to login again.")
            else {
                if (data.name != null)
                    document.getElementById('orgName').value = data.name;
                if (data._id != null)
                    document.getElementById('orgEmail').value = data._id;
            }
        }, error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });

    var today = new Date();
    var month = today.getMonth() + 1;
    if (month < 10)
        month = "0" + month;
    var date = today.getFullYear() + "-" + month + "-" + today.getDate();
    document.getElementById('startDate').value = date;
    document.getElementById('endDate').value = date;
    document.getElementById('startDate').min = date;
    document.getElementById('endDate').min = date;
}
$(document).ready(function () {
    $("#submit").click(function (e) {
        e.preventDefault();
        form = {
            "citName": $("#citName").val(),
            "citEmail": $("#citEmail").val(),
            "orgName": $("#orgName").val(),
            "orgEmail": $("#orgEmail").val(),
            "TDescr": $("#TDescr").val(),
            "type": $("#type").val(),
            "startDate": $("#startDate").val(),
            "endDate": $("#endDate").val()
        };
        $.ajax({
            url: '/ticket',
            type: 'POST',
            dataType: 'text',
            data: { form: form },
            success: function (data) {
                alert("Ticket Raised");
            }, error: function (xhr) {
                alert("An error occured: " + xhr.status + " " + xhr.statusText);
            }
        });
    })
});


