if (localStorage.length > 0) {
    const tokenObject = JSON.parse(localStorage.getItem('myData'));
    console.log(tokenObject);

    if (!tokenObject || !tokenObject.token) {
        console.error('Токен не найден в Local Storage');

    } else {
        const token = tokenObject.token;
        console.log(token);
        fetch('http://localhost:8000/auth/getUsers', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Данные получены:', data);
                hideform()
                localStorage.setItem('myData', JSON.stringify(data));
                showError(`вы успешно вошли в аккаунт!`)
                let b = document.getElementById('error-container')
                b.style.background = 'blue'
                getPosts()
            })
            .catch(error => {
                console.error('Произошла ошибка:', error.message);
                showError(`Произошла ошибка : ${error.message} при загрузке данных.`);


            })
    }
}
let usernameGLOBAL = ''
const regbtn = document.getElementById(`regbtn`)
regbtn.addEventListener((`click`),()=>{
    let a = document.getElementById(`form`)
    a.style.display=`none`
    let b = document.getElementById('regform')
    b.style.display='block'
   
    
    
    
})
const logbtn = document.getElementById(`logbtn`)
logbtn.addEventListener((`click`),()=>{
    let a = document.getElementById(`form`)
    a.style.display=`block`
    let b = document.getElementById('regform')
    b.style.display='none'
    
})

function registerUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    usernameGLOBAL = username
    const requestBody = JSON.stringify({ username, password });
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: requestBody
    };
    const apiUrl = 'http://localhost:8000/auth/login';
    fetch(apiUrl, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
                showError(`Проверьте правильность пароля и логина`)
            }
            return response.json();
        })
        .then(data => {
            localStorage.clear
            localStorage.setItem('myData', JSON.stringify(data));
            hideform()
            getPosts()
            showError(`вы успешно вошли в аккаунт!`)
            let b = document.getElementById('error-container')
            b.style.background = 'blue'

        })
        .catch(error => {
            console.error('Ошибка при входе:', error);
            showError(error)
    });        
}
function hideform() {
    document.getElementById('form').style.display = 'none'
    document.getElementById('regform').style.display = 'none'
    let a = document.getElementById('container')
    a.style.display = 'flex'
    
}
function authUser() {
    const username = document.getElementById('usernameReg').value;
    usernameGLOBAL = username
    const password = document.getElementById('passwordReg').value;
    const requestBody = JSON.stringify({ username, password });
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: requestBody
    };
    const apiUrl = 'http://localhost:8000/auth/registration';
    fetch(apiUrl, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
                showError(`Проверьте правильность пароля и логина`)
            }
            return response.json();
        })
        .then(data => {
            localStorage.clear
            localStorage.setItem('myData', JSON.stringify(data));
            hideform()
            getPosts()
            showError(`вы успешно зарегистрировались!`)
            let b = document.getElementById('error-container')
            b.style.background = 'blue'

        })
        .catch(error => {
            console.error('Ошибка при регистрации:', error);
            showError(error)
    });        
}




function getPosts() {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const apiUrl = 'http://localhost:8000/post/getPosts';

    fetch(apiUrl, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
                showError(`HTTP error! Status: ${response}`)
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            drawPost(data)

        })
        .catch(error => {
            showError('Ошибка при получении постов:', error);
            console.log(error);
            
        });

}
function drawPost(data){
    let usernames = data.map(item => item.username);
    let texts = data.map(item => item.text);
    let dates = data.map(item => item.date);
    const currentUser = usernameGLOBAL;
    console.log(`ok`);

    console.log('Usernames:', usernames);
    console.log('Texts:', texts);
    console.log('Dates:', dates);
    const postsContainer = document.getElementById('post-container');
    const postsHtml = data.map(post => {
        const isCurrentUserPost = post.username === currentUser;
        const editButton = isCurrentUserPost ? `<button onclick="editPost('${post._id}')">Редактировать</button>` : '';
        const deleteButton = isCurrentUserPost ? `<button onclick="deletePost('${post._id}')">Удалить</button>` : '';
    
        return `
        <div id="${post._id}">
            <p><strong>Username:</strong> ${post.username}</p>
            <p><strong>Text:</strong> ${post.text}</p>
            <p><strong>Date:</strong> ${post.date}</p>
            <button onclick="fetchAndRenderComments('${post._id}')" id='check${post._id}'>посмотреть комментарии</button>
            <button onclick="addComment('${post._id}')">оставить комментарии</button>
            <div id='comments${post._id}'></div>
            ${editButton}
            ${deleteButton}
          </div>`;
      }).join('');
      postsContainer.innerHTML = postsHtml;
      
}
function deletePost(postId) {
    fetch(`http://localhost:8000/post/deletePost/${postId}`, {
    method: 'DELETE',
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.message);
    showError(`пост удален!`)
    let b = document.getElementById('error-container')
    b.style.background = 'blue'
    getPosts()
  })
  .catch(error => {
    console.error('Ошибка:', error)
    showError(error)
});
}

function editPost(PostId){
    const postContainer = document.getElementById(PostId);

    const inputElement = document.createElement('input');
    inputElement.className = 'editInput'
  
    // Создаем кнопку Сохранить
    const saveButton = document.createElement('button');
    
    saveButton.textContent = 'Сохранить';
    saveButton.onclick = function() {
     editedPost(PostId, inputElement.value);
    };
  
    // Добавляем input и кнопку Сохранить
    postContainer.appendChild(inputElement);
    postContainer.appendChild(saveButton);

}
function editedPost(postId,textNew) {
    fetch(`http://localhost:8000/post/editPost/${postId}`, {
    method: 'PUT', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        newText : textNew,
    }),
    })
    .then(response => response.json())
    .then(data => {
    console.log(data.message);
    getPosts()
    showError(`пост изменен!`)
    let b = document.getElementById('error-container')
    b.style.background = 'blue'
    getPosts()
    })
    .catch(error => {
        console.error('Ошибка:', error)
        showError(error)
    }); 
    

}





function createPost() {
    const username = usernameGLOBAL;
    console.log(username);
    const text = document.getElementById('postText').value
    const date = new Date()
    const requestBody = JSON.stringify({ username, text, date });
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: requestBody
    };

    const apiUrl = 'http://localhost:8000/post/create';

    fetch(apiUrl, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Пост успешно создан:', data);
            showError(`пост успешно создан!`)
            let b = document.getElementById('error-container')
            b.style.background = 'blue'
            getPosts()

        })
        .catch(error => {
            showError('Ошибка при создании поста:', error);
            
        });

}



function showError(message) {
    const errorContainer = document.getElementById('error-container')
    errorContainer.textContent = message

    errorContainer.classList.add('show')

    setTimeout(() => {
        hideError();
    }, 5000);
}
function hideError() {
    const errorContainer = document.getElementById('error-container')
    errorContainer.classList.remove('show')
}


function fetchAndRenderComments(postId) {
    const commentsContainer = document.getElementById(`comments${postId}`);
    commentsContainer.innerHTML = ''
    fetch(`http://localhost:8000/comments/getComments/${postId}`)
      .then(response => response.json())
      .then(comments => {
        if (comments.length < 1){
            showError(`комментариев пока нет!`)
            let b = document.getElementById('error-container')
            b.style.background = 'blue'
            console.log(comments);
        }else{
            comments.forEach(comment => {
                renderComment(postId, comment);
                console.log(comments);
              });
        }
      })
      .catch(error => {
        console.error('Ошибка при получении комментариев:', error)
        showError(error)
    });
  }
  
function renderComment(postId, comment) {
    const mainCon = document.getElementById(`comments${postId}`)
    const commentDiv = document.createElement('div');
    const btn = document.getElementById(`check${postId}`)
    btn.style.display = `none`
    commentDiv.className = `${comment._id}`;
    commentDiv.style.border = '1px solid black'
  
    const usernameElement = document.createElement('p');
    usernameElement.textContent = `Пользователь: ${comment.username}`;
  
    const textElement = document.createElement('p');
    textElement.textContent = `Текст комментария: ${comment.text}`;
  
    const dateElement = document.createElement('p');
    dateElement.textContent = `Дата: ${new Date(comment.date).toLocaleString()}`;
    const username = usernameGLOBAL
    if(username == comment.username){
        const deleteElement = document.createElement('img')
    deleteElement.style.backgroundImage = `url(https://yt3.googleusercontent.com/pO71HOMdfTxlILxkXa7C8HfYCe0R3nE4_HRpjQ2OJSM8O-I3hlUsSGHkDNjNbxVRXBBThYJPxQ=s900-c-k-c0x00ffffff-no-rj)`
    deleteElement.style.width = '20px'
    deleteElement.style.height = '20px'
    deleteElement.style.backgroundSize = 'contain'
    deleteElement.style.backgroundRepeat = 'no-repeat'
    deleteElement.addEventListener((`click`),(e)=>{
        deleteComment(comment._id,postId)
    }  
    )
    const editElement = document.createElement('img')
    editElement.style.backgroundImage = `url(https://i.ytimg.com/vi/CYAMN-vBqtU/maxresdefault.jpg)`
    editElement.style.width = '20px'
    editElement.style.height = '20px'
    editElement.style.backgroundSize = 'cover'
    editElement.style.backgroundRepeat = 'no-repeat'
    editElement.addEventListener((`click`),(e)=>{
        let a = prompt('введите новый текст комментария')
        editComment(comment._id,a,postId)
    }  
    )
    commentDiv.appendChild(deleteElement);
    commentDiv.appendChild(editElement);
    }
  
    commentDiv.appendChild(usernameElement);
    commentDiv.appendChild(textElement);
    commentDiv.appendChild(dateElement);
    mainCon.appendChild(commentDiv)
}
function addComment(postId) {
    const username = usernameGLOBAL;
    const text = prompt(`текст комментария`)
    const date = new Date()
  
    fetch('http://localhost:8000/comments/createComment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId: postId,
        username: username,
        text: text,
        date: date
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        fetchAndRenderComments(postId);
        showError(`комментарий добавлен!`)
        let b = document.getElementById('error-container')
        b.style.background = 'blue'
        getPosts()
      })
      .catch(error => {
        console.error('Ошибка при добавлении комментария:', error)
        showError(error)
    });
  }

function deleteComment(commentId,postId) {
    fetch(`http://localhost:8000/comments/deleteComment/${commentId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        fetchAndRenderComments(postId);
        console.log(postId);
        showError(`коментарий удален!`)
        let b = document.getElementById('error-container')
        b.style.background = 'blue'
        getPosts()
        
      })
    .catch(error => {
        console.error('Ошибка при удалении комментария:', error)
        showError(error)
    });
}
function editComment(commentId,Newtext,postId) {
  
    fetch(`http://localhost:8000/comments/editComment/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: Newtext,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        fetchAndRenderComments(postId); 
        showError(`коментарий изменен!`)
        let b = document.getElementById('error-container')
        b.style.background = 'blue'
        getPosts()
      })
      .catch(error => {
        console.error('Ошибка при редактировании комментария:', error)
        showError(error)
    });
  }
  