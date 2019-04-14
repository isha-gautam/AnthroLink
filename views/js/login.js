function validatePassword() {
    var password = document.getElementById('password2').value;
    var minNumberofChars = 6;
    var maxNumberofChars = 16;
    var regularExpression = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (password.length < minNumberofChars || password.length > maxNumberofChars) {
        document.getElementById('message1').style.color = 'red';
        document.getElementById('message1').innerHTML = 'length of password should be in between 6 and 16 characters ';
    }
    if (!regularExpression.test(password)) {
        document.getElementById('message1').style.color = 'red';
        document.getElementById('message1').innerHTML += "password should contain atleast one number and one special character";
    }
}

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

