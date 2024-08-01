import React, {Fragment, useState} from 'react';

const InputTodo = () => {

    const [description, setDescription] = useState("");

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = { description };
            const response = await fetch("http://localhost:4000/todos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            window.location = "/";
            console.log(response);
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <form onSubmit={onSubmitForm}>
            <input type="text" className="input-todo" value={description} onChange={e => setDescription(e.target.value)}/>
            <button className="btn-todo">Search</button>
        </form>
    );
}

export default InputTodo;