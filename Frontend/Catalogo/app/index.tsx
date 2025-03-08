import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, Animated, Modal, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Producto from './Producto';  
import { useFonts } from 'expo-font';

const products = [
  { id: '1', nombre: 'Mangos', descripcion: 'Mangos de temporada, busco cambio', imagen: require('../assets/images/mango.jpg'), categoria: 'frutas' },
  { id: '2', nombre: 'Peras', descripcion: 'Intercambio por naranjas de temporada', imagen: require('../assets/images/peras.jpg'), categoria: 'frutas' },
  { id: '3', nombre: 'Papas', descripcion: 'Papas recién cosechadas para cambiar', imagen: require('../assets/images/papa.jpg'), categoria: 'verduras' },
  { id: '4', nombre: 'Naranjas', descripcion: 'Naranjas de temporada, busco cambio', imagen: require('../assets/images/naranja.jpg'), categoria: 'frutas' },
  { id: '5', nombre: 'Manzana', descripcion: 'Manzana de temporada dulce', imagen: require('../assets/images/manzana.jpg'), categoria: 'frutas' },
  { id: '6', nombre: 'Semilla de cilantro', descripcion: 'Cambio por tomate', imagen: require('../assets/images/cilantro.jpg'), categoria: 'semillas' },
];

const App = () => {
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false); 
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [slideAnim] = useState(new Animated.Value(Dimensions.get('window').height)); 
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  const openModal = () => {
    setModalVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.spring(slideAnim, {
      toValue: Dimensions.get('window').height,
      useNativeDriver: true,
    }).start(() => setModalVisible(false)); 
  };

  const openFilterModal = () => {
    setFilterModalVisible(true);
  };

  const closeFilterModal = () => {
    setFilterModalVisible(false);
  };

  const applyFilter = (category) => {
    setSelectedCategory(category);
    closeFilterModal();
  };

  const filteredProducts = selectedCategory 
    ? products.filter(item => item.categoria === selectedCategory) 
    : products;

  const scrollY = new Animated.Value(0);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [80, 0],
    extrapolate: 'clamp',
  });

  const borderRadius = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [35, 0],
    extrapolate: 'clamp',
  });

  const translateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -80],
    extrapolate: 'clamp',
  });

  
  const getCategoryBorderColor = (categoria) => {
    switch (categoria) {
      case 'frutas':
        return '#FF6347'; 
      case 'verduras':
        return '#32CD32'; 
      case 'semillas':
        return '#FFD700';
      default:
        return '#ADD8E6';
    }
  };

  if (!fontsLoaded) {
    return <Text>Cargando fuentes...</Text>;
  }

  return (
    <View style={styles.contenedor}>
      <Animated.View style={[styles.header, { height: headerHeight, opacity: headerHeight.interpolate({ inputRange: [0, 80], outputRange: [0, 1] }) }]}> 
        <Text style={styles.titulo}>Trueque Verde</Text>
        <TouchableOpacity>
          <Icon name="bars" size={35} style={styles.iconoMenu} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.contenedorBuscarFiltrarPublicar, { borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius, transform: [{ translateY }] }]}> 
        <View style={styles.buscarContenedor}>
          <TextInput
            style={styles.textoBuscar}
            placeholder="Buscar..."
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity style={styles.botonFiltrar} onPress={openFilterModal}>
            <Text style={styles.textoBoton}>Filtrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.PublicarButton}>
            <Text style={styles.textoBoton}>Publicar</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <FlatList
        style={styles.list}
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.publicacion}>
            <Image 
              source={item.imagen} 
              style={[styles.imagen, { borderColor: getCategoryBorderColor(item.categoria), borderWidth: 4 }]} // Añadimos el borde con color
            />
            <View style={styles.textoContenedor}>
              <Text style={styles.nombreProducto}>{item.nombre}</Text>
              <Text style={styles.descripcion}>{item.descripcion}</Text>
              <TouchableOpacity style={styles.botonVerMas} onPress={openModal}>
                <Text style={styles.textoBoton}>Ver</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      
      <Modal
        visible={modalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <Animated.View
            style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]} >
            <Producto closeModal={closeModal} />
          </Animated.View>
        </View>
      </Modal>

      {/* Modal para las opciones de filtro */}
      <Modal
        visible={filterModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeFilterModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.filterModalContent}>
            <TouchableOpacity 
              style={[styles.filterOption, { backgroundColor: '#FF6347' }]} 
              onPress={() => applyFilter('frutas')}>
              <Text style={styles.filterOptionText}>Frutas</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterOption, { backgroundColor: '#32CD32' }]} 
              onPress={() => applyFilter('verduras')}>
              <Text style={styles.filterOptionText}>Verduras</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterOption, { backgroundColor: '#FFD700' }]} 
              onPress={() => applyFilter('semillas')}>
              <Text style={styles.filterOptionText}>Semillas</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterOption, { backgroundColor: '#ADD8E6' }]} 
              onPress={() => applyFilter(null)}>
              <Text style={styles.filterOptionText}>Todos</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.filterCloseButton} 
              onPress={closeFilterModal}>
              <Text style={styles.filterCloseButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#e5e4e4' },
  header: { top: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: '#29b063', paddingHorizontal: 25, alignItems: 'center', justifyContent: 'space-between' },
  titulo: { color: '#fff', fontSize: 20, fontWeight: 'bold', fontFamily: 'Poppins-Bold' },
  iconoMenu: { color: "#fff", marginLeft: 'auto' }, 
  contenedorBuscarFiltrarPublicar: { top: 80, left: 0, right: 0, zIndex: 2, paddingHorizontal: 10, paddingVertical: 25, backgroundColor: '#6cc200' },
  buscarContenedor: { flexDirection: 'row', padding: 10 },
  textoBuscar: { flex: 1, backgroundColor: '#fff', padding: 10, borderRadius: 10, fontFamily: 'Poppins-Regular' },
  botonFiltrar: { backgroundColor: '#6cc200', padding: 10, marginLeft: 10, borderRadius: 10 },
  PublicarButton: { backgroundColor: '#ff6549', padding: 10, marginLeft: 10, borderRadius: 10 },
  textoBoton: { fontWeight: 'bold', textAlign: 'center', fontFamily: 'Poppins-Regular' },
  publicacion: { backgroundColor: '#fff', borderRadius: 10, marginHorizontal: 10, marginVertical: 5, flexDirection: 'row', paddingHorizontal: 15, paddingVertical: 20, alignItems: 'center' },
  imagen: { width: 130, height: 130, borderRadius: 10, marginRight: 15 },
  textoContenedor: { flex: 1 },
  nombreProducto: { fontSize: 16, fontWeight: 'bold', fontFamily: 'Poppins-Bold' },
  descripcion: { color: '#555', fontFamily: 'Poppins-Regular' },
  botonVerMas: { backgroundColor: '#FFD700', padding: 8, marginTop: 5, borderRadius: 10 },
  list: { flex: 1, marginTop: 80, zIndex: 1 },
  listContent: { paddingBottom: 20 },
  modalBackground: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { width: '100%', height: height * 0.8, backgroundColor: 'white', borderTopLeftRadius: 10, borderTopRightRadius: 10, padding: 20, alignItems: 'center', justifyContent: 'center' },
  filterModalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center' },
  filterOption: { padding: 15, marginBottom: 10, width: '100%', borderRadius: 10, alignItems: 'center' },
  filterOptionText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  filterCloseButton: { marginTop: 20, backgroundColor: '#ccc', padding: 10, borderRadius: 10 },
  filterCloseButtonText: { color: 'white', fontSize: 16 }
});

export default App;
