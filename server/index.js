const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcrypt');

app.use(cors());
app.use(express.json());

// Login
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const queryText = 'INSERT INTO users(username, password) VALUES($1, $2) RETURNING id';
        const values = [username, hashedPassword];
        const result = await pool.query(queryText, values);
        res.status(201).json({ userId: result.rows[0].id });
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).send('Error signing up');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const queryText = 'SELECT id, password FROM users WHERE username = $1';
        const values = [username];
        const result = await pool.query(queryText, values);
        
        if (result.rows.length === 0) {
        return res.status(400).send('User not found');
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
        return res.status(400).send('Invalid password');
        }

        res.status(200).json({ userId: user.id });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in');
    }
});

// Personal Info
app.post('/personal_info', async (req, res) => {
    try{
        const { user_id, age, height, weight } = req.body;

        const queryText = 'INSERT INTO personal_info(user_id, age, height, weight) VALUES($1, $2, $3, $4)';
        const values = [user_id, age, height, weight];
        await pool.query(queryText, values);
        res.status(200).send('Update personal info successfully');
    }
    catch(err){
        console.error(err.message);
    }
});

app.get('/personal_info/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const todo = await pool.query("SELECT * FROM personal_info WHERE user_id = $1", [id]);
        res.json(todo.rows[0]);
    }
    catch(err){
        console.error(err.message);
    }
});

app.get('/personal_info', async (req, res) => {
    try{
        const allUser = await pool.query("SELECT * FROM personal_info");
        res.json(allUser.rows);
    }
    catch(err){
        console.error(err.message);
    }
});

app.post('/add_food', async (req, res) => {
    const { fdc_id } = req.body;

    try {
        // const queryText = 'INSERT INTO selected_personal_info (user_id, height) VALUES ($1, $2) ON CONFLICT (user_id) DO NOTHING';
        const queryText = 'INSERT INTO user_favorite (fdc_id) VALUES ($1)';
        const values = [fdc_id];
        await pool.query(queryText, values);
        res.status(201).send('User added to user_favorite');
    }
    catch (error) {
        console.error('Error adding user to user_favorite:', error);
        res.status(500).send('Error adding user to user_favorite');
    }
});

app.post('/remove_food', async (req, res) => {
    const { fdc_id } = req.body;

    try {
        const queryText = 'DELETE FROM user_favorite WHERE fdc_id = $1';
        const values = [fdc_id];
        await pool.query(queryText, values);
        res.status(200).send('User removed from user_favorite');
    }
    catch (error) {
        console.error('Error removing user from user_favorite:', error);
        res.status(500).send('Error removing user from user_favorite');
    }
});

// app.get('/food', async (req, res) => {
//     try{
//         const allUser = await pool.query("SELECT * FROM food LIMIT 20;");
//         res.json(allUser.rows);
//     }
//     catch(err){
//         console.error(err.message);
//     }
// });

app.get('/user_favorite', async (req, res) => {
    try{
        const allUser = await pool.query(
            // "SELECT * FROM user_favorite LIMIT 20;"
            `
            SELECT 
                f.fdc_id,
                f.description AS food_description,
                ccf.protein_value,
                ccf.fat_value,
                ccf.carbohydrate_value,
                (ccf.protein_value + ccf.fat_value + ccf.carbohydrate_value) AS total_calories,
                b.brand_owner,
                b.gtin_upc,
                b.ingredients,
                b.serving_size,
                b.serving_size_unit,
                b.branded_food_category,
                b.market_country,
                ma.brand_description,
                ma.expiration_date,
                ma.store_city,
                ma.store_name,
                ma.store_state,
                ma.upc_code
            FROM 
                user_favorite uf
            JOIN 
                food f ON uf.fdc_id = f.fdc_id
            JOIN 
                branded_food b ON f.fdc_id = b.fdc_id
            JOIN 
                market_acquisition ma ON f.fdc_id = ma.fdc_id
            JOIN 
                food_nutrient_conversion_factor fncf ON f.fdc_id = fncf.fdc_id
            JOIN 
                food_calorie_conversion_factor ccf ON fncf.id = ccf.food_nutrient_conversion_factor_id
            `
        );
        res.json(allUser.rows);
    }
    catch(err){
        console.error(err.message);
    }
});

app.get('/food', async (req, res) => {
    try{
        const allUser = await pool.query(
            `
                SELECT 
                    f.fdc_id,
                    f.description AS food_description,
                    ccf.protein_value,
                    ccf.fat_value,
                    ccf.carbohydrate_value,
                    (ccf.protein_value + ccf.fat_value + ccf.carbohydrate_value) AS total_calories,
                    b.brand_owner,
                    b.gtin_upc,
                    b.ingredients,
                    b.serving_size,
                    b.serving_size_unit,
                    b.branded_food_category,
                    b.market_country,
                    ma.brand_description,
                    ma.expiration_date,
                    ma.store_city,
                    ma.store_name,
                    ma.store_state,
                    ma.upc_code
                FROM 
                    food f
                JOIN 
                    branded_food b ON f.fdc_id = b.fdc_id
                JOIN 
                    market_acquisition ma ON f.fdc_id = ma.fdc_id
                JOIN 
                    food_nutrient_conversion_factor fncf ON f.fdc_id = fncf.fdc_id
                JOIN 
                    food_calorie_conversion_factor ccf ON fncf.id = ccf.food_nutrient_conversion_factor_id
                ORDER BY 
                    f.fdc_id;
            `
        );
        res.json(allUser.rows)
        // console.log(res.json(allUser.rows));
    }
    catch(err){
        console.error(err.message);
    }
});



app.post('/todos', async (req, res) => {
    try{
        // console.log(req.body);
        const { description } = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING *",
            [description]
        );
        res.json(newTodo.rows[0]);
    }
    catch(err){
        console.error(err.message);
    }
});

app.get('/todos', async (req, res) => {
    try{
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows);
    }
    catch(err){
        console.error(err.message);
    }
});

app.get('/todos/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
        res.json(todo.rows[0]);
    }
    catch(err){
        console.error(err.message);
    }
});

app.put('/todos/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const { description } = req.body;
        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id]);
        res.json("Todo was updated!");
    }
    catch(err){
        console.error(err.message);
    }
});

app.delete('/todos/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
        res.json("Todo was deleted!");
    }
    catch(err){
        console.error(err.message);
    }
});

app.listen(4000, () => {
    console.log('server has started on port 4000');
});