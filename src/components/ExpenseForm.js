import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BudgetContext } from '../contexts/BudgetContext';
import PropTypes from 'prop-types';

const ExpenseForm = ({ editItem, setEditItem }) => {
    const { state, dispatch } = useContext(BudgetContext);
    const [formData, setFormData] = useState({ name: '', amount: '', category: '', date: '' });

    useEffect(() => {
        if (editItem) setFormData(editItem);
    }, [editItem]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.category || formData.amount <= 0) {
            return alert("Dữ liệu không hợp lệ!");
        }

        if (editItem) {
            const res = await axios.put(`http://localhost:9999/expenses/${editItem.id}`, formData);
            dispatch({ type: 'UPDATE_EXPENSE', payload: res.data });
            setEditItem(null);
        } else {
            const res = await axios.post('http://localhost:9999/expenses', { ...formData, userId: state.user.id });
            dispatch({ type: 'ADD_EXPENSE', payload: res.data });
        }
        setFormData({ name: '', amount: '', category: '', date: '' });
    };

    return (
        <div className="card shadow p-3">
            <h4>{editItem ? "Edit Expense" : "Add Expense"}</h4>
            <form onSubmit={handleSubmit}>
                <input className="form-control mb-2" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                <input className="form-control mb-2" type="number" placeholder="Amount" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} required />
                <input className="form-control mb-2" placeholder="Category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required />
                <input className="form-control mb-2" type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                <button className={`btn w-100 ${editItem ? 'btn-warning' : 'btn-primary'}`}>
                    {editItem ? "Update" : "Add"}
                </button>
            </form>
        </div>
    );
};

ExpenseForm.propTypes = {
    editItem: PropTypes.object,
    setEditItem: PropTypes.func.isRequired
};

export default ExpenseForm;