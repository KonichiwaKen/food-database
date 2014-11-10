DELETE FROM Student;

DELETE FROM Trend;

-- Populating Student table with sample students

INSERT INTO Student VALUES
  ('abc123', 10, FALSE, FALSE, FALSE, FALSE, FALSE);

INSERT INTO Student VALUES
  ('def456', 7, FALSE, FALSE, FALSE, FALSE, TRUE);

-- Getting all food Student abc123 can eat for a meal

SELECT food_id
FROM Food, Student
WHERE Food.allergy_id NOT IN (
	SELECT allergy_id
	FROM Allergy, Student
	WHERE (
		gluten_contains IS TRUE AND
		gluten_allergy IS TRUE OR
		fish_contains IS TRUE AND
		fish_allergy IS TRUE OR
		lactose_contains IS TRUE AND
		lactose_allergy IS TRUE OR
		nut_contains IS TRUE AND
		nut_allergy IS TRUE OR
		meat_contains IS TRUE AND
		meat_allergy IS TRUE
	) AND netid = 'abc123'
) AND cost < meal_allotment
AND netid = 'abc123';

-- Getting all food Student def456 can eat for a meal

SELECT food_id
FROM Food, Student
WHERE Food.allergy_id NOT IN (
  SELECT allergy_id
  FROM Allergy, Student
  WHERE (
    gluten_contains IS TRUE AND
    gluten_allergy IS TRUE OR
    fish_contains IS TRUE AND
    fish_allergy IS TRUE OR
    lactose_contains IS TRUE AND
    lactose_allergy IS TRUE OR
    nut_contains IS TRUE AND
    nut_allergy IS TRUE OR
    meat_contains IS TRUE AND
    meat_allergy IS TRUE
  ) AND netid = 'def456'
) AND cost < meal_allotment
AND netid = 'def456';

-- Inserting a Student's food option into trends

INSERT INTO Trend VALUES
  (1, '19:30', '2014-10-16', 'abc123');

INSERT INTO Trend VALUES
  (3, '18:30', '2014-10-16', 'def456');

-- Getting food trend at a restaurant

SELECT food_id, COUNT(food_id) AS total
FROM Trend
WHERE food_id IN (
  SELECT food_id
  FROM Food
  WHERE location = 'ABP'
) AND date >= '2014-10-12'
AND date < '2014-10-19'
GROUP BY food_id;

-- Getting category trend at all restaurants

SELECT food_id, COUNT(food_id) AS total
FROM Trend
WHERE food_id IN (
  SELECT food_id
  FROM Food
  WHERE category_id = 'Sandwich'
) AND date >= '2014-10-12'
AND date < '2014-10-19'
GROUP BY food_id;