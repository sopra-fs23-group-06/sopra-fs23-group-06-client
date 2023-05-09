window.alert = function(message,timeout=5000){
    const alert = document.createElement('div');
    const alertButton = document.createElement('button')
    alertButton.innerText= 'OK'
    alert.classList.add('alert');
    alert.setAttribute('style',`
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 10px 5px 0 #00000022;
        display: flex;
        flex-direction: column;
        background-color: rgba(0, 0, 0, 0.336);
        justify-content: center;
        align-items: center;
        color: white;
    `);
    alertButton.setAttribute('style',`
        border: 1px solid #333;
        background: blue;
        width: 10%;
        height: 5%;
        border-radius: 5px;
        padding: 5px;
        color: white;
    `);
    alert.innerHTML = `<span style="padding: 20px">${message}</span>`;
    alert.appendChild(alertButton);
    alertButton.addEventListener('click',(e)=>{
        alert.remove();
    })
    if(timeout!=null){
        setTimeout(()=>{
            if(alert) alert.remove();
        },Number(timeout))
    }
    document.body.appendChild(alert);
}