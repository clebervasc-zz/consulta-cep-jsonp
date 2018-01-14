import React from 'react';
import axios from 'axios';
import InputMask from 'react-input-mask'
import {validateZip} from './items/validation.js'

class InputText extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let helpBlock = <span className="help-block"></span>
        if(this.props.error)
            helpBlock = <span className="help-block">{this.props.title}</span>

        return (
            <div>
                <InputMask mask={this.props.mask} maskChar="" type="text" id={this.props.id} name={this.props.name} title={this.props.title} placeholder={this.props.placeholder} onChange={this.props.handleChange} value={this.props.value}/>
                {helpBlock}
            </div>
        )
    }
}

export default class ConsultZip extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            result:false,
            zip:'',
            address:'',
            neighborhood:'',
            city:'',
            state:'',
            errors: {},
            validating:false
        };

        window.myfn = this.handleRequest.bind(this);
        this.HandleChange = this.HandleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRequest = this.handleRequest.bind(this);
        this.handleView = this.handleView.bind(this);
        
    }

    HandleChange(e){

        if(this.state.zip.length > 8){
            this.setState({
                result:false,
                zip:'',
                address:'',
                neighborhood:'',
                city:'',
                state:'',
            })
        }

        this.setState({
            [e.target.name]:e.target.value
        });
    }


    handleSubmit(e){
        e.preventDefault();

        let errors = {}
        this.setState({errors: errors})

        if(validateZip(this.state.zip) === false) {
            errors['zip'] = true
            this.setState({errors: errors})
            document.getElementById('zip').focus()
            return false
        }

        if(! this.state.validating) {
            this.setState({loading: true})
            let inputZip = this.state.zip.replace(/\.|\-/g, '');
        
            axios.get('https://viacep.com.br/ws/'+inputZip+'/json/?callback=myfn')
            .then(res => {
                eval(res.data)
                this.setState({validating: false})
            })
            .catch(err => {
                console.log(err)
                this.setState({validating: false})
            })
        }

        return false
        
    }
    
    handleRequest(data) {
        if(!data.erro){
            this.setState({
                result: true,
                address:data.logradouro,
                neighborhood:data.bairro,
                city:data.localidade,
                state:data.uf
            });
        } else {
            let errors = {}
            this.setState({errors: errors})
            
            errors['zip'] = true
            this.setState({errors: errors})
            document.getElementById('zip').focus()
            return false
        }
    }

    handleView(e){
        e.preventDefault();

        this.setState({
            result:false,
            zip:'',
            address:'',
            neighborhood:'',
            city:'',
            state:'',
        })
    }
    
    render(){

        let content = (

            <div id="local">
                <a href="#" className="close" onClick={this.handleView}>X</a>
                <h1>{this.state.address}</h1>
                <p>
                    {this.state.neighborhood} <br />
                    {this.state.city} - {this.state.state}<br />
                    {this.state.zip}
                </p>
                <iframe 
                    width="100%" 
                    height="350px" 
                    frameBorder="0" 
                    src={'https://www.google.com/maps/embed/v1/place?key=AIzaSyArQCYs48SEAD3-UHoApU7-tzsCpmEH7aI&q='+this.state.zip}
                    allowFullScreen>
                </iframe>
            </div>
        )

        return(
            <section id="hero">
                <div className="container">
                    <h1>Consulta de Endereço</h1>
                    <div className="box">
                        <form onSubmit={this.handleSubmit} className="form-inline">
                            <h3>Consultar</h3>
                            <div className="group">
                                <label htmlFor="zip">CEP</label>
                                <InputText type="text" mask="99999-999" id="zip" name="zip" title="Por favor, digite o CEP corretamente!" placeholder="Digite o cep" handleChange={this.HandleChange} 
                                error={this.state.errors.zip} value={this.state.zip} />
                                <button>Buscar</button>
                            </div>
                        </form>
                    </div>

                    { this.state.result ? content : '' }
                </div>

            </section>
        )
    }
}