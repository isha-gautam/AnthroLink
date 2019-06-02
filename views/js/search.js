$("submit").click(function (e) {
    e.preventDefault();
    $.ajax({
        type: "POST",
        url: "/search",
        datatype: 'json',
        success: function (result) {
            if (!data)
                alert("Cannot get profile details. Please try again later.")
            else {
                document.getElementById("results").innerText = result;
            }
        }, error: function (result) {
            alert('error');
        }
    });
});