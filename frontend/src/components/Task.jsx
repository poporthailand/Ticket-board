import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { Flex, Button, Modal, Form, Input, Space, message } from 'antd';
import axios from 'axios';
import moment from 'moment';

const Container = styled.div`
    border-radius: 10px;
    box-shadow: 5px 5px 5px 2px grey;
    padding: 8px;
    color: #000;
    margin-bottom: 8px;
    min-height: 120px;
    margin-left: 10px;
    margin-right: 10px;
    background-color: ${(props) => bgcolorChange(props)};
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
`;

const TextContent = styled.div``;

const Icons = styled.div`
    display: flex;
    justify-content: end;
    padding: 2px;
`;

function bgcolorChange(props) {
    return props.isDragging ? "#6CC1ED" : "#FFFFFF";
}


export default function Task({task, index, csrfToken, onUpdateItemById}) {
    const [modalEditTicket, setModalEditTicket] = useState(false);
    const [form] = Form.useForm();

    const api_backend = import.meta.env.VITE_API_BACKEND

    const handleCloseModalEditTicket = () => {
        setModalEditTicket(false)
    }

    const handleOpeneModalEditTicket = () => {
        setModalEditTicket(true);
    };

    const onEditFinish = async (values) => {
        const ticket = JSON.stringify(values);


        await axios.put(`${api_backend}/api/update_status_ticket/${task._id}/`, ticket, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken, // ส่ง CSRF token
            },
            withCredentials: true,
        });

        onUpdateItemById(values, task._id);

        handleCloseModalEditTicket();
        form.resetFields();
        message.success('Update ticket success!');
    };


    return (
        <>
            <Draggable draggableId={`${task._id}`} key={task._id} index={index}>
                {(provided, snapshot) => (
                    <Container 
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        isDragging={snapshot.isDragging}
                        onClick={(e)=> {
                                handleOpeneModalEditTicket();
                            }}
                    >
                        <div style={{padding:'5px'}} >
                            <div style={{height: '20px', overflow: 'hidden'}}>Title: {task.title}</div>
                            <div style={{height: '58px', overflow: 'hidden'}}>Description: {task.description}</div>
                            <div style={{display: 'flex', justifyContent: 'flex-end', height:'30px', alignItems: 'end', fontSize: '12px'}}>
                                { moment(task.updated_at).format('YYYY-MM-DD HH:mm:ss') }
                            </div>

                        </div>

                        {provided.placeholder}
                    </Container>
                )}
            </Draggable>

            <Modal footer="" title="Edit Ticket" open={modalEditTicket} onOk={handleCloseModalEditTicket} onCancel={handleCloseModalEditTicket}>
                <Form form={form} layout="horizontal" onFinish={onEditFinish} initialValues={{...task}}>
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
                        <Form.Item >
                            <Space style={{position: 'absolute', right: 0}}>
                                <Button  onClick={handleCloseModalEditTicket}>Cancel</Button>
                                <Button type="primary" htmlType="submit" >Update</Button>
                            </Space>
                        </Form.Item>
                    </Flex>
                </Form>
            </Modal>
        </>
        
    )
}
