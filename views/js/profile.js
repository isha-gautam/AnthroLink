
function init() {
    var currUser;
    $.ajax({
        url: 'http://localhost:8080/',
        dataType: 'application/json',
        complete: function (data) {
            alert(data)
        },
        success: function (data) {
            currUser = JSON.parse(data);
            document.getElementById('img').src = currUser.img;
            document.getElementById('name').value = currUser.name;
            document.getElementById('email').value = currUser.email;
            document.getElementById('type').value = currUser.type;
            if (!currUser.hasOwnProperty('phone'))
                document.getElementById('phone').value = currUser.phone;
            if (!currUser.hasOwnProperty('address'))
                document.getElementById('address').value = currUser.address;
        }
    })
}

(function () {
    function toJSONString(form) {
        var obj = {};
        var elements = form.querySelectorAll("input");
        for (var i = 0; i < elements.length; ++i) {
            var element = elements[i];
            var name = element.id;
            var value = element.value;
            if (name && value.length != 0) {
                obj[name] = value;
            }
        }
        console.log(obj);
        return JSON.stringify(obj);
    }

    document.addEventListener("DOMContentLoaded", function () {
        var form = document.getElementById("edit-profile");
        var output = document.getElementById("output");
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var json = toJSONString(this);
            // output.innerHTML = json;

        }, false);

    });

})();