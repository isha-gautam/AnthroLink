function init() {
    var currUser;
    $.ajax({
        url: 'https://localhost:8080/getCurrUser',
        type: 'GET',
        dataType: 'json',
        complete: function (data) {
            alert(data)
        },
        success: function (data) {
            currUser = data;
            document.getElementById('img').src = currUser.img;
            document.getElementById('name').value = currUser.name;
            document.getElementById('email').value = currUser.email;
            document.getElementById('type').value = currUser.type;
            if (!currUser.hasOwnProperty('phone'))
                document.getElementById('phone').value = currUser.phone;
            if (!currUser.hasOwnProperty('address'))
                document.getElementById('address').value = currUser.address;
        }, error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
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
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var updatedUser = toJSONString(this);
            //add code to update user in db
        }, false);
    });

})();