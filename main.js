import io from 'socket.io-client'


var form = document.getElementById('form');
var room = document.getElementById('room');
var roomForm = document.getElementById('roomForm');
var input = document.getElementById('input');
var id = null;
var typingElement = document.getElementById('typing');

var auth = document.getElementById('auth');
var signInForm = document.getElementById('signInForm');
var signUpForm = document.getElementById('signUpForm');
var authError = document.getElementById('authError');

const user = {
    email: '',
    token:'',
    refreshToken: '',
    localId: ''
}

signUpForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Last button in the form
    authUser('signUp');
});

signInForm.addEventListener('submit', function(e) {
    e.preventDefault();
    authUser('signIn');
});

const authErrorDisplay = (message) => {
    authError.textContent = message;
    authError.style.display = 'block';
}
const switchAuthModeHandler = (mode) => {
    if (mode === 'signUp') {
        const button = signUpForm.querySelector('button[class="secondary"]');
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            signInForm.style.display = 'flex';
            signUpForm.style.display = 'none';
        });
    } else {
        const button = signInForm.querySelector('button[class="secondary"]');
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            signInForm.style.display = 'none';
            signUpForm.style.display = 'flex';
        });
    }
}

switchAuthModeHandler('signUp');
switchAuthModeHandler('signIn');

const parseFirebaseResponse = (data) => {
    user.email = data.email;
    user.idToken = data.idToken;
    user.refreshToken = data.refreshToken;

    localStorage.setItem('user', JSON.stringify(user));


    socketInit();

}

const authUser = (mode) => {
    let email;
    let password;
    if (mode === 'signIn') {
        email = signInForm.querySelector('input[class="email"]').value;
        password = signInForm.querySelector('input[class="password"]').value;
    } else {
        email = signUpForm.querySelector('input[class="email"]').value;
        password = signUpForm.querySelector('input[class="password"]').value;
    }
    // Fetch with POST method
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode === 'signIn' ? 'signInWithPassword' : 'signUp'}?key=AIzaSyBd8yhnU-E1Blg3Dae3-UpAYf4LIDEBv8E`;
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function(res) {
        return res.json();
    }).then(function(data) {
        console.log(data);
        if (data.error) {
            authErrorDisplay(data.error.message);
        } else {
            parseFirebaseResponse(data);
            auth.style.display = 'none';
        }
    });
}

const socketInit = (authUser=user) => {
    const socket = io('http://localhost:3000', {
        auth: {
            user: authUser
        }
    });

    socket.on('chat message', function(msg) {
        var item = document.createElement('li');
        item.textContent = msg;
        var messages = document.getElementById('messages');
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });

    socket.on('connect', function() {
        console.log('connect');
        // Join room
        room.value = '1';
        socket.emit('join', room.value);
        id = socket.id;
        authError.style.display = 'none';
    });

    socket.on('history', function(history) {
        console.log('history', history);
        var messages = document.getElementById('messages');
        messages.innerHTML = '';
        history.forEach(function(msg) {
            var item = document.createElement('li');
            item.textContent = msg;
            messages.appendChild(item);
        });
        window.scrollTo(0, document.body.scrollHeight);
    });

    socket.on('typing', function(typing,id) {
        // IF it's me, don't show typing
        if (id !== socket.id) {
            typingElement.attributes['data-user'].value = id;
            if (typing) {
                typingElement.style.display = 'block';
            } else {
                typingElement.style.display = 'none';
            }
        }
    });

    socket.on('connect_error', function(err) {
        localStorage.removeItem('user');
        auth.style.display = 'flex';
        authErrorDisplay(err.message);

    });

    input.addEventListener('keypress', function(e) {
        const timeout = setTimeout(function() {
            if (input.value === '') {
                socket.emit('typing', false, room.value);
                return;
            }
            socket.emit('typing', true, room.value);
            clearTimeout(timeout);
        }, 300);
    });

// Event listener to check if input value is empty
    input.addEventListener('keyup', function(e) {
        const timeout = setTimeout(function() {
            socket.emit('typing', false, room.value);
            clearTimeout(timeout);
        }, 2000);
    });
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (input.value) {
            socket.emit('chat message', input.value, room.value);
            input.value = '';
        }
    });

    roomForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (room.value) {
            socket.emit('join', room.value);
            typingElement.style.display = 'none';
        }
    });



    return socket;
}

const checkLocalStorage = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        socketInit(user);
    } else {
        auth.style.display = 'flex';
    }
}
checkLocalStorage();