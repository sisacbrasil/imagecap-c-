import React, {useState} from "react"
import {Button, Layout, Menu, Space} from "antd"

import {MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined, TableOutlined} from "@ant-design/icons"

import {Link} from "react-router-dom"
import {Logo, LogoContainer} from "./styles"

import logo from "../../assets/logo.png"

export default function Index({children}) {
    const {Header, Sider, Content, Footer} = Layout
    const {SubMenu} = Menu;
    const [collapsed, setCollapsed] = useState(false)

    const toggleMenu = () => setCollapsed((state) => !state)

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width="300"
                style={{
                    overflow: "auto",
                    left: 0,
                }}
            >
                <LogoContainer>
                    <Logo src={logo}/>
                </LogoContainer>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
                    <Menu.Item key="1">
                        <Link to="/atendimentos">
                            <TableOutlined/>
                            <span>Lista de Espera de Exames</span>
                        </Link>
                    </Menu.Item>
                    {/*<Menu.Item key="2">*/}
                    {/*    <Link to="/laudo">*/}
                    {/*        <TableOutlined/>*/}
                    {/*        <span>Laudo</span>*/}
                    {/*    </Link>*/}
                    {/*</Menu.Item>*/}
                    {/*<Menu.Item key="3">*/}
                    {/*    <Link to="/configuracao">*/}
                    {/*        <TableOutlined/>*/}
                    {/*        <span>Configuração</span>*/}
                    {/*    </Link>*/}
                    {/*</Menu.Item>*/}
                    <Menu.Item key="4">
                        <Link to="/player">
                            <TableOutlined/>
                            <span>Video Player</span>
                        </Link>
                    </Menu.Item>
                    <SubMenu key="sub1" icon={<SettingOutlined/>} title="Configurações">
                        <Menu.Item key="5">
                            <Link to="/modelos">
                                <TableOutlined/>
                                <span>Modelos</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="6">
                            <Link to="/topicos">
                                <TableOutlined/>
                                <span>Topicos</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{padding: 0}}>
                    <Space className="toggle" style={{
                        paddingLeft: "10px"
                    }}>
                        <Button
                            onClick={toggleMenu}
                            icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                        />
                    </Space>
                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: "24px 16px",
                        padding: 10,
                        minHeight: "auto",
                    }}
                >
                    <div>{children}</div>
                </Content>
                <Footer style={{textAlign: "center"}}>
                    Sisac Image ©2021 Desenvolvido por Sisac Brasil
                </Footer>
            </Layout>
        </Layout>
    )
}
