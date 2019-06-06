
$(document).ready()(function () {
    $("submit").click(function (e) {
        e.preventDefault();
        $.ajax({
            url: '/search',
            type: 'POST',
            dataType: 'json',
            success: function (result) {
                if (!result)
                    alert("Cannot get profile details. Please try again later.")
                else
                    // return getResult(result);
                    // document.getElementById("results").innerText = result;
                    $("#results").html = result;
            }, error: function (result) {
                alert('error');
            }
        });
    })
});
// var getResult = function (result) {
    
// }
