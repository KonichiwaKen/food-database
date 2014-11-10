CREATE TABLE Allergy (
  allergy_id INTEGER NOT NULL PRIMARY KEY,
  fish_contains BOOLEAN,
  nut_contains BOOLEAN,
  lactose_contains BOOLEAN,
  meat_contains BOOLEAN, 
  gluten_contains BOOLEAN
);
 
CREATE TABLE Food (
  food_id INTEGER NOT NULL PRIMARY KEY,
  allergy_id INTEGER NOT NULL REFERENCES Allergy(allergy_id),
  category_id VARCHAR(50) NOT NULL,
  name VARCHAR(50) NOT NULL,
  calories INTEGER NOT NULL,
  cost DECIMAL(4, 2) NOT NULL,
  location VARCHAR(50) NOT NULL,
  CHECK(cost >= 0 AND calories >= 0)
);

CREATE TABLE Student (
  netid VARCHAR(10) NOT NULL PRIMARY KEY,
  meal_allotment DECIMAL(5, 2) NOT NULL,
  gluten_allergy BOOLEAN NOT NULL,
  fish_allergy BOOLEAN NOT NULL,
  lactose_allergy BOOLEAN NOT NULL,
  nut_allergy BOOLEAN NOT NULL,
  meat_allergy BOOLEAN NOT NULL,
  CHECK(meal_allotment >= 0)
);
 
CREATE TABLE Trend (
  food_id INTEGER NOT NULL REFERENCES Food(food_id),
  time TIME NOT NULL,
  date DATE NOT NULL,
  netid VARCHAR(10) NOT NULL REFERENCES Student(netid),
  PRIMARY KEY(food_id, time, date, netid),
  CHECK(date <= CURRENT_DATE)
);