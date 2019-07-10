var check = function () {
    if (document.getElementById('password2').value ==
        document.getElementById('confirm-password').value) {
        document.getElementById('message2').style.color = 'green';
        document.getElementById('message2').innerHTML = 'matching';
    } else {
        document.getElementById('message2').style.color = 'red';
        document.getElementById('message2').innerHTML = 'not matching';
    }
}

