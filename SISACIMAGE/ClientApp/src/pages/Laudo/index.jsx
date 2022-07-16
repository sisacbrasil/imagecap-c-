import React, {useEffect, useRef, useState} from "react"
import {
    Button,
    Card,
    Col,
    Descriptions,
    Dropdown,
    Empty,
    Form,
    Input,
    Menu,
    message,
    PageHeader,
    Row,
    Select,
} from "antd"
import {useHistory, useLocation} from "react-router-dom"
import {Editor} from "@tinymce/tinymce-react"
import {ImagePicker} from "../../components"
import axios from "axios";
import moment from "moment";
import {FileTextOutlined, SearchOutlined} from "@ant-design/icons";

const {TextArea} = Input

const {Option} = Select

const Laudo = () => {
    const navigation = useHistory()
    const location = useLocation()
    const editorRef = useRef(null)
    const formRef = useRef(null);
    const [component, setComponent] = useState([])
    const [laudoImages, setLaudoImages] = useState([])
    const [paciente, setPaciente] = useState(location.state.paciente)
    const [modeloId, setModeloId] = useState(location.state.modeloId)
    const [selectedItems, setSelectedItems] = useState([])
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false)
    const [selectedImages, setSelectedImages] = useState([]);
    const [topicos, setTopicos] = useState([])
    const [secoes, setSecoes] = useState([])
    const [activeEditor, setActiveEditor] = useState('');


    useEffect(() => {
        console.log(location.state)
        async function getItems() {
            try {
                const {data} = await axios.get(`api/Captura/findByPaciente?codPaciente=${paciente[0].codPaciente}&codMovimento=${paciente[0].codMovimento}`)
                const formattedResponse = data.map((i) => {
                    return {
                        ...i,
                        imagem: `data:image/png;base64,${i.imagem}`
                    }
                })
                setLaudoImages(formattedResponse)

            } catch (error) {
                message.error('Ocorreu um erro ao buscar os dados do paciente')
            }
        }

        getItems()
    }, [location, paciente])

    useEffect(() => {
        async function getItems() {
            try {
                const {data} = await axios.get(`api/Modelos/Secao/${modeloId}`)
                const formattedResponse = data.map((i) => {
                    return {
                        ...i,
                        imagem: `data:image/png;base64,${i.imagem}`
                    }
                })
                setSecoes(formattedResponse)

            } catch (error) {
                message.error('Ocorreu um erro ao buscar as secões do laudo')
            }
        }

        getItems()
    }, [location, paciente])

    useEffect(() => {
        async function getItems() {
            try {
                const {data} = await axios.get(`api/Laudo/Topico`)
                setTopicos(data)

            } catch (error) {
                console.log("err");
            }
        }

        getItems()
    }, [location, paciente])
    
    useEffect(() => {
        console.log("ed", activeEditor)

    }, [text])


    const handleInsertText = (e) => {
        const imageSrc = e.target.getContent()
        setText((img) => [...img, imageSrc])
        // activeEditor.execCommand('mceInsertContent', false, '<img alt="Smiley face" height="42" width="42" src="asdasd"/>');
        // e.target.execCommand('mceInsertContent', false, '<img alt="Smiley face" height="42" width="42" src="' + imageSrc + '"/>');
    }

    function handleSelectDevice(content) {
        console.log(content)
        setText((text) => [...text, content])
        activeEditor.execCommand('mceInsertContent', false, content[0]);
    }

    function handleSelectedImages(imgs) {
        setSelectedImages(imgs)
        console.log(imgs)
        activeEditor.execCommand('mceInsertContent', false, '<img style="align-self:center"   height="200" width="200" src=' + imgs.src + '/> <br/>');
    }
    
    
    function handleAddText({key}) {
        formRef?.current?.setFieldsValue({ faringe: key})
    }

    const menu = (
        <Menu onClick={handleAddText} >
            {
                topicos.map((item, i) => (
                    <Menu.Item key={item.conteudo} >{item.nome}</Menu.Item>
                ))
            }
        </Menu>
    )

    return (
        <>
            <Col span={24}>
                <PageHeader onBack={() => window.history.back()} title="Emitir Laudo"/>
                <Row gutter={[24]}>
                    <Col span={24}>
                        <Descriptions
                            title='Dados do Paciente'
                            bordered
                            size='middle'
                        >
                            <Descriptions.Item
                                label='Codigo'>{paciente ? paciente[0].codPaciente : ''}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label='Nome'>{paciente ? paciente[0].nomePaciente : ''}
                            </Descriptions.Item>
                            <Descriptions.Item label='Data de Nascimento'>
                                {
                                    moment(paciente ? paciente[0].dataNascimento : '')
                                        .format('DD/MM/YYYY')
                                } - {
                                moment()
                                    .year() - moment(paciente ? paciente[0].dataNascimento : '').years()} Anos
                            </Descriptions.Item>
                            <Descriptions.Item label='Telefone'>
                                {paciente ? paciente[0].telefone : ''}
                            </Descriptions.Item>
                            <Descriptions.Item label='Procedimento'>
                                {paciente ? paciente[0].nomeProcedimento : ''}
                            </Descriptions.Item>

                            <Descriptions.Item label='Medico Executante'>
                                {paciente ? paciente[0].medicoExecutante : ''}
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
            </Col>

            <Row gutter={[24]}>
                <Col span={16}>
                    <Card
                        title="Tópicos"
                        extra={
                            <Select
                                onChange={(item) => handleSelectDevice(item)}
                                placeholder="Selecione um Dispositivo"
                                style={{width: 120}}
                                mode="tags"
                                tokenSeparators={[","]}
                            >
                                {topicos.map((topic, i) => (
                                    <Option value={topic.conteudo}>{topic.nome}</Option>
                                ))}
                            </Select>
                        }
                    >
                        {/*<Editor*/}
                        {/*    onInit={(evt, editor) => (editorRef.current = editor)}*/}
                        {/*    value={text}*/}
                        {/*    init={{*/}
                        {/*        setup: editor => {*/}
                        {/*            console.log(editor)*/}
                        {/*            setActiveEditor(editor)*/}
                        {/*        },*/}
                        {/*        height: 500,*/}
                        {/*        resize: false,*/}
                        {/*        menubar: false,*/}
                        {/*        plugins: [*/}
                        {/*            "advlist autolink lists link image",*/}
                        {/*            "charmap print preview anchor help",*/}
                        {/*            "searchreplace visualblocks code",*/}
                        {/*            "insertdatetime media table paste wordcount save",*/}
                        {/*        ],*/}
                        {/*        toolbar:*/}
                        {/*            "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | print | image | save ",*/}
                        {/*        image_list: laudoImages.map((img, index) => ({*/}
                        {/*            title: `Imagem ${index}`,*/}
                        {/*            value: img.imagem,*/}
                        {/*        })),*/}
                        {/*    }}*/}
                        {/*    onChange={handleInsertText}*/}
                        {/*/>*/}
                        <Form 
                            ref={formRef}
                            name="Laudo"
                            
                            
                              autoComplete="off"
                        >
                            {secoes.map(sec => (
                                <Form.Item
                                    label={sec.secao}
                                    name={sec.secao}
                                >
                                    <Input  addonAfter={
                                        <Dropdown overlay={menu}  >
                                            <SearchOutlined />
                                        </Dropdown>
                                    } />


                                </Form.Item>
                            ))}
                        </Form>
                    </Card>
                    <Col span={24}>
                        <form>
                            <Button name="submitbtn">Salvar</Button></form>
                    </Col>
                </Col>

                <Col span={8}>
                    <Card
                        title="Imagens"
                        bodyStyle={{overflowY: "scroll", maxHeight: "500px"}}
                    >
                        {laudoImages.length >= 1 ? (
                            <ImagePicker
                                images={laudoImages.map((image, i) => ({
                                    src: image.imagem,
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
        </>
    )
}

export default Laudo
