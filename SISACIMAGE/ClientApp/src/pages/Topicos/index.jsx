import React, {useEffect, useState} from "react"
import {Button, Col, DatePicker, Descriptions, Form, Input, message, Modal, Popconfirm, Row, Space, Table,} from "antd"
import axios from "axios"
import moment from "moment";

const Topicos = () => {
    const {Column} = Table
    const {RangePicker} = DatePicker;
    const [topicos, setTopicos] = useState([])
    const [loading, setLoading] = useState(true)
    const [dateRange, setDateRange] = useState(null);
    const [modal, setShowModal] = useState(false)
    const [nome, setNome] = useState('')
    const [tipo, setTipo] = useState('')
    const [conteudo, setConteudo] = useState('')
    const initialDate = moment().format("yyyy-MM-DD");
    const finalDate = moment().format("yyyy-MM-DD");
    useEffect(() => {

        axios.get(`api/Laudo/Topico`).then((response) => {
            const formattedResponse = response.data.map((pacientes) => {
                return {
                    ...pacientes,
                    DataCriacao: moment(pacientes.dataHoraEnt).format("DD/MM/yyyy HH:mm:ss")
                }
            })
            setTopicos(formattedResponse)
            setLoading(false)
        })
            .catch((res) => message.error("Error: ", res.message))
    }, [topicos])

    // const onDateRangeChange = dateRange => {
    //     if (dateRange) {
    //         console.log("dts", dateRange)
    //         changeDateRange(returnMomentDateRange(dateRange[0]['_d'], dateRange[1]['_d']));
    //     } else {
    //         changeDateRange(null);
    //     }
    // };

    const returnMomentDateRange = (start, finish) => {
        console.log("st", start)
        return [moment(start).format("yyyy-MM-DD"), moment(finish).format("yyyy-MM-DD")];
    };

    function onChange(date, dateString) {
        setDateRange(dateString)
    }

    const showModal = () => {
        setShowModal(true);
    };

    const handleOk = () => {
        console.log("asds")
    };

    function handleSave() {
        console.log({nome})
        axios.post(`api/Laudo/Topico`, {
            Nome: nome,
            Tipo: tipo,
            Conteudo: conteudo
        }).then((res) => {
            message.success(res.data)
            setShowModal(false)
        })

    }

    function handleDelete(id) {
        console.log("id", id)
        try {
            axios.delete(`api/Laudo/Topico/${id}`)

        } catch (error) {
            message.error('Ocorreu um erro ao deletar este topico!')
        }
    }

    return (
        <>
            <Row gutter={[24]}>
                <Col span={24}>
                    <Descriptions
                        title='Topicos'
                        bordered
                        size='middle'
                        extra={<Button onClick={() => showModal()} type="primary">Adicionar Tópico</Button>}
                    />
                </Col>
            </Row>
            <Row span={24}>
                <Col span={24}>
                    <Table loading={loading} dataSource={topicos} extra={<Button/>}>
                        <Column
                            title="Codigo"
                            dataIndex="id"
                            key="id"
                        />
                        <Column
                            title="Nome"
                            dataIndex="nome"
                            key="nome"
                        />

                        <Column
                            title="Conteudo"
                            dataIndex="conteudo"
                            key="conteudo"
                        />

                        <Column
                            title="Ações"
                            key="action"
                            render={(text, record) => (
                                <Space size="middle">
                                    <Popconfirm placement="left" title="Você deseja deletar este tópico?"
                                                onConfirm={() => handleDelete(record.id)} okText="Sim" cancelText="Não">
                                        <Button>Deletar</Button>
                                    </Popconfirm>
                                </Space>
                            )}
                        />
                    </Table>
                </Col>
            </Row>

            <Modal title="Adicionar Tópico" visible={modal} onOk={handleSave} onCancel={() => setShowModal(false)}>
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Nome"
                        name="Nome"
                        rules={[
                            {
                                required: true,
                                message: 'Favor, insira um nome para o tópico',
                            },
                        ]}
                    >
                        <Input onChange={e => setNome(e.target.value)}/>
                    </Form.Item>

                    <Form.Item
                        label="Tipo"
                        name="Tipo"
                        rules={[
                            {
                                required: true,
                                message: 'Favor, inserir um tipo!',
                            },
                        ]}
                    >
                        <Input onChange={e => setTipo(e.target.value)}/>
                    </Form.Item>

                    <Form.Item
                        label="Conteudo"
                        name="conteudo"
                        rules={[
                            {
                                required: true,
                                message: 'Favor, inserir um conteúdo!',
                            },
                        ]}
                    >
                        <Input.TextArea onChangeText={e => setConteudo(e.target.value)}/>
                    </Form.Item>


                </Form>
            </Modal>
        </>
    )
}

export default Topicos
