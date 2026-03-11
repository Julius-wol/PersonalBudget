import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { BudgetContext } from '../contexts/BudgetContext';
import Header from '../components/Header';
import ExpenseForm from '../components/ExpenseForm';
import { Table, Card, Row, Col, Container } from 'react-bootstrap';

const Dashboard = () => {
    const { state, dispatch } = useContext(BudgetContext);

    const [filter, setFilter] = useState('');
    const [editItem, setEditItem] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (state.user) {
            axios.get(`http://localhost:9999/expenses?userId=${state.user.id}`)
                .then(res => dispatch({ type: 'SET_EXPENSES', payload: res.data }));
        }
    }, [state.user, dispatch]);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
            await axios.delete(`http://localhost:9999/expenses/${id}`);
            dispatch({ type: 'DELETE_EXPENSE', payload: id });
        }
    };


    // Lọc theo category
    let filteredExpenses = state.expenses.filter(e =>
        e.category.toLowerCase().includes(filter.toLowerCase())
    );

    // Lọc theo ngày nếu có chọn
    if (startDate) {
        filteredExpenses = filteredExpenses.filter(e => new Date(e.date) >= new Date(startDate));
    }
    if (endDate) {
        filteredExpenses = filteredExpenses.filter(e => new Date(e.date) <= new Date(endDate));
    }

    const total = filteredExpenses.reduce((sum, item) => sum + Number(item.amount), 0);

    return (
        <div>
            <Header />
            <Container>
                <Row className="mb-4 text-center">
                    <Col md={6}>
                        <Card className="bg-success text-white shadow p-3">
                            <h4>Total Expenses</h4>
                            <h3>{total.toLocaleString()} VND</h3>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="shadow p-3">
                            <h4>Filter</h4>
                            <div className="d-flex gap-2 flex-wrap">
                                <input
                                    className="form-control"
                                    style={{ maxWidth: 180 }}
                                    placeholder="Search by Category..."
                                    onChange={e => setFilter(e.target.value)}
                                />
                                <input
                                    type="date"
                                    className="form-control"
                                    style={{ maxWidth: 150 }}
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    placeholder="Từ ngày"
                                />
                                <input
                                    type="date"
                                    className="form-control"
                                    style={{ maxWidth: 150 }}
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    placeholder="Đến ngày"
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col md={4}>
                        <ExpenseForm editItem={editItem} setEditItem={setEditItem} />
                    </Col>
                    <Col md={8}>
                        <Card className="shadow p-3">
                            <h4>Expense Management</h4>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Name</th><th>Amount</th><th>Category</th><th>Date</th><th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredExpenses.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>{Number(item.amount).toLocaleString()}</td>
                                            <td>{item.category}</td>
                                            <td>{item.date.split('-').reverse().join('-')}</td>
                                            <td>
                                                <button className="btn btn-sm btn-warning me-2" onClick={() => setEditItem(item)}>Edit</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
export default Dashboard;