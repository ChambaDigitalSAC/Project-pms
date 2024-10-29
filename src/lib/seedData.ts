import { supabase } from './supabase'

const sampleRooms = [
  {
    name: 'Habitación Estándar',
    type: 'standard',
    description: 'Habitación confortable con todas las comodidades básicas',
    price: 100,
    max_adults: 2,
    max_children: 1,
    size: '25m²',
    amenities: ['TV', 'WiFi', 'Aire acondicionado', 'Baño privado'],
    images: ['/rooms/standard.jpg']
  },
  {
    name: 'Suite Junior',
    type: 'suite',
    description: 'Espaciosa suite con sala de estar y vistas a la ciudad',
    price: 180,
    max_adults: 2,
    max_children: 2,
    size: '35m²',
    amenities: ['TV', 'WiFi', 'Minibar', 'Sala de estar', 'Vista ciudad'],
    images: ['/rooms/junior-suite.jpg']
  },
  {
    name: 'Suite Familiar',
    type: 'family',
    description: 'Suite amplia ideal para familias con niños',
    price: 250,
    max_adults: 3,
    max_children: 3,
    size: '45m²',
    amenities: ['TV', 'WiFi', 'Cocina', 'Sala de estar', 'Dos baños'],
    images: ['/rooms/family-suite.jpg']
  }
]

export async function seedRooms() {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .insert(sampleRooms)
      .select()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error seeding rooms:', error)
    throw error
  }
}
