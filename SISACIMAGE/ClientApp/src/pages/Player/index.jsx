import React, {useCallback, useEffect, useRef, useState} from 'react'
import {Button, Card, Col, Descriptions, Dropdown, Empty, Menu, message, Modal, Row, Space, Table, Tooltip,} from 'antd'
import {CameraOutlined, FileTextOutlined, InfoCircleOutlined, VideoCameraOutlined} from '@ant-design/icons'
import ReactPlayer from 'react-player'
import {useHistory} from 'react-router-dom'
import {ImagePicker} from '../../components'
import moment from 'moment'
import api from '../../services/api'
import './styles.css'
import captureVideoFrame from 'capture-video-frame'

const Player = () => {
    const history = useHistory()
    const videoRef = useRef(null)
    const fileRef = useRef(null)
    const [selectedPaciente, setSelectedPaciente] = useState()
    const [pacientes, setPacientes] = useState()
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(false)
    const [images, setImages] = useState([])
    const [selectedImages, setSelectedImages] = useState([])
    const [tiposLaudo, setTiposLaudo] = useState([])
    const [video, setVideo] = useState()

    useEffect(() => {
        api.get('/tipos-laudo').then((res) => setTiposLaudo(res.data)).catch((err) => console.log(err))
        api.get('/paciente').then((res) => setPacientes(res.data)).catch((err) => console.log(err))
    }, [])

    const capture = useCallback(() => {
        const imageSrc = captureVideoFrame(videoRef.current?.getInternalPlayer())
        console.log('asd', imageSrc)
        setImages((img) => [...img, imageSrc.dataUri])
    }, [videoRef])

    function handleSelectedImages(imgs) {
        setSelectedImages(imgs)
    }

    function handleCreateReport() {
        if (selectedImages.length) {
            history.push({
                pathname: '/laudo',
                state: {images: selectedImages},
            })
        }
        if (selectedImages.length <= 0) {
            message.error('Você deve capturar e ou selecionar as imagens primeiro para emitir o laudo!')
        } else {
            message.error('Você deve selecionar as imagens para emitir o laudo!')
        }

    }


    function handleOpenModal() {
        setVisible(!visible)
    }

    async function handleSelectPaciente(id) {
        console.log('asd', id)
        try {
            const {data} = await api.get(`api/Paciente/${id}`)
            setSelectedPaciente(data[0])
            setLoading(false)
            setVisible(false)
        } catch (error) {
            message.error('Ocorreu um erro ao buscar os dados do paciente')
        }
    }

    const menu = (
        <Menu onClick={() => handleCreateReport()}>
            {
                tiposLaudo.map((item, i) => (
                    <Menu.Item key={i}>{item.nome_tipo}</Menu.Item>
                ))
            }
        </Menu>
    )

    const handleVideoUpload = (event) => {
        setVideo(URL.createObjectURL(event.target.files[0]))
    }

    const columns = [
        {
            title: 'Codigo Paciente',
            dataIndex: 'codPaciente',
        },
        {
            title: 'Paciente',
            dataIndex: 'nomePaciente',
        },
        {
            title: 'Ações',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (record) => (<Space size='middle'>
                <Button onClick={() => handleSelectPaciente(record.CodPaciente)}>Selecionar Paciente</Button>
            </Space>),
        },
    ]

    function onChange(pagination, filters, sorter, extra) {
        console.log('params', pagination, filters, sorter, extra)
    }

    return (
        <>
            <Row span={24}>
                <Descriptions
                    column={1}
                    title='Dados do Paciente'
                    extra={<Button
                        icon={<VideoCameraOutlined/>}

                        onClick={handleOpenModal}
                    >
                        Selecionar Paciente
                    </Button>}
                >
                    {selectedPaciente &&
                    <>
                        <Descriptions.Item
                            label='Nome'>{selectedPaciente ? selectedPaciente.Paciente : ''}</Descriptions.Item>
                        <Descriptions.Item label='Data de Nascimento'>
                            {
                                moment(selectedPaciente ? selectedPaciente.DataNasc : '')
                                    .format('DD/MM/YYYY')
                            } - {
                            moment()
                                .year() - moment(selectedPaciente ? selectedPaciente.DataNasc : '').years()} Anos
                        </Descriptions.Item>
                        <Descriptions.Item label='Telefone'>
                            {selectedPaciente ? selectedPaciente.Telefone : ''}
                        </Descriptions.Item>
                    </>}
                </Descriptions>
            </Row>

            <Row gutter={[24, 8]}>
                <Col span={12}>
                    <Card
                        title={
                            <span>
                Captura
                <Tooltip
                    title='Captura de Imagens do Equipamento'
                    placement='right'
                >
                  <InfoCircleOutlined/>
                </Tooltip>
              </span>
                        }
                        bodyStyle={{padding: 0}}
                    >

                        {
                            video ?
                                <ReactPlayer
                                    ref={videoRef}
                                    url={video}
                                    controls
                                    height='100%'
                                    width='100%'
                                    playing
                                />
                                :
                                <Empty
                                    image='https://cdn-icons-png.flaticon.com/512/120/120614.png'
                                    imageStyle={{
                                        height: 80,
                                    }}
                                    description="Sem video Selecionado!"
                                />
                        }
                        <Space style={{padding: 10}}>
                            <Button
                                icon={<CameraOutlined/>}
                                type='primary'
                                onClick={() => capture()}
                            >
                                Capturar
                            </Button>
                            <input ref={fileRef} type='file' id='selectedFile' onChange={handleVideoUpload}
                                   style={{display: 'none'}}/>
                            <Button
                                icon={<VideoCameraOutlined/>}
                                type='danger'
                                onClick={() => fileRef.current?.click()}
                            >
                                Selecionar Vídeo
                            </Button>
                            <Dropdown overlay={menu}>
                                <Button icon={<FileTextOutlined/>}>
                                    Emitir Laudo
                                </Button>
                            </Dropdown>
                        </Space>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card
                        title='Imagens Capturadas'
                        bodyStyle={{overflowY: 'scroll', maxHeight: '500px'}}
                    >
                        {images.length >= 1 ? (
                            <ImagePicker
                                images={images.map((image, i) => ({
                                    src: image,
                                    value: i,
                                }))}
                                multiple
                                onPick={(selImgs) => handleSelectedImages(selImgs)}
                            />
                        ) : (
                            <Empty/>
                        )}
                    </Card>
                </Col>

            </Row>

            <Modal
                visible={visible}
                title='Selecionar Paciente'
                width={1000}
            >
                <Col span={24}>
                    <Table columns={columns} dataSource={pacientes} loading={loading} onChange={onChange}/>
                </Col>
            </Modal>
        </>
    )
}

export default Player
