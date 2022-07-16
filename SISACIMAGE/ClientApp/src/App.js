import React from 'react'
import 'antd/dist/antd.css'
import {ConfigProvider} from 'antd'
import './custom.css'
import {BrowserRouter} from 'react-router-dom'
import ptBR from 'antd/lib/locale/pt_BR'
import Routes from './routes'


const App = () => (
    <BrowserRouter>
        <ConfigProvider locale={ptBR}>
            <Routes/>
        </ConfigProvider>
    </BrowserRouter>
)

export default App
