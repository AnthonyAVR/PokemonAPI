import React, { useEffect, useState } from 'react';
import './App.css';
import Modal from 'react-modal';

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null); // Almacenar el Pokémon seleccionado
  const [isModalOpen, setIsModalOpen] = useState(false); // Controlar el modal

  // Configuración para React Modal
  Modal.setAppElement('#root');

  // Obtener los primeros 5000 Pokémon al cargar la aplicación
  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=5000')
      .then(response => response.json())
      .then(data => setPokemons(data.results))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Filtrar Pokémon cuando el usuario busca
  useEffect(() => {
    setFilteredPokemons(
      pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, pokemons]);

  // Obtener el ID del Pokémon desde su URL
  const getPokemonId = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 2]; // El ID está justo antes del último '/'
  };

  // Manejar la entrada de búsqueda
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Abrir el modal y obtener datos del Pokémon seleccionado
  const openModal = (pokemonUrl) => {
    fetch(pokemonUrl)
      .then(response => response.json())
      .then(data => {
        setSelectedPokemon(data);
        setIsModalOpen(true); // Abrir el modal
      })
      .catch(error => console.error('Error fetching pokemon details:', error));
  };

  // Cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPokemon(null);
  };

  return (
    <div className="App">
      <h1>Pokémon Finder</h1>
      <input
        type="text"
        placeholder="Buscar Pokémon"
        value={search}
        onChange={handleSearch}
        className="search-bar"
      />
      <div className="pokemon-list">
        {filteredPokemons.map((pokemon, index) => {
          const pokemonId = getPokemonId(pokemon.url);
          const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

          return (
            <div
              key={index}
              className="pokemon-card"
              onClick={() => openModal(pokemon.url)} // Agregamos el evento de clic
            >
              <img src={imageUrl} alt={pokemon.name} />
              <h3>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
            </div>
          );
        })}
      </div>

      {/* Modal para mostrar los detalles del Pokémon */}
      {selectedPokemon && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Detalles del Pokémon"
          className="pokemon-modal"
          overlayClassName="pokemon-modal-overlay"
        >
          <h2>{selectedPokemon.name.charAt(0).toUpperCase() + selectedPokemon.name.slice(1)}</h2>
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedPokemon.id}.png`}
            alt={selectedPokemon.name}
          />
          <p><strong>Altura:</strong> {selectedPokemon.height / 10} m</p>
          <p><strong>Peso:</strong> {selectedPokemon.weight / 10} kg</p>
          <p><strong>Habilidades:</strong> {selectedPokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
          <button onClick={closeModal} className="close-button">Cerrar</button>
        </Modal>
      )}
    </div>
  );
}

export default App;

