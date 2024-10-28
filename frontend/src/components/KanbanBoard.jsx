import React, { useEffect, useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import styled from 'styled-components';
import axios from 'axios';
import { message } from 'antd';



export default function KanbanBoard() {
    const [ticket, setTicket] = useState([]);
    const api_backend = import.meta.env.VITE_API_BACKEND
    const [csrfToken, setCsrfToken] = useState('');

    const fetchTicket = async () => {
        try {
            const response = await axios.get(`${api_backend}/api/tickets/`, { withCredentials: true });
            setTicket(response.data.tickets)
            
        } catch (error) {
            console.error('Error fetching CSRF token:', error);
        }
    };

    const fetchCsrfToken = async () => {
        try {
            const response = await axios.get(`${api_backend}/api/csrf_token/`, { withCredentials: true });
            setCsrfToken(response.data.csrfToken);
        } catch (error) {
            console.error('Error fetching CSRF token:', error);
        }
    };

    useEffect(() => {

        fetchCsrfToken();
        fetchTicket()

    }, []);

    const handleDragEnd = async (result) => {
        const { destination, source, draggableId } = result;
        
        if (source.droppableId === destination.droppableId) return;
        
        const status = destination.droppableId
        
        await axios.put(`${api_backend}/api/update_status_ticket/${draggableId}/`, { status: status} ,  { 
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken, // ส่ง CSRF token
            },
            withCredentials: true 
        })
        setTicket(updateStatusItemById(status, draggableId));

    }

    function updateStatusItemById(status, id) {
        return ticket.map(ticket => {
            if (ticket._id === id) {
                // อัปเดตข้อมูล
                return { ...ticket, status: status, updated_at: new Date()};
            }
            return ticket;
        });
    }

    function updateItemById(data, id) {
        setTicket(
            ticket.map(ticket => {
                if (ticket._id === id) {
                    // อัปเดตข้อมูล
                    return { ...ticket, ...data, updated_at: new Date() };
                }
                return ticket;
            })
        )
    }

    function crateTicket(data) {
        setTicket(prevTicket => [{...data}, ...prevTicket] )
    }



    const Title = styled.h2`
        color: white;
    `

    const ScrollX = styled.div`
        display: flex;
        overflow-x: auto;       
        width: 100%;            
        padding: 10px;          
        box-sizing: border-box; 
    `
    const ContainerDragDrop = styled.div`
        display: flex;
        gap: 20px;
    `

    return (
        <>
        <Title>Ticket board</Title>
        <ScrollX>
            <DragDropContext onDragEnd={handleDragEnd}>
                <ContainerDragDrop >
                    <Column title={"Pending"} tasks={ticket.filter((item) => item.status == 'pending')} id={"pending"} csrfToken={csrfToken} onUpdateItemById={updateItemById} onCrateTicket={crateTicket} />
                    <Column title={"Accepted"} tasks={ticket.filter((item) => item.status == 'accepted')} id={"accepted"} csrfToken={csrfToken} onUpdateItemById={updateItemById} onCrateTicket={crateTicket} />
                    <Column title={"Resolved"} tasks={ticket.filter((item) => item.status == 'resolved')} id={"resolved"} csrfToken={csrfToken} onUpdateItemById={updateItemById} onCrateTicket={crateTicket} />
                    <Column title={"Rejected"} tasks={ticket.filter((item) => item.status == 'rejected')} id={"rejected"} csrfToken={csrfToken} onUpdateItemById={updateItemById} onCrateTicket={crateTicket} />
                </ContainerDragDrop>
            </DragDropContext>
        </ScrollX>
        </>
    )
}
