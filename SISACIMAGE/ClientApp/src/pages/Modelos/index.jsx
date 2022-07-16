import React, {useEffect, useState} from "react"
import {Button, Col, DatePicker, Descriptions, Form, Input, message, Modal, Popconfirm, Row, Space, Table, Tabs, Select} from "antd"
import axios from "axios"
import moment from "moment";

const Modelos = () => {
    const { Option } = Select;
    const {TabPane} = Tabs
    const {Column} = Table
    const {RangePicker} = DatePicker;
    const [topicos, setTopicos] = useState([])
    const [loading, setLoading] = useState(true)
    const [dateRange, setDateRange] = useState(null);
    const [modal, setShowModal] = useState(false)
    const [modalAdd, setModalAdd] = useState(false)
    const [nome, setNome] = useState('')
    const [tipo, setTipo] = useState('')
    const [modeloId, setModeloId] = useState('');
    const [nomeSecao, setNomeSecao] = useState('');
    const [conteudo, setConteudo] = useState('')
    const [secoes, setSecoes] = useState([])
    const initialDate = moment().format("yyyy-MM-DD");
    const finalDate = moment().format("yyyy-MM-DD");
    
    useEffect(() => {
        axios.get(`api/Modelos`).then((response) => {
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

    useEffect(() => {
        axios.get(`api/Modelos/Secao`).then((response) => {
            const formattedResponse = response.data.map((pacientes) => {
                return {
                    ...pacientes,
                    DataCriacao: moment(pacientes.dataHoraEnt).format("DD/MM/yyyy HH:mm:ss")
                }
            })
            setSecoes(formattedResponse)
            setLoading(false)
        })
            .catch((res) => message.error("Error: ", res.message))
    }, [secoes])
    

    const showModal = () => {
        setShowModal(true);
    };

    const showModalAdd = () => {
        setModalAdd(state => !state);
    };
    

    function handleSave() {
        console.log({nome})
        axios.post(`api/Modelos`, {
            Nome: nome,
        }).then((res) => {
            message.success(res.data.message)
            setShowModal(false)
        })

    }

    function handleSaveSecao() {
        console.log({nome})
        axios.post(`api/Modelos/Secao`, {
            SECAO : nomeSecao,
            Modelo_Laudo_Id: modeloId,
        }).then((res) => {
            message.success(res.data.message)
            setModalAdd(false)
        })

    }

    function handleDelete(id) {
        console.log("id", id)
        try {
            axios.delete(`api/Modelos/${id}`)

        } catch (error) {
            message.error('Ocorreu um erro ao deletar este modelo!')
        }
    }

    return (
        <>
            <Tabs defaultActiveKey="1" >
                <TabPane tab="Modelos" key="1">
                    <Row gutter={[24]}>
                        <Col span={24}>
                            <Descriptions
                                title='Modelos'
                                bordered
                                size='middle'
                                extra={<Button onClick={() => showModal()} type="primary">Adicionar Modelo</Button>}
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
                                    title="Ações"
                                    key="action"
                                    render={(text, record) => (
                                        <Space size="middle">
                                            <Popconfirm placement="left" title="Você deseja deletar este modelo?"
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
                        </Form>
                    </Modal>
                </TabPane>
                <TabPane tab="Seções" key="2">
                    <Row gutter={[24]}>
                        <Col span={24}>
                            <Descriptions
                                title='Seções'
                                bordered
                                size='middle'
                                extra={<Button onClick={() => showModalAdd()} type="primary">Adicionar Seção</Button>}
                            />
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={24}>
                            <Table loading={loading} dataSource={secoes} extra={<Button/>}>
                                <Column
                                    title="Codigo"
                                    dataIndex="id"
                                    key="id"
                                />
                                <Column
                                    title="SEÇÃO"
                                    dataIndex="secao"
                                    key="secao"
                                />

                                <Column
                                    title="Ações"
                                    key="action"
                                    render={(text, record) => (
                                        <Space size="middle">
                                            <Popconfirm placement="left" title="Você deseja deletar este modelo?"
                                                        onConfirm={() => handleDelete(record.id)} okText="Sim" cancelText="Não">
                                                <Button>Deletar</Button>
                                            </Popconfirm>
                                        </Space>
                                    )}
                                />
                            </Table>
                        </Col>
                    </Row>

                    <Modal title="Adicionar Seção" visible={modalAdd} onOk={handleSaveSecao} onCancel={() => setModalAdd(false)}>
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
                                label="Conteudo Seção"
                                name="Nome"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Favor, insira um nome para a seção',
                                    },
                                ]}
                            >
                                <Input onChange={e => setNomeSecao(e.target.value)}/>
                            </Form.Item>
                            
                            <Form.Item 
                               label="Modelo" 
                               name="Modelo"
                               rules={[
                                   {
                                       required: true,
                                       message: 'Favor, insira um nome para o tópico',
                                   },
                               ]}>
                                <Select loading={loading} onChange={e => setModeloId(e)}>
                                    {
                                        topicos.map(topico => (
                                            <Option value={topico.id}>{topico.nome}</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                        </Form>
                    </Modal>
                </TabPane>
            </Tabs>
            
            
        </>
    )
}

export default Modelos
