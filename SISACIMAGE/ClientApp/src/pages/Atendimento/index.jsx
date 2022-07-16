import React, {useCallback, useEffect, useRef, useState} from 'react'
import {
    Button,
    Card,
    Col,
    Descriptions, Dropdown,
    Empty,
    Menu,
    message,
    Popconfirm,
    Row,
    Select,
    Space,
    Table,
    Tooltip
} from 'antd'
import {CameraOutlined, FileTextOutlined, InfoCircleOutlined, VideoCameraOutlined} from '@ant-design/icons'
import Webcam from 'react-webcam'
import {useHistory, useParams} from 'react-router-dom'
import moment from 'moment'
import axios from "axios"
import './styles.css'

const Atendimento = () => {
    const history = useHistory()
    const webcamRef = useRef(null)
    const mediaRecorderRef = React.useRef(null)
    const [capturing, setCapturing] = useState(false)
    const [recordedChunks, setRecordedChunks] = useState([])
    const {codMovimento, codExame, filial} = useParams()
    const {Option} = Select
    const [selectedPaciente, setSelectedPaciente] = useState()
    const [images, setImages] = useState([])
    const [videos, setVideos] = useState([])
    const [selectedImages, setSelectedImages] = useState([])
    const [deviceId, setDeviceId] = React.useState({})
    const [devices, setDevices] = React.useState([])
    const [modelos, setModelos] = useState([])
    const [modeloId, setModeloId] = useState('')


    useEffect(() => {
        async function getItems() {
            try {
                const {data} = await axios.get(`api/Paciente/findPacienteByMovimento?codMovimento=${codMovimento}&codExame=${codExame}&filial=${filial}`)
                setSelectedPaciente(data)
            } catch (error) {
                message.error('Ocorreu um erro ao buscar os dados do paciente')
            }
        }

        getItems().then((r) => console.log('error', r))
    }, [codMovimento, codExame, filial])

    useEffect(() => {
        async function getItems() {
            try {
                const {data} = await axios
                    .get(`api/Captura/findByPaciente?codPaciente=${selectedPaciente[0].codPaciente}&codMovimento=${selectedPaciente[0].codMovimento}`)
                const formattedResponse = data.map((i) => {
                    return {
                        ...i,
                        imagem: `data:image/png;base64,${i.imagem}`
                    }
                })
                setImages(formattedResponse)

            } catch (error) {
                message.error('Ocorreu um erro ao buscar os dados do paciente')
            }
        }

        async function getVideos() {
            try {
                const {data} = await axios
                    .get(`api/Captura/Videos/findByPaciente?codPaciente=${selectedPaciente[0].codPaciente}&codMovimento=${selectedPaciente[0].codMovimento}`)
                const formattedResponse = data.map((i) => {
                    return {
                        ...i,
                        arquivo: `data:video/webm;base64,${i.imagem}`
                    }
                })
                setVideos(formattedResponse)

            } catch (error) {
                message.error('Ocorreu um erro ao buscar os dados do paciente')
            }
        }

        getItems().then(r => console.log(r))
        getVideos().then(r => console.log(r))
    }, [codMovimento, images, selectedPaciente])

    useEffect(() => {
        axios.get(`api/Modelos`).then((response) => {
            const formattedResponse = response.data.map((pacientes) => {
                return {
                    ...pacientes,
                    DataCriacao: moment(pacientes.dataHoraEnt).format("DD/MM/yyyy HH:mm:ss")
                }
            })
            setModelos(formattedResponse)
        })
            .catch((res) => message.error("Error: ", res.message))
    }, [])


    const handleDevices = React.useCallback(
        (mediaDevices) =>
            setDevices(mediaDevices.filter(({kind}) => kind === 'videoinput')),
        [setDevices],
    )

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then(handleDevices)
    }, [handleDevices])


    function handleSave() {
        const imageSrc = webcamRef.current?.getScreenshot()
        const data = {
            CodMovimento: selectedPaciente[0].codMovimento,
            CodPaciente: String(selectedPaciente[0].codPaciente),
            CodExame: String(selectedPaciente[0].id),
            Nome: selectedPaciente[0].nomePaciente + '.jpg',
            GrupoEmp: selectedPaciente[0].grupoEmp,
            Filial: selectedPaciente[0].filial,
            Usuario: "#SISACIMAGE",
            Imagem: imageSrc.replace(/^data:image\/[a-z]+;base64,/, ""),
            ordem_imagem: 1,
        }
        axios.post(`api/Captura`, data)
    }

    const handleStartCaptureClick = useCallback(() => {
        setCapturing(true)
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
            mimeType: 'video/webm',
        })
        mediaRecorderRef.current.addEventListener(
            'dataavailable',
            handleDataAvailable,
        )
        mediaRecorderRef.current.start()
    }, [webcamRef, setCapturing, mediaRecorderRef])


    const handleDataAvailable = useCallback(
        ({data}) => {
            console.log("data", data)
            if (data.size > 0) {
                setRecordedChunks((prev) => prev.concat(data))
            }
        },
        [setRecordedChunks],
    )

    const handleStopCaptureClick = React.useCallback(() => {
        mediaRecorderRef.current.stop()
        setCapturing(false)
    }, [mediaRecorderRef, webcamRef, setCapturing])

    const handleDownload = useCallback(() => {
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, {
                type: 'video/webm',
            })
            console.log("blob", blob)
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
                const base64String = reader.result;
                console.log('Base64 String - ', base64String);

                // Simply Print the Base64 Encoded String,
                // without additional data: Attributes.
                console.log('Base64 String without Tags- ',
                    base64String.replace(/^data:video\/[a-z]+;base64,/, ""))

                const data = {
                    IdExame : selectedPaciente[0].idExame,
                    CodPaciente: String(selectedPaciente[0].codPaciente),
                    CodMovimento: selectedPaciente[0].codMovimento,
                    Tipo: 'VIDEO',
                    Tamanho: String(blob.size),
                    Extensao : '.mp4',
                    Arquivo: base64String.replace(/^data:video\/[a-z]+;base64,/, ""),
                    Usuario: "#SISACIMAGE",
                    Filial: selectedPaciente[0].filial,
                    GrupoEmp: selectedPaciente[0].grupoEmp,
                    Nome: selectedPaciente[0].nomePaciente + '.mp4',
                    Laudo: false,
                    CodProcedimento: selectedPaciente[0].codProcedimento,
                    DescricaoProcedimento: selectedPaciente[0].nomeProcedimento,
                    Enviado: null,
                }
                axios.post(`api/Captura/Video`, data)
                
            }
            
            
            
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            document.body.appendChild(a)
            a.style = 'display: none'
            a.href = url
            a.download = `${selectedPaciente[0].nomePaciente} - Captura ${moment().format("DD_MM_YYYY_HH_mm_ss")}.mp4`
            a.click()
            window.URL.revokeObjectURL(url)
            setRecordedChunks([])
        }
    }, [recordedChunks])

    function handleSelectDevice(camId) {
        setDeviceId(camId)
    }


    function handleDelete(id) {
        try {
            axios.delete(`api/Captura/${id}`)

        } catch (error) {
            message.error('Ocorreu um erro ao deletar esta imagem!')
        }
    }
    

    const columns = [{
        title: '',
        dataIndex: 'image',
        key: 'image',
        render: (text, record) => {
            return (
                <div>
                    <img
                        src={record.imagem}
                        style={{width: 200, height: 200}}
                        alt="imagem"
                    />
                    <div>
                        <Popconfirm
                            placement="left" title="Você deseja deletar essa Imagem?"
                            onConfirm={() => handleDelete(record.idImagem)}
                            okText="Sim"
                            cancelText="Não">
                            <Button>Deletar</Button>
                        </Popconfirm>
                    </div>
                </div>
            );
        },
    }];

    function handleCreateReport({key}) {
        history.push({
            pathname: '/laudo',
            state: { paciente: selectedPaciente, modeloId: key },
        })

    }
    const menu = (
        <Menu onClick={handleCreateReport}>
            {
                modelos.map((item, i) => (
                    <Menu.Item key={item.id} >{item.nome}</Menu.Item>
                ))
            }
        </Menu>
    )


    return (
        <>
            <Row gutter={[24]}>
                <Col span={24}>
                    <Descriptions
                        title='Dados do Paciente'
                        bordered
                        size='middle'
                    >
                        <Descriptions.Item
                            label='Codigo'>{selectedPaciente ? selectedPaciente[0].codPaciente : ''}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label='Nome'>{selectedPaciente ? selectedPaciente[0].nomePaciente : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label='Data de Nascimento'>
                            {
                                moment(selectedPaciente ? selectedPaciente[0].dataNascimento : '')
                                    .format('DD/MM/YYYY')
                            } - {
                            moment()
                                .year() - moment(selectedPaciente ? selectedPaciente[0].dataNascimento : '').years()} Anos
                        </Descriptions.Item>
                        <Descriptions.Item label='Telefone'>
                            {selectedPaciente ? selectedPaciente[0].telefone : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label='Procedimento'>
                            {selectedPaciente ? selectedPaciente[0].nomeProcedimento : ''}
                        </Descriptions.Item>

                        <Descriptions.Item label='Medico Executante'>
                            {selectedPaciente ? selectedPaciente[0].medicoExecutante : ''}
                        </Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>
            <Row gutter={[24]}>
                <Col span={18}>
                    <Card
                        title="Captura"
                        extra={
                            <Select
                                onChange={handleSelectDevice}
                                placeholder='Selecione um Dispositivo de Captura'
                                style={{width: 150}}
                            >
                                {devices.map((device, i) => (
                                    <Option key={i} value={device.deviceId}>{device.label}</Option>
                                ))}
                            </Select>
                        }

                        bodyStyle={{padding: 0}}
                    >
                        <Webcam
                            ref={webcamRef}
                            screenshotFormat='image/jpeg'
                            width='100%'
                            videoConstraints={{deviceId}}
                        />
                        <Space style={{padding: 10}}>
                            <Button
                                icon={<CameraOutlined/>}
                                type='primary'
                                onClick={() => handleSave()}
                            >
                                Capturar Imagem
                            </Button>

                            {recordedChunks.length > 0 && (
                                <Button
                                    icon={<VideoCameraOutlined/>}
                                    type='danger'
                                    onClick={() => handleDownload()}
                                >
                                    Baixar Vídeo
                                </Button>
                            )}

                            {capturing ? (
                                <Button
                                    icon={<VideoCameraOutlined/>}
                                    type='danger'
                                    onClick={() => handleStopCaptureClick()}
                                >
                                    Parar Gravação
                                </Button>
                            ) : (
                                <Button
                                    icon={<VideoCameraOutlined/>}
                                    type='danger'
                                    onClick={() => handleStartCaptureClick()}
                                >
                                    Gravar Vídeo
                                </Button>
                            )}

                            <Dropdown overlay={menu}>
                                <Button icon={<FileTextOutlined />}>
                                    Emitir Laudo
                                </Button>
                            </Dropdown>


                        </Space>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card
                        title='Imagens'
                        bodyStyle={{overflowY: 'scroll', maxHeight: '500px'}}
                    >
                        {images.length >= 1 ? (
                            <Table columns={columns} dataSource={images}/>
                            // <ImagePicker
                            //     images={images.map((image, i) => ({
                            //         src: image,
                            //         value: i,
                            //     }))}
                            //     multiple
                            //     onPick={(selImgs) => handleSelectedImages(selImgs)}
                            // />
                        ) : (
                            <Empty/>
                        )}
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default Atendimento
