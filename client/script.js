import bot from './assets/bot.svg'; // https://www.flaticon.com/authors/freepik
import user from './assets/user.svg'; // https://www.flaticon.com/authors/freepik

const form = document.querySelector('form') // form
const chatBox = document.querySelector('#chat_container') // chat container
let loadInterval;

function loader(element) { // element is the message div
    element.textContent = ''

    loadInterval = setInterval(() => { 
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {  
            element.textContent = '';
        }
    }, 300);
}


function typeText(element, text) { // element is the message div
    let index = 0

    let interval = setInterval(() => { 
        if (index < text.length) {
            element.innerHTML += text.charAt(index); // to add the text to the message div
            index++;
        } else {
            clearInterval(interval) // to stop the interval
        }
    }, 20)
}


function generateUniqueId() { // generates a unique id for each message div
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile"> 
                    <img 
                      src=${isAi ? bot : user}  
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault() // to prevent the page from reloading

    const data = new FormData(form) // to get the form data

    // user's chatstripe
    chatBox.innerHTML += chatStripe(false, data.get('prompt')) // to add the user's message to the chat container
    // to clear the textarea input 
    form.reset()

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatBox.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    chatBox.scrollTop = chatBox.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = "..."
    loader(messageDiv)

    const response = await fetch("https://chatbot-sijj.onrender.com/", 
    // const response = await fetch("https://chatai-zv7c.onrender.com", 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval) // to stop the loading indicator
    messageDiv.innerHTML = " " // to clear the loading indicator

    if (response.ok) {
        const data = await response.json(); // to get the response data
        const parsedData = data.bot.trim(); // trims any trailing spaces/'\n' 

        typeText(messageDiv, parsedData)
    } else {
        const err = await response.text(); // to get the error message

        messageDiv.innerHTML = "Something went wrong" // to clear the loading indicator
        alert(err); // to display the error message
    }
}

form.addEventListener('submit', handleSubmit) // to submit the form on clicking the submit button
form.addEventListener('keyup', (e) => { // to submit the form on pressing enter
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})