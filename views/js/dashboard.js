function init() {
    var currUser;
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
                currUser = data;
                if (data.img != null)
                    document.getElementById('img').src = data.img;
                if (data.name != null)
                    document.getElementById('name').innerText = data.name;
                if (data._id != null)
                    document.getElementById('email').innerText = data._id;
            }
        }, error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
    $.ajax({
        url: '/getTicks',
        type: 'GET',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            if (!data)
                alert("Cannot get current user details. Please try to login again.")
            else
                fill(data, currUser.type);
        }, error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    })
}

function fill(ticks, type) {

    [].slice.call(ticks);
    ticks.sort(function (a, b) {
        var dateA = new Date(a.startDate), dateB = new Date(b.startDate);
        return dateA - dateB;
    });

    for (var i = 0, k = 0; i < ticks.length; i++) {
        if (ticks[i].status == "accepted") {
            var name;
            if (type == "Organisation")
                name = ticks[i].citName;
            else
                name = ticks[i].orgName;
            var upcoming = "<td>" + (i + 1) + "</td><td>" + name + "</td><td>" + ticks[i].startDate + "</td>";
            $('#uaddr' + k).html(upcoming);
            $('#upcomingT').append("<tr id='uaddr" + (k + 1) + "'></tr>");
            k++;
        }
    }

    for (var i = 0, k = 0; i < ticks.length; i++) {
        if (ticks[i].status == "collected") {
            var name;
            if (type == "Organisation")
                name = ticks[i].citName;
            else
                name = ticks[i].orgName;
            var previous = "<td>" + (i + 1) + "</td><td>" + name + "</td><td>" + ticks[i].startDate + "</td>";
            $('#preaddr' + k).html(previous);
            $('#previousT').append("<tr id='preaddr" + (k + 1) + "'></tr>");
            k++;
        }
    }

    ticks.sort(function (a, b) {
        var dateA = new Date(a.createdOn), dateB = new Date(b.createdOn);
        return dateA - dateB;
    });

    for (var i = 0, k = 0; i < ticks.length; i++) {
        if (ticks[i].status == "pending") {
            var name;
            if (type == "Organisation")
                name = ticks[i].citName;
            else
                name = ticks[i].orgName;
            var pending = "<td>" + (i + 1) + "</td><td>" + name + "</td><td>" + ticks[i].createdOn + "</td>";
            if (type == "Organisation") {
                pending += "<td><button name='accepted' id='" + ticks[i]._id + "' type='button' class='btn btn-success btn-lg'>Accept</button></td>";
                pending += "<td><button name='rejected' id='" + ticks[i]._id + "' type='button' class='btn btn-success btn-lg'>Reject</button></td>";
                pending += "<td><button name='collected' id='" + ticks[i]._id + "' type='button' class='btn btn-success btn-lg'>Collect</button></td>";
            }
            $('#paddr' + k).html(pending);
            $('#pendingT').append("<tr id='paddr" + (k + 1) + "'></tr>");
            k++;
        }
    }

    for (var i = 0; i < ticks.length; i++) {
        var name;
        if (type == "Organisation")
            name = ticks[i].citName;
        else
            name = ticks[i].orgName;
        var all = "<td>" + (i + 1) + "</td><td>" + name + "</td><td>" + ticks[i].Descr + "</td><td>" + ticks[i].status + "</td>";
        $('#addr' + i).html(all);
        $('#allT').append("<tr id='addr" + (i + 1) + "'></tr>");
    }
}

$(document).ready(function () {
    $('table').on('click', 'button', function () {
        $.ajax({
            url: '/updateStatus',
            type: 'POST',
            dataType: 'text',
            data: { stat: { "status": this.name, "id": this.id } },
            success: function (data) {
                alert("Success");
            }, error: function (xhr) {
                alert("An error occured: " + xhr.status + " " + xhr.statusText);
            }
        });

    })
});
