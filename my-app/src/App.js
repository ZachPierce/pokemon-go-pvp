import './App.css';
import React from 'react';

import AppInfo from './components/AppInfo';
import PokemonInfo from './components/PokemonInfo'
import { type } from '@testing-library/user-event/dist/type';

class App extends React.Component {
  
  state = {
    completePokemonInfo: {}
  }

  componentDidMount() {
    this.getPokemonData()
  }

  getPokemonData = async () => {
    let pokemonNames, pokemonTypes
    
    const nameCall = await fetch("https://pogoapi.net/api/v1/pokemon_types.json");
    pokemonNames = await nameCall.json();

    const typeCall = await fetch("https://pogoapi.net/api/v1/type_effectiveness.json");
    pokemonTypes = await typeCall.json();

    
    this.formatData(pokemonTypes, pokemonNames)

  }

  formatData = (pokemonTypes, pokemonNames) => {
    //types comes in as a key value pair like so 
    // {
          //bug: Bug: 1, water: 1
          //water: bug: 1, water:0.5
    // }

    //names comes in as an array like so
    // [
    //   pokemonName: "pikachu",
    //   type: ["electric", "cute"]
    // ]

    //the structure we want is as follows
    // {
    //   pikachu: {type: "electric", weakness: ["ground"], resists: ["flying"] }
    // }

    let completePokeInfo = {}

    for (let pokemon of pokemonNames) {

      let name = pokemon.pokemon_name

      if (pokemon.form === "Alola" || pokemon.form === "Galarian" || pokemon.form === "Normal") {

        if (pokemon.form === "Alola") {
          name = "Alolan " + pokemon.pokemon_name
        } else if (pokemon.form === "Galarian") {
          name = "Galarian " + pokemon.pokemon_name
        } 
        let data = {weakTo: "none", resistantTo: "all"}
        if (name === "Whiscash") data = this.calculateWeaknessAndResistances(pokemon.type, pokemonTypes)

        completePokeInfo[name] = {type: pokemon.type, weakness: data.weakTo, resistances: data.resistantTo}
      }
      
    }
    //eventually we will set the state here 
   // console.log("pokemonInfo", completePokeInfo)
  }

  calculateWeaknessAndResistances = (pokemonTypes, allTypes) => {
    let weakTo = {}
    let resistantTo = {}

    Object.keys(allTypes[pokemonTypes[0]]).forEach( currentValues => {
      let nestedValue = allTypes[pokemonTypes[0]]
      console.log("curent", currentValues, nestedValue[currentValues])
    })
    

    for (let pokeType of pokemonTypes) {
      console.log("current type", pokeType, "data at current", allTypes[pokeType])
    }
    
    return {weakTo, resistantTo}
  }

  render() {
    return (
      <div className="App">
        <AppInfo />
        <PokemonInfo />
      </div>
    )

  }

}

export default App;
