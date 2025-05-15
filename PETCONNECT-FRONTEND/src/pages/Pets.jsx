import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import PetForm from '../components/PetForm';
import PetCard from '../components/PetCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Pets({ addToast }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [petToEdit, setPetToEdit] = useState(null);
  const [petToDelete, setPetToDelete] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const { data } = await api.get('/api/pets');
        setPets(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar las mascotas.');
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const handleSave = pet => {
    setPets(curr => {
      const exists = curr.some(p => p.id === pet.id);
      if (exists) {
        return curr.map(p => (p.id === pet.id ? pet : p));
      }
      return [pet, ...curr];
    });
    addToast('Mascota guardada con éxito', 'success');
    setPetToEdit(null);
  };

  const handleEdit = pet => {
    setPetToEdit(pet);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = pet => {
    setPetToDelete(pet);
    toast.warning(
      <div>
        <p>¿Seguro que quieres eliminar {pet.name}?</p>
        <button className="btn btn-danger me-2" onClick={() => confirmDelete(pet.id)}>Sí, eliminar</button>
        <button className="btn btn-secondary" onClick={() => setPetToDelete(null)}>Cancelar</button>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  const confirmDelete = async id => {
    try {
      await api.delete(`/api/pets/${id}`);
      setPets(curr => curr.filter(p => p.id !== id));
      addToast('Mascota eliminada con éxito', 'success');
    } catch (err) {
      console.error(err);
      addToast('Error al borrar la mascota', 'error');
    } finally {
      setPetToDelete(null);
    }
  };

  if (loading) return <p>Cargando mascotas...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Mis Mascotas</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <PetForm 
        onSaved={handleSave} 
        petToEdit={petToEdit} 
        addToast={addToast} 
        onCancel={() => setPetToEdit(null)}
      />

      <div className="row mt-4">
        {pets.map(pet => (
          <div className="col-md-4 mb-3" key={pet.id}>
            <PetCard 
              pet={pet} 
              onDelete={() => handleDelete(pet)} 
              onEdit={() => handleEdit(pet)} 
            />
          </div>
        ))}
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
}
