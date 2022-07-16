import React from "react"
import {Route, Switch} from "react-router-dom"
import {MainLayout} from "../Layouts"
import {Atendimento, Atendimentos, Configuracao, Laudo, Player, Topicos, Modelos} from '../pages'

const Routes = ({pageProps}) => (
    <Switch>
        {/*<Route path="/login" component={SignIn} />*/}
        <MainLayout>
            {/*<Route path="/" exact component={Dashboard} />*/}
            <Route path="/atendimentos" component={Atendimentos}/>
            <Route path="/atendimento/:codMovimento/:codExame/:filial" component={Atendimento}/>
            <Route path="/laudo" component={Laudo}/>
            <Route path="/modelos" component={Modelos}/>
            <Route path="/topicos" component={Topicos}/>
            {/*<Route path="/dashboard" exact component={Dashboard} />*/}
            <Route path="/player" exact component={Player}/>
            <Route path="/configuracao" exact component={Configuracao}/>
            <Route path="/modelos-laudo" exact component={Configuracao}/>
            <Route path="/tipos-laudo" exact component={Configuracao}/>
        </MainLayout>
    </Switch>
)
export default Routes
