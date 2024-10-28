import React, { useEffect, useState } from 'react'
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import Task from './Task';
import { FilterOutlined, PlusCircleOutlined , CaretUpOutlined, CaretDownOutlined  } from '@ant-design/icons';
import { Flex, Button, Modal, Form, Input, Space, message } from 'antd';
import axios from 'axios';

const Container = styled.div`
    background-color: #EBECF0;
    border-radius: 15px;
    width: 260px;
    height: 475px;
    overflow-y: auto;
    // -ms-overflow-style: none;
    // scrollbar-width: none;
    border: 10px solid #EBECF0;
`;

const Title = styled.h3`
    margin: 0;
    padding: 8px;
`;

const TaskList = styled.div`
    padding: 3px;
    transition: background-color 0.2s ease;
    background-color: #EBECF0;
    flex-grow: 1;
    min-height: 100px;
`;

export default function Column({title, tasks, id, csrfToken, onUpdateItemById, onCrateTicket}) {
    const [modalCreateTicket, setModalCreateTicket] = useState(false);
    const [sort, setSort] = useState('desc');

    const api_backend = import.meta.env.VITE_API_BACKEND

    const [form] = Form.useForm();

    const handleCloseModalCreateTicket = () => {
        setModalCreateTicket(false)
    }

    const handleOpeneModalCreateTicket = () => {
        setModalCreateTicket(true);
    };

    function sortTicket(value){
        setSort(value)
    }

    const onCreateFinish = async (values) => {
        const ticket = JSON.stringify(values);

        const result = await axios.post(`${api_backend}/api/create_ticket/`, ticket, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken, // ส่ง CSRF token
            },
            withCredentials: true,
        });

        onCrateTicket(result.data.ticket);

        handleCloseModalCreateTicket();
        form.resetFields();
        message.success('Create ticket success!');
    };

    return (
        <Container >
            <Flex style={{ position: 'sticky', top: 0, backgroundColor: '#EBECF0'}}>
                <Title>
                    {title}
                </Title>
                {
                    tasks.length > 0 && ( sort == 'desc' ? <Button shape="circle" icon={<CaretUpOutlined />} onClick={() => {sortTicket('asc')}}/> : <Button shape="circle" icon={<CaretDownOutlined />} onClick={() => {sortTicket('desc')}}/> )
                }
                {
                    id == 'pending' && <Button shape="circle" icon={<PlusCircleOutlined />} style={{position: 'absolute' , right:10}} onClick={handleOpeneModalCreateTicket}/>
                }
            </Flex>
            <Droppable droppableId={id}>
                {
                    (provided, snapshot) => (
                        <TaskList
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            $isDraggingOver={snapshot.isDraggingOver}
                        >
                            {/* Provide Your tasks */}
                            {
                                tasks.sort((a,b) => {
                                    const dateA = new Date(a.updated_at);
                                    const dateB = new Date(b.updated_at);
                                    return sort == 'desc' ? dateB - dateA : dateA - dateB;
                                }).map((task, index) => (
                                    <Task key={index} task={task} index={index} csrfToken={csrfToken} onUpdateItemById={onUpdateItemById}  />
                                ))
                            }
                            {provided.placeholder}
                        </TaskList>
                    )
                }
            </Droppable>

            <Modal footer="" title="Create Ticket" open={modalCreateTicket} onOk={handleCloseModalCreateTicket} onCancel={handleCloseModalCreateTicket}>
                <Form form={form} layout="horizontal" onFinish={onCreateFinish} initialValues={{ status: id }}>
                    <Flex vertical gap='middle'>
                        <Form.Item name="title" label="Title:" layout="vertical">
                            <Input  />
                        </Form.Item>
                        <Form.Item name="description" label="Description:" layout="vertical">
                            <Input  />
                        </Form.Item>
                        <Form.Item name="email" label="Email:" layout="vertical">
                            <Input  />
                        </Form.Item>
                        <Form.Item name="status" label="Status:" layout="vertical" >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item >
                            <Space style={{position: 'absolute', right: 0}}>
                                <Button  onClick={handleCloseModalCreateTicket}>Cancel</Button>
                                <Button type="primary" htmlType="submit" >Create</Button>
                            </Space>
                        </Form.Item>
                    </Flex>
                </Form>
            </Modal>

        </Container>
    )
}
