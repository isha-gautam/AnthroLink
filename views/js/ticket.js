function init() {
    $.ajax({
        url: '/getCurrUser',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (!data)
                alert("Cannot get current user details. Please try to login again.")
            else {
                document.getElementById('citName').value = data.name;
                document.getElementById('citEmail').value = data._id;
            }
        }, error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });

    $.ajax({
        url: '/getCurrOrg',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (!data)
                alert("Cannot get current user details. Please try to login again.")
            else {
                document.getElementById('orgName').value = data.name;
                document.getElementById('orgEmail').value = data.email;
            }
        }, error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });

    var today = new Date();
    today = today.getDate + "-" + today.getMonth + "-" + today.getFullYear;
    // today = today.getFullYear + "-" + today.getMonth + "-" + today.getDate;
    document.getElementById('startDate') = today;
    document.getElementById('endDate') = today;

}

