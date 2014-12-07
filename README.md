# SnackTrack: Food point calculator and food trend analyzer #

Course project for Database Systems class. Our webapp helps student figure out meal options given their current food point balance as well as any dietary restrictions they may have. Based on what students' decide to eat, we will then be calculating food trends on campus and presenting that data to the user. There will be two main datasets that we will be analyzing: food served on campus and students' eating habits. With the first dataset, we will store data on the food served on campus. We store nutritional information, ingredients (lactose intolerant, gluten-free, etc), location served, and cost. The second dataset will be students' eating habits on campus. We will be tracking what foods people are eating, where they are eating, when they are eating those foods, and other assorted info. We will then use this info to visualize trends on campus.

### Requirements ###

* Node.js
* MongoDB

### How to run ###

Navigate to the food-database folder in a shell, and run "npm install" to install the necessary dependencies. In a separate shell, run "mongod" to start the MongoDB server. Once the MongoDB server is up and running, execute "npm start" to start the webapp. In your browser, navigate to http://localhost:3000 to view the webapp.

### Contributors ###

* Dan Celebucki
* Randy Johnson
* Ken McAndrews
* Inan Tainwala
