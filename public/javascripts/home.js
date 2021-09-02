// function validate(e){
//     $('.my-form').submit((e)=>{
//         e.preventDefault();
//         if($('#amount') <= 0) {
//             $('transaction-type').after('<span class="error">Amount cannot be negative</span>');
//         }
//     })
    
// }

function confirmTransaction(event){
    const amount = $('#amount').val()
    console.log(amount, '-')
    if($.isNumeric(amount) === false|| amount <= 0) {
        event.preventDefault();
        console.log('stuck ')
        $('.warning').css('display', 'inline')
        return false
    }
    event.returnValue = true;
}

function transaction(){
    $('.transaction').css('display', 'inline')
    $('.navbar').css('display', 'none')
}

function cancelTransaction(){
    $('#amount').val('')
    $('#description').val('')
    $('#credit').val('checked')
    $('.transaction').css('display', 'none')
    $('.navbar').css('display', 'inline')
}

