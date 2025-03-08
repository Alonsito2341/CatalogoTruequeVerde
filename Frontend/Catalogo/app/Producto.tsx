import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PanResponder, Animated, Dimensions, TextInput, Image, ScrollView, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts } from 'expo-font'; // Importa useFonts para cargar las fuentes

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const Producto = ({ closeModal }: { closeModal: () => void }) => {
  const [translateY] = useState(new Animated.Value(screenHeight));
  const [mensaje, setMensaje] = useState('');
  const [placeholderVisible, setPlaceholderVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    require('../assets/images/mango.jpg'),
    require('../assets/images/mango2.jpg'),
    require('../assets/images/mango3.jpg'),
  ];

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleImageChange = (index: number) => {
    setCurrentIndex(index);
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
    onPanResponderMove: Animated.event([null, { dy: translateY }], { useNativeDriver: false }),
    onPanResponderGrant: () => {
      setIsDragging(true);
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 200) {
        // Si se desliza lo suficiente, cerrar el modal
        Animated.spring(translateY, { toValue: screenHeight, useNativeDriver: true }).start(() => {
          closeModal(); // Llama a closeModal solo cuando la animación haya terminado
        });
      } else {
        // Si no se desliza lo suficiente, vuelve al estado inicial
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
      }
      setIsDragging(false);
    },
  });

  if (!fontsLoaded) {
    return <Text>Cargando fuentes...</Text>;
  }

  return (
    <Animated.View {...panResponder.panHandlers} style={[styles.modalContainer, { transform: [{ translateY }] }]}>
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Icon name="times" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { fontFamily: 'Poppins-Bold' }]}>Mangos</Text>
        </View>

        <View style={styles.imageContainer}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View style={styles.imageWrapper}>
                <Image source={item} style={styles.productImage} />
              </View>
            )}
            onScroll={(event) => {
              const contentOffsetX = event.nativeEvent.contentOffset.x;
              const index = Math.floor(contentOffsetX / screenWidth);
              handleImageChange(index);
            }}
            keyExtractor={(item, index) => index.toString()}
            snapToInterval={screenWidth}
            decelerationRate="fast"
          />

          <View style={styles.paginationContainer}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[styles.paginationDot, currentIndex === index && styles.activeDot]}
              />
            ))}
          </View>
        </View>

        <Text style={[styles.locationText, { fontFamily: 'Poppins-Bold' }]}>Contactar al vendedor</Text>
        <View style={styles.messageContainer}>
          <TextInput
            style={[styles.messageInput, { fontFamily: 'Poppins-Regular' }]}
            placeholder={placeholderVisible ? 'Enviar mensaje...' : ''}
            placeholderTextColor="#777"
            value={mensaje}
            onChangeText={(text) => {
              setMensaje(text);
              setPlaceholderVisible(text === '');
            }}
            onBlur={() => setPlaceholderVisible(mensaje === '')}
          />
          <TouchableOpacity style={styles.sendButton}>
            <Text style={[styles.buttonText, { fontFamily: 'Poppins-Bold' }]}>Enviar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          <Text style={[styles.locationText, { fontFamily: 'Poppins-Bold' }]}>Descripción</Text>
          <Text style={[styles.modalText, { fontFamily: 'Poppins-Regular' }]}>
            Buen día, estoy intercambiando mangos por alguna fruta de temporada. Si te interesa, no dudes en contactarme para ponernos de acuerdo y hacer el intercambio.
          </Text>

          <Text style={[styles.locationText, { fontFamily: 'Poppins-Bold' }]}>Información del usuario</Text>
          <View style={styles.userInfo}>
            <Image source={require('../assets/images/perfil.jpg')} style={styles.userImage} />
            <View>
              <Text style={[styles.userName, { fontFamily: 'Poppins-Bold' }]}>John Cena</Text>
              <View style={styles.stars}>
                <Icon name="star" size={20} color="#FFD700" />
                <Icon name="star" size={20} color="#FFD700" />
                <Icon name="star" size={20} color="#FFD700" />
                <Icon name="star" size={20} color="#FFD700" />
                <Icon name="star-half" size={20} color="#FFD700" />
              </View>
            </View>
          </View>

          <View style={styles.locationContainer}>
            <Text style={[styles.locationText, { fontFamily: 'Poppins-Bold' }]}>Ubicación</Text>
            <Text style={styles.locationDetail}>Instituto Tecnológico de Matamoros, Tamaulipas</Text>
          </View>

          <Image source={require('../assets/images/mapa.png')} style={styles.mapImage} />
        </ScrollView>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
    modalContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo oscuro semi-transparente
        height: screenHeight * 0.8,
        justifyContent: 'flex-end',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
      },
      modalContent: {
        backgroundColor: '#fff', // Aquí se ajusta el fondo de la vista general
        padding: 20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        width: '100%',
        height: '100%',
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#FF6347', // Header naranja
        paddingVertical: 10, // Un poco de espacio en el header
        borderTopLeftRadius: 25, // Para que el borde superior sea redondeado
        borderTopRightRadius: 25,
      },
      closeButton: {
        marginLeft: 10,
        marginRight:15,
      },
      modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff', // Título en color blanco para contrastar
      },
      imageContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 200,
        marginVertical: 10,
      },
  productImage: {
    width: '100%', 
    height: 200,
    borderRadius: 10,
    marginBottom: 0,
    alignSelf: 'center',
  },
  imageWrapper: {
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0, 
    overflow: 'hidden',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 5,
    backgroundColor: '#ddd',
  },
  activeDot: {
    backgroundColor: '#FFD700',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  messageInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 50,
    paddingLeft: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 50,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'left',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stars: {
    flexDirection: 'row',
  },
  locationContainer: {
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  locationDetail: {
    fontSize: 14,
    color: '#555',
  },
  mapImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
});

export default Producto;
