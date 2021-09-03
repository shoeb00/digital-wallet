async function handleSubmit (e) {
    e.preventDefault();
      data = {
        amount : $('#amount').val(),
        description : $('#description').val(),
        type : $("input[type='radio'][name='transaction-type']:checked").val(),
      }
  
      let response = await fetch(`/transaction`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
      })
  
      let text = await response.text(); // read response body as text
      console.log(text)
      window.location.href = window.location.origin + "/home";
  };
  
  const formEle = document.querySelector("#register-form");
  if(formEle) {
      formEle.addEventListener('submit', handleSubmit);
  }

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
    $('.warning').css('display', 'none')
    $('.transaction').css('display', 'none')
    $('.navbar').css('display', 'inline')
}

