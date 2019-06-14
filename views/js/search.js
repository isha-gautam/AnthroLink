var i = 0;
var res;
$("#submit").click(function (e) {
    var searchStr = $("#searchStr").val();
    $.ajax({
        url: '/search',
        type: 'POST',
        dataType: 'json',
        data: { searchStr: searchStr },
        success: function (result) {
            res = result;
            GenerateTable(result);
        }, error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    })
});

function GenerateTable(arr) {
    while (i > 0) {
        $("#addr" + (i - 1)).html('');
        i--;
    }
    arr.forEach(user => {
        var html;
        if (user.img == null)
            html = "<td>" + (i + 1) + "</td><td><button name='profile' id='" + i + "' >" + user.name + "</button></td><td>" + user.type + "</td><td>";
        else
            html = "<td>" + (i + 1) + "</td><td><button name='profile' id='" + i + "'>" + user.name + "</button></td><td>" + user.type + "</td><td><a><img src='" + user.img + "' width='10%' height='70%'></a>";
        if (user.type == "Organisation") {
            $('#addr' + i).html(html + "<button name='raiseTicket' id='" + i + "' class='btn btn-default pull-left'>Raise Ticket</button></td>");
        }
        else {
            $('#addr' + i).html(html + "</td>");
        }
        $('#tab_logic').append('<tr id="addr' + (i + 1) + '"></tr>');
        i++;
    });
}

$(document).ready(function () {
    $('.table').on('click', 'button', function () {
        if ($(this).attr('id') == "submit")
            return;
        var othPro = res[$(this).attr('id')];
        if (this.name == "profile")
            window.open('/otherProfile?othPro=' + othPro._id);
        else
            window.open('/ticket?othPro=' + othPro._id);
    })
});