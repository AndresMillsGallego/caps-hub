# CAPS - Event Driven Applications

**Lab 08**

For this lab we tackled `authentication` and implementing `RBAC` roles into new routes! 

PR links can be found at the bottom of this document[^1]

[GitHub Repo](https://github.com/AndresMillsGallego/auth-api)

[Heroku Deployed Link](https://andresmills-auth-api.herokuapp.com/)

![Class 08 UML](./class-08-UML.png)

## Installation

To install this app just follow these steps:

- Clone down this repo
- CD into your new directory
- npm install

And that is it!

[Sequelize Docs](https://sequelize.org/)
[JWT Docs](https://jwt.io/introduction)
[JWT Repo](https://github.com/auth0/node-jsonwebtoken)


## Usage

A good introduction to the inner workings of sequelize, postgres and how to create and use the database.  To add to this, we are working on implementing authorzation into our apps, so that only an authorized user can access their account / db.

Authentication and Authorization are both integral parts of many web apps.  While it is true that many of these systems are automated, this app provides a good chance to practice implementing an app with `bearer auth` in it's routes.

Now that we have `bearer auth` up and running let's add `RBAC` routes so that each role has ways to appropriately access what they need. 
For this app we have:
- `User`
- `Writer`
- `Editor`
- `Admin`

All with their own `capabilities`

## Contributors / Authors

Project by: Andres Mills Gallego

[My GitHub](https://github.com/AndresMillsGallego)

[My LinkedIn](https://www.linkedin.com/in/andres-mills-gallego/)

## Features / Routes

I used `sequelize`, `postgres`, `express`, `jest` to build and test this app.  It is a **REST** app and uses `GET`, `PUT`, `POST` and `DELETE` routes.  These are all used in separate Router files for each model.

For authentication I used `base64`, `bcrypt` and tested with `supertest`
I also used `JSONWebToken` to generate and use the `JWT` tokens.

We used 3 different routers, each with different paths that a user can access depending on:

1. If necessary, they are authenticated

and/or

2. They have access based on their role.

## Pull Requests

[^1]: [Class 08 Pull Request](https://github.com/AndresMillsGallego/auth-api/pull/1)