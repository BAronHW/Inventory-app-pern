import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function CategoryCard() {
    const { id } = useParams();
    const [state, setstate] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3000/items/category/${id}`)
            .then((res) => {
                setstate(res.data);
                console.log(state);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    return (
        <div className="category-card">
            {state.map((item) => (
                <div key={item._id} className="item-card">
                    <p>{item._id}</p>
                    <p>{item.name}</p>
                    <p>{item.price}</p>
                    <p>{item.category.name}</p>
                    <p>{item.description}</p>
                    <p>{item.stock}</p>
                </div>
            ))}
        </div>
    );
}

export default CategoryCard;
