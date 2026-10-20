import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';

export default function Leaderboard() {
  const { ranking } = useGame();


  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Tabla de posiciones</Text>

      {ranking.length === 0 ? (
        <Text style={styles.empty}>
          Todavía no hay partidas guardadas.
        </Text>
      ) : (
        ranking.map((player, index) => (
          <View key={`${player.name}-${index}`} style={styles.row}>
            <Text style={styles.position}>
              {index + 1}.
            </Text>
            <Text style={styles.name}>{player.name}</Text>
            <Text style={styles.points}>
              {player.score} pts
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    width: '100%',
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#312E81',
    marginBottom: 12,
  },
  empty: {
    color: '#64748B',
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  position: {
    width: 32,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  name: {
    flex: 1,
    color: '#1E293B',
  },
  points: {
    fontWeight: 'bold',
    color: '#312E81',
  },
});
