document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Send login data to the server
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Read the response as plain text
            const result = await response.text();

            // Display the message in the UI
            loginMessage.innerHTML = `<h1>${result}</h1>`;
            loginMessage.style.color = 'green'; // or any other color

        } catch (error) {
            console.error('Error:', error);
            loginMessage.innerHTML = '<h1>An error occurred during login.</h1>';
            loginMessage.style.color = 'red'; // or any other color
        }
    });
});
