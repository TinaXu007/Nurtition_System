import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const { id } = useParams();

    const [userData, setUserData] = useState(null);

    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchHeight, setSearchHeight] = useState('');

    const [selectedUsers, setSelectedUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/personal_info/${id}`);
                setUserData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };

        const fetchAllUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/food');
                setAllUsers(response.data);
                setFilteredUsers(response.data);
            } catch (error) {
                console.error('Error fetching all users:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchSelectedFood = async () => {
            try {
                const response = await axios.get('http://localhost:4000/user_favorite');
                setSelectedUsers(response.data);
            }
            catch (error) {
                console.error('Error fetching selected users:', error);
            }
        };

        fetchUserData();
        fetchAllUsers();
        fetchSelectedFood();

    }, [id]);

    const onSearchChange = (e) => {
        const value = e.target.value;
        setSearchHeight(value);
        if (value === '') {
            setFilteredUsers(allUsers);
        } else {
            // const filtered = allUsers.filter(user => user.height === parseInt(value, 10));
            const filtered = allUsers.filter(user => user.food_description.toLowerCase().includes(value.toLowerCase()));
            setFilteredUsers(filtered);
        }
    };

    const onAddFood = async (fdc_id) => {
        try {
            await axios.post('http://localhost:4000/add_food', { fdc_id});
            const response = await axios.get('http://localhost:4000/user_favorite');
            setSelectedUsers(response.data);
        }
        catch (error) {
            console.error('Error adding user:', error);
            alert('Error adding user');
        }
    };
    
    const onRemoveFood = async (fdc_id) => {
        try {
            await axios.post('http://localhost:4000/remove_food', { fdc_id });
            const response = await axios.get('http://localhost:4000/user_favorite');
            setSelectedUsers(response.data);
        }
        catch (error) {
            console.error('Error removing user:', error);
            alert('Error removing user');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userData) {
        return <div>User not found</div>;
    }

    const { weight } = userData;
    const message = weight < 80 ? 'Underweight' : 'Overweight';

    return (
        <div>
            <h1>User Weight Analysis</h1>
            <p>Your weight is {weight} kg, which is considered {message}.</p>

            <input
                // type="number"
                placeholder="Search by name"
                value={searchHeight}
                onChange={onSearchChange}
            />
            <h2>Your Favorite Food</h2>
            <table style={{ border: '1px solid black', width: '100%', textAlign: 'center' }}>
                <thead>
                <tr>
                    <th style={{ border: '1px solid black' }}>Action</th>
                    <th style={{ border: '1px solid black' }}>fdc_id</th>
                    <th style={{ border: '1px solid black' }}>food_description</th>
                    <th style={{ border: '1px solid black' }}>protein_value</th>
                    <th style={{ border: '1px solid black' }}>fat_value</th>
                    <th style={{ border: '1px solid black' }}>carbohydrate_value</th>
                    <th style={{ border: '1px solid black' }}>total_calories</th>
                    <th style={{ border: '1px solid black' }}>brand_owner</th>
                    <th style={{ border: '1px solid black' }}>gtin_upc</th>
                    {/* <th style={{ border: '1px solid black' }}>ingredients</th> */}
                    <th style={{ border: '1px solid black' }}>serving_size</th>
                    <th style={{ border: '1px solid black' }}>serving_size_unit</th>
                    <th style={{ border: '1px solid black' }}>branded_food_category</th>
                    <th style={{ border: '1px solid black' }}>market_country</th>
                    <th style={{ border: '1px solid black' }}>brand_description</th>
                    <th style={{ border: '1px solid black' }}>expiration_date</th>
                    <th style={{ border: '1px solid black' }}>store_city</th>
                    <th style={{ border: '1px solid black' }}>store_name</th>
                    <th style={{ border: '1px solid black' }}>store_state</th>
                    <th style={{ border: '1px solid black' }}>upc_code</th>
                </tr>
                </thead>
                <tbody>
                {selectedUsers.map(user => (
                    <tr key={user.fdc_id}>
                        <td style={{ border: '1px solid black' }}>
                        <button onClick={() => onRemoveFood(user.fdc_id)}>Remove</button>
                        </td>
                        <td style={{ border: '1px solid black' }}>{user.fdc_id}</td>
                        <td style={{ border: '1px solid black' }}>{user.food_description}</td>
                        <td style={{ border: '1px solid black' }}>{user.protein_value}</td>
                        <td style={{ border: '1px solid black' }}>{user.fat_value}</td>
                        <td style={{ border: '1px solid black' }}>{user.carbohydrate_value}</td>
                        <td style={{ border: '1px solid black' }}>{user.total_calories}</td>
                        <td style={{ border: '1px solid black' }}>{user.brand_owner}</td>
                        <td style={{ border: '1px solid black' }}>{user.gtin_upc}</td>
                        {/* <td style={{ border: '1px solid black' }}>{user.ingredients}</td> */}
                        <td style={{ border: '1px solid black' }}>{user.serving_size}</td>
                        <td style={{ border: '1px solid black' }}>{user.serving_size_unit}</td>
                        <td style={{ border: '1px solid black' }}>{user.branded_food_category}</td>
                        <td style={{ border: '1px solid black' }}>{user.market_country}</td>
                        <td style={{ border: '1px solid black' }}>{user.brand_description}</td>
                        <td style={{ border: '1px solid black' }}>{user.expiration_date}</td>
                        <td style={{ border: '1px solid black' }}>{user.store_city}</td>
                        <td style={{ border: '1px solid black' }}>{user.store_name}</td>
                        <td style={{ border: '1px solid black' }}>{user.store_state}</td>
                        <td style={{ border: '1px solid black' }}>{user.upc_code}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            
            <h2>Global Food Database</h2>
            <table style={{ border: '1px solid black', width: '100%', textAlign: 'center' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black' }}>Action</th>
                        <th style={{ border: '1px solid black' }}>fdc_id</th>
                        <th style={{ border: '1px solid black' }}>food_description</th>
                        <th style={{ border: '1px solid black' }}>protein_value</th>
                        <th style={{ border: '1px solid black' }}>fat_value</th>
                        <th style={{ border: '1px solid black' }}>carbohydrate_value</th>
                        <th style={{ border: '1px solid black' }}>total_calories</th>
                        <th style={{ border: '1px solid black' }}>brand_owner</th>
                        <th style={{ border: '1px solid black' }}>gtin_upc</th>
                        {/* <th style={{ border: '1px solid black' }}>ingredients</th> */}
                        <th style={{ border: '1px solid black' }}>serving_size</th>
                        <th style={{ border: '1px solid black' }}>serving_size_unit</th>
                        <th style={{ border: '1px solid black' }}>branded_food_category</th>
                        <th style={{ border: '1px solid black' }}>market_country</th>
                        <th style={{ border: '1px solid black' }}>brand_description</th>
                        <th style={{ border: '1px solid black' }}>expiration_date</th>
                        <th style={{ border: '1px solid black' }}>store_city</th>
                        <th style={{ border: '1px solid black' }}>store_name</th>
                        <th style={{ border: '1px solid black' }}>store_state</th>
                        <th style={{ border: '1px solid black' }}>upc_code</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user.fdc_id}>
                            <td style={{ border: '1px solid black' }}>
                                <button onClick={() => onAddFood(user.fdc_id, user.data_type, user.description, user.food_category_id, user.publication_date)}>Add</button>
                            </td>
                            <td style={{ border: '1px solid black' }}>{user.fdc_id}</td>
                            <td style={{ border: '1px solid black' }}>{user.food_description}</td>
                            <td style={{ border: '1px solid black' }}>{user.protein_value}</td>
                            <td style={{ border: '1px solid black' }}>{user.fat_value}</td>
                            <td style={{ border: '1px solid black' }}>{user.carbohydrate_value}</td>
                            <td style={{ border: '1px solid black' }}>{user.total_calories}</td>
                            <td style={{ border: '1px solid black' }}>{user.brand_owner}</td>
                            <td style={{ border: '1px solid black' }}>{user.gtin_upc}</td>
                            {/* <td style={{ border: '1px solid black' }}>{user.ingredients}</td> */}
                            <td style={{ border: '1px solid black' }}>{user.serving_size}</td>
                            <td style={{ border: '1px solid black' }}>{user.serving_size_unit}</td>
                            <td style={{ border: '1px solid black' }}>{user.branded_food_category}</td>
                            <td style={{ border: '1px solid black' }}>{user.market_country}</td>
                            <td style={{ border: '1px solid black' }}>{user.brand_description}</td>
                            <td style={{ border: '1px solid black' }}>{user.expiration_date}</td>
                            <td style={{ border: '1px solid black' }}>{user.store_city}</td>
                            <td style={{ border: '1px solid black' }}>{user.store_name}</td>
                            <td style={{ border: '1px solid black' }}>{user.store_state}</td>
                            <td style={{ border: '1px solid black' }}>{user.upc_code}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;
