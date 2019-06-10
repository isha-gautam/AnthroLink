$("#submit").click(function (e) {
    // e.preventDefault();
    $.ajax({
        url: '/search',
        type: 'POST',
        dataType: 'json',
        success: function (result) {
            alert("success");
            console.log(result);
            // if (!result)
            //     alert("Cannot get profile details. Please try again later.")
            // else
            //     results = result;
        }, error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }, complete: function () {
            alert("ajax complete");
        }
    })
})