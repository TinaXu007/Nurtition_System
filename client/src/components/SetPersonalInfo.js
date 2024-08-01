import React, {Fragment, useState} from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const SetPersonalInfo = () => {
    const { userId } = useParams();

    const [personalData, setPersonalData] = useState({
        user_id: 0,
        age: '',
        height: '',
        weight: ''
    });

    const navigate = useNavigate();

    const onDataChange = (e) => {
        const { name, value } = e.target;
        setPersonalData({
            ...personalData,
            [name]: value
        });
    };
    
      const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            personalData.user_id = userId;
            const response = await axios.post('http://localhost:4000/personal_info', personalData);
            navigate(`/dashboard/${userId}`);
        } catch (error) {
            console.error('There was an error!', error);
            alert('Error saving data');
        }
      };

    return (
        <form onSubmit={onSubmitForm}>
            <div>
                <label>Age:</label>
                <input
                type="number"
                name="age"
                value={personalData.age}
                onChange={onDataChange}
                required
                />
            </div>
            <div>
                <label>Height (cm):</label>
                <input
                type="number"
                name="height"
                value={personalData.height}
                onChange={onDataChange}
                required
                />
            </div>
            <div>
                <label>Weight (kg):</label>
                <input
                type="number"
                name="weight"
                value={personalData.weight}
                onChange={onDataChange}
                required
                />
            </div>
            <button type="submit">Save</button>
        </form>
    );
}

export default SetPersonalInfo;