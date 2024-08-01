# nutrition_recommendations_react_js

### === Get Started ===
#### Dependences
```
npm install -g nodemon
```
#### Server
```
cd server
npm install
nodemon index
```
#### Client
```
cd client
npm install
npm start
```

#### Copy Database Sample Command
```
COPY food(fdc_id, data_type, description, food_category_id, publication_date)
FROM '/tmp/food.csv'
DELIMITER ','
CSV HEADER
NULL '';
```
> if run into error about permission issue, then move the target file into "/tmp" folder to bypass permission issue

### === DB test commands ===
```
CREATE TABLE todo(
	todo_id SERIAL PRIMARY KEY,
	description VARCHAR(255)
);

CREATE TABLE personal_info(
	user_id INT,
	age INT,
	height INT,
	weight INT
);

CREATE TABLE selected_personal_info(
	user_id INT,
	age INT,
	height INT,
	weight INT
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);


SELECT * FROM todo
SELECT * FROM personal_info
SELECT * FROM selected_personal_info
SELECT * FROM users

DELETE FROM todo;
DELETE FROM personal_info;
DELETE FROM selected_personal_info;
DELETE FROM users;

DROP TABLE personal_info;
DROP TABLE selected_personal_info;


-- =====
CREATE TABLE food (
  	fdc_id INT,
	data_type VARCHAR(50),
	description TEXT,
	food_category_id VARCHAR(50),
	publication_date DATE
);

CREATE TABLE user_favorite (
  	fdc_id INT,
	data_type VARCHAR(50),
	description TEXT,
	food_category_id VARCHAR(50),
	publication_date DATE
);

select * from food;
DROP TABLE food;

COPY food(fdc_id, data_type, description, food_category_id, publication_date)
FROM '/tmp/food.csv'
DELIMITER ','
CSV HEADER
NULL '';
```