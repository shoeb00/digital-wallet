async function handleSubmit (e) {
  e.preventDefault();
    data = {
      name : document.querySelector('#name').value,
      balance : document.querySelector('#balance').value,
    }

    let response = await fetch('/setup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
    })

    let text = await response.text(); // read response body as text
    document.write(text);
};

const formEle = document.querySelector("#register-form");
if(formEle) {
    formEle.addEventListener('submit', handleSubmit);
}