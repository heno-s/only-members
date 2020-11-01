# Only members website

###  __Introduction__
Project assignment comes as always from _The Odin Project_ <a href="https://www.theodinproject.com/courses/nodejs/lessons/members-only#assignment" target="_blank">lesson</a>. I really appreciate this website as it teaches beginner developers to become professionals and helps them to chase their dream. If you pay attention to the odin assignment its a bit different, because i wanted to challenge myself and create a bit more sophisticated app. The app was developed over the course of one week straight, 5-7 hours a day including design prototyping in figma, planning the application behaviour and planning code organization structure (model's structure, router's paths,  etc...)

## __About the app__
Mobile friendly, data-driven, user-based application, where users can register, create posts, become member and become an admin. Posts are displayed on the main page. Users that are not signed in will not be able to create post, become admin or become member. Member users will have the ability to change text color of their posts from default (white) to colors that are offered or have shadow on text with different colors by their pick. In addition they have the ability to see original posts of all users. Every user that is signed in will be able to edit his post or delete it. Only admin user can delete whichever post he wants.


### _Frameworks_
1. back-end:
   - Express
2. front-end:
   - \-

### Takeaways from this project
a lot of small things such as:
- _var_ variables are stored in window object while _const_ and _let_ are not.
- script in html that has the _src_ attribute will not execute what is between its tags
- forms with _GET_ request method will send _GET_ request along with queries in format <\input-nameAttribute>=<\input-value>
- realized workaround: if i really for some reason need to send data along with GET request, it is possible via queries.
- JS optional chaining operator (pretty new feature - 2020)
- what term short-circuiting means
- what is operator associativity and when it comes into picture
- code practice

### [demo](https://heno-only-members.herokuapp.com/)

<hr>

- _in case of any bugs please create an issue_
