# Authentication and Authorization(password reset flow)

### Postman documentation
https://documenter.getpostman.com/view/16251431/UVCCej34


## Endpoints
POST /register

POST /login

POST /forgotPassword

POST /linkvalid

POST /verification

POST /Newpassword

Get /note

POST /note

### POST Register
https://auth7799.herokuapp.com/register

Bodyraw (json)
{
  "firstname": "firstname",
  "lastname": "lastname",
  "email": "email@gmail.com",
  "password": "qwertyuiop"
}

### POST Login
https://auth7799.herokuapp.com/login

Bodyraw (json)
{
  "email": "email@gmail.com",
  "password": "qwertyuiop"
}

### POST forgotPassword
https://auth7799.herokuapp.com/forgotPassword

Bodyraw (json)
{
  "email": "email@gmail.com",
  "time": 1637157038143 // time stamp
}

### POST linkvalid
https://auth7799.herokuapp.com/linkvalid

Bodyraw (json)
{
  "time": 1637157038145, // time stamp
  "id": "618f5a776e5800e6584cb0b4"
}
### POST verification
https://auth7799.herokuapp.com/verification

Bodyraw (json)
{
  "code": "zww0cf",//OTP
  "id": "618f5a776e5800e6584cb0b4"
}

### POST Newpassword
https://auth7799.herokuapp.com/Newpassword

Bodyraw (json)
{
  "password": "qwertyuiopq",
  "id": "618f5a776e5800e6584cb0b4"
}

### GET note
https://auth7799.herokuapp.com/note

Authorization
Bearer Token

### POST note-post
https://auth7799.herokuapp.com/note 
Authorization
Bearer Token

Bodyraw (json)
{
    "email":"email@gmail.com",
    "note":"hello World!"
}
