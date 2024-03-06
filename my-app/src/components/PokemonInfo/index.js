import React from 'react';

class PokemonInfo extends React.Component {

    render() {
        let types = this.props.type[0]
        if (this.props.type[1]) types = types + " " + this.props.type[1]
        console.log("types", this.props);
        return (
            <div className="pokemon-info-card-container">
                <div className='card'>
                   
                    <div className='card-top'>
                        <div>{this.props.name}</div>
                        <div>{types}</div>
                    </div>

                    <div className='card-bottom'>
                        <div className='bottom-container'>Weak To: {Object.keys(this.props.weakness).map(weakType => {
                            return (
                                <div className='info-bubble'>
                                    <div className='info-type'>{weakType}</div>
                                    <div className='info-value'>{this.props.weakness[weakType]}</div>
                                </div>
                            )
                        })}</div>
                        <div className='bottom-container'>Resists: {Object.keys(this.props.resistances).map(resType => {
                            return (
                                <div className='info-bubble'>
                                    <div className='info-type'>{resType}</div>
                                    <div className='info-value'>{this.props.resistances[resType]}</div>
                                </div>
                            )
                        })}</div>
                    </div>
                   
                </div>
               
            </div>
        )
    }
   
}

require('./styles.css')

export default PokemonInfo;