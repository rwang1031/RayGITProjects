///<reference path="~/Scripts/jquery-1.10.2.js" />
///<reference path="~/Scripts/Main.js" />
///<reference path="~/Site.Master"/>

function Ray_ValidateEmail(mail) {
  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
   if (regex.test(mail))   
      return true;
   else      
  return false;
}

//Validate if the target is an empty string
function Ray_ValidateEmpty(target) 
{
    if ($.trim(target.toString()) == "") {       
        return false;
    }
    else{
        return true;
    }
}

function Ray_ValidatePhone(phone) {
    var regex = /^\d{3}-\d{3}-\d{4}|\d{10}$/;
     if (regex.test(phone))
        return true;
    else
        return false;
}

function Ray_ValidateName(name) {
    var regex = /^[a-zA-Z ]{1,15}$/;
    if (regex.test(name)) {        
        return true;
    }
    else{
        return false;
    }
}

function Ray_CheckEmailExistence(email,callSuccess) {
    $.ajax({
        type: "post",
        url: "WebService.asmx/Check_Email_Existence",
        data: "{'email':'"+email+"'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: callSuccess,
        error: function (request, errortext, errorCode) { alert("error:" + errortext.toString() + errorCode); }
    });
}

function Ray_CheckEmailCallback(result) {
    if (result.hasOwnProperty("d")) {
        result = result.d;
    }
    if (result == "false") {
        $('#email_e_warning').addClass("hidden");
        if (!Ray_ValidateEmail($('#tb_customer_email').val())) {         
            setTimeout(function () {
                $('#e_exist').remove();
                $('#tb_customer_email').siblings('.check_img').remove().end().siblings('.warning').removeClass('hidden');           
             }, 300)  
        }
        else {
            if ($('#tb_customer_email').siblings('.check_img').length <= 0)
                setTimeout(function () {
                    $('#e_exist').remove();
                    $('#tb_customer_email').after("<img alt='validated' class='check_img' src='Images/check_mark_green.png'/>").siblings('.warning').addClass('hidden');
                }, 300)
                
        }
    }
    else if (result == "true") {
        $('#email_e_warning').removeClass("hidden");
        
        setTimeout(function () {
            $('#e_exist').remove();
            $('#email_e_warning').siblings(".warning").addClass("hidden"); 
        }, 300)  
    }
         
}