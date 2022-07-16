import React, {useCallback, useEffect, useState} from "react"
import {Button, Col, DatePicker, message, Row, Space, Table} from "antd"
import {Link} from "react-router-dom"
import axios from "axios"
import moment from "moment";

const Atendimentos = () => {
    const {Column} = Table
    const {RangePicker} = DatePicker;
    const [pacientes, setPacientes] = useState([])
    const [loading, setLoading] = useState(true)
    const [dateRange, setDateRange] = useState(null);
    const initialDate = moment().format("yyyy-MM-DD");
    const finalDate = moment().format("yyyy-MM-DD");
    useEffect(() => {
        changeData()
    }, [dateRange])
    
    const changeData = useCallback((date, dateString) => {
        axios.get(`api/Entradas/findBydate?initialDate=${dateRange ? moment(dateRange[0]).format("yyyy-MM-DD") : initialDate}&finalDate=${dateRange ? moment(dateRange[1]['_d']).format("yyyy-MM-DD") : finalDate}`).then(async (response) => {
            const formattedResponse = response.data.map((pacientes) => {
                return {
                    ...pacientes,
                    dataHoraEnt: moment(pacientes.dataHoraEnt).format("DD/MM/yyyy HH:mm:ss")
                }
            })
            setPacientes(formattedResponse)
            setLoading(false)
        })
            .catch((res) => message.error("Error: ", res.message))
    }, [])
    

    function onChange(date, dateString) {
        console.log("dt", date)
        console.log("st", dateString)
        setDateRange(dateString)
    }

    return (
        <Row span={24}>
            <Col span={24}>
                <Col span={24}>
                    <p>Selecionar Período</p>
                    <RangePicker
                        showToday
                        allowClear={true}
                        size="large"
                        picker="date"
                        format="DD/MM/YYYY"
                        onChange={onChange}
                    />
                </Col>
                <Table loading={loading} dataSource={pacientes}>
                    <Column
                        title="Codigo Exame"
                        dataIndex="id"
                        key="id"
                    />
                    <Column
                        title="Movimento"
                        dataIndex="codMovimento"
                        key="codMovimento"
                    />
                    <Column
                        title="Codigo Paciente"
                        dataIndex="codPaciente"
                        key="codPaciente"
                    />
                    <Column title="Paciente" dataIndex="nomePaciente" key="nomePaciente"/>
                    <Column title="Procedimento" dataIndex="nomeProcedimento" key="nomeProcedimento"/>
                    <Column title="Data Atendimento" dataIndex="dataHoraEnt" key="nomeProcedimento"/>
                    <Column title="Médico" dataIndex="medicoExecutante" key="medicoExecutante"/>

                    <Column
                        title="Ações"
                        key="action"
                        render={(text, record) => (
                            <Space size="middle">
                                <Link
                                    to={`atendimento/${record.codMovimento}/${record.id}/${record.filial}`}
                                    params={{
                                        codMovimento: record.codMovimento,
                                        codExame: record.id,
                                        filial: record.filial
                                    }}
                                >
                                    <Button>Iniciar Captura de Imagens</Button>
                                </Link>
                            </Space>
                        )}
                    />
                </Table>
            </Col>
        </Row>
    )
}

export default Atendimentos
