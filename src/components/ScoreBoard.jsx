import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';

export default function ScoreBoard() {
  const { score, playerName } = useGame();

  return (
    <View style={styles.container}>
      <Text style={styles.player}>Jugador: {playerName}</Text>
      <Text style={styles.score}>⭐ {score} puntos</Text>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0E7FF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  player: {
    fontSize: 15,
    color: '#3730A3',
  },
  score: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#312E81',
    marginTop: 5,
  },
});
