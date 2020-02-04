![logo](https://pedroruizhidalgo.es/assets/img/logo.svg)
# Auth-mysql v2.0.0
By Pedro Ruiz Hidalgo

---

## Abstract
The organization is based on the owner concepts to which the applications that have subscribed users belong. In other words, you must start creating an owner, then create an application and then its users.
Each user is identified by email as a unique key in the owners table. Then, each application is created by a single owner.
Everything **Auth-mysql v 2.0.2** is built under the concept of *cascade*, which means that if you delete an owner, all applications and users will also be deleted. Consequently, in case of elimination of the application, all its users will disappear. Only the removal of a single user has no other effect than this removal process.
All passwords have secure cryptographic storage. Both owners and applications will be identified by uuid provided by the application.

# Routes
All routes must be accessed following the specification of this table

| header | value |
|--------|-------|
| Content-Type | application/json |

### Owners
Path **~/appowner/create** POST method.
Request data sample
~~~json
{
	"firstname": "Jason",
	"lastname": "Bourne",
	"email": "jbourne@gmail.com",
	"password": "theverymuchsecretpasswordofjasonbourne"
}
~~~
It produces a response like
~~~json
{
    "firstname": "Jason",
    "lastname": "Bourne",
    "email": "jbourne@gmail.com",
    "deletion_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Impib3VybmVAZ21haWwuY29tIiwiaWF0IjoxNTgwODQ0MTc0fQ.6s09oEfJrNutXoqgkbVRk_IwJXP2BMkiHGjF7qzppVY",
    "uuid": "858afac0-28cd-4ea7-99ca-f262941a8a7e"
}
~~~
(Obviously deletion_token and uuid are samples.)

Path **~/appowner/uuid/:uuid** GET method.
~~~html
~/appowner/uuid/858afac0-28cd-4ea7-99ca-f262941a8a7e
~~~

Responses as
~~~json
{
    "firstname": "Jason",
    "lastname": "Bourne",
    "email": "jbourne@gmail.com",
    "deletion_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Impib3VybmVAZ21haWwuY29tIiwiaWF0IjoxNTgwODQ0MTc0fQ.6s09oEfJrNutXoqgkbVRk_IwJXP2BMkiHGjF7qzppVY",
    "uuid": "858afac0-28cd-4ea7-99ca-f262941a8a7e"
}
~~~

Path **~/appowner/emailpassword/:email/:password** GET method.
~~~html
~/appowner/emailpassword/jbourne@gmail.com/theverymuchsecretpasswordofjasonbourne
~~~
Has the same result of Path **~/appowner/uuid/:uuid** GET method.

Path **~/delete** DELETE method.
Send this to delete your stored `owner`
~~~json
{
	"deletion_token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Impib3VybmVAZ21haWwuY29tIiwiaWF0IjoxNTgwODQ0MTc0fQ.6s09oEfJrNutXoqgkbVRk_IwJXP2BMkiHGjF7qzppVY",
	"uuid" : "858afac0-28cd-4ea7-99ca-f262941a8a7e"
}
~~~
Produces
~~~json
{
    "affectedRows": 1,
    "insertId": 0,
    "warningStatus": 0
}
~~~

Path **~/update** POST method.
Send
~~~json
{
	"uuid": "de54e724-d488-4f87-80a8-9ae754986e51",
	"firstname": "Jason",
	"lastname": "Bourne",
	"email": "myotheremail@gmail.com",
	"password": "otherpassword"
}
~~~
To get the response
~~~json
{
    "status": 202,
    "affectedRows": 1
}
~~~
*(The http status `202` means `Accepted`)*

### Applications


(here goes applications)


### Users


(here goes users)

---
<span style="font-size:0.85em;">Copyleft <img src="https://techcontracts.com/sitefiles/wp-content/uploads/2018/01/Copyleft_image-300x300.jpg" width=10> 2020 Pedro Ruiz-Hidalgo, Twitter: **@pedroruizhidalg**</span>