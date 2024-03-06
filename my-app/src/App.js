import './App.css';
import React from 'react';

import AppInfo from './components/AppInfo';
import PokemonInfo from './components/PokemonInfo'
import { type } from '@testing-library/user-event/dist/type';

class App extends React.Component {
  
  state = {
    completePokeInfo: {}
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
      //we only want to look at normal, alolan and galarian pokemon. The data source we are dealing with
      //has tiings like gofest and party hat and such that we don't need to worry about
      if (pokemon.form === "Alola" || pokemon.form === "Galarian" || pokemon.form === "Normal") {

        if (pokemon.form === "Alola") {
          name = "Alolan " + pokemon.pokemon_name
        } else if (pokemon.form === "Galarian") {
          name = "Galarian " + pokemon.pokemon_name
        } 
        
        //need to calcuulate the weaknesses and resistances
        let data = this.calculateWeaknessAndResistances(pokemon.type, pokemonTypes)

        //set our data once we have calculated it
        completePokeInfo[name] = {type: pokemon.type, weakness: data.weakTo, resistances: data.resistantTo}
      }
      
    }

   this.setState( {completePokeInfo} )
  }

  calculateWeaknessAndResistances = (pokemonTypes, allTypes) => {
    let typeEffectiveness = {}
    let weakTo = {}
    let resistantTo = {}

    //loop through the types of the pokemon that we are calculating, this can be either a single type or a double type
    //ie ["water"] or ["ground", "water"]
    for (let pokemonType of pokemonTypes) {
      //ths first loop is for the key value pair of all the possible types
      Object.keys(allTypes).forEach( allTypesKey => {
        
        //this next loop loops through the map of types that the parent type is either
        //strong against or weak against
        Object.keys(allTypes[allTypesKey]).forEach(typeDataKey => {
          let typeDataValue = allTypes[allTypesKey]
          let ourValue = typeDataValue[typeDataKey]
          
          //we only watnt to look at the values that are effecting our current pokemons type
          if (typeDataKey === pokemonType) {
            if (typeEffectiveness[allTypesKey]) {
              typeEffectiveness[allTypesKey] = typeEffectiveness[allTypesKey] * ourValue
            } else {
              typeEffectiveness[allTypesKey] = ourValue
            }
          }
        })
      })
    }
    
    //final loop thorugh to calculate the overall weakness and resistance, this is primarily for double typed pokemon
    //if there is a single type this doesn't do anything really
    Object.keys(typeEffectiveness).forEach( pokeType => {
      if (typeEffectiveness[pokeType] > 1) weakTo[pokeType] = typeEffectiveness[pokeType]
      if (typeEffectiveness[pokeType] < 1) resistantTo[pokeType] = typeEffectiveness[pokeType]
    })
    
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
