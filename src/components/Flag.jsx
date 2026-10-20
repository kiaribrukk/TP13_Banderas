import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';

export default function Flag() {
  const { currentCountry, mode } = useGame();

  if (!currentCountry) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {mode === 'capital'
          ? '¿Cuál es la capital de este país?'
          : '¿A qué país pertenece esta bandera?'}
      </Text>

      <Image
        source={{ uri: currentCountry.flag }}
        style={styles.flag}
        resizeMode="contain"
      />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 18,
  },
  label: {
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'center',
    color: '#172554',
    marginBottom: 18,
  },
  flag: {
    width: 280,
    height: 175,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
});
