import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';

export default function Timer() {
  const { timeLeft } = useGame();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        ⏱ Tiempo restante: {timeLeft} s
      </Text>
      <View style={styles.barBackground}>
        <View
          style={[
            styles.bar,
            { width: `${(timeLeft / 15) * 100}%` },
          ]}
        />
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  text: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
    color: '#172554',
  },
  barBackground: {
    height: 9,
    backgroundColor: '#DBEAFE',
    borderRadius: 10,
    marginTop: 8,
    overflow: 'hidden',
  },
  bar: {
    height: 9,
    backgroundColor: '#4F46E5',
    borderRadius: 10,
  },
});
