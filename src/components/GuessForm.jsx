import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useGame } from '../context/GameContext';

export default function GuessForm() {
  const {
    mode,
    answer,
    setAnswer,
    guess,
    options,
    eliminatedOptions,
    hintText,
    requestHint,
    feedback,
    isPlaying,
  } = useGame();

  return (
    <View style={styles.container}>
      {mode === 'flags' ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Escribí el nombre del país"
            value={answer}
            onChangeText={setAnswer}
            autoCapitalize="words"
            editable={isPlaying && !feedback}
            onSubmitEditing={() => {
              if (answer.trim()) guess(answer);
            }}
            returnKeyType="done"
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => guess(answer)}
            disabled={!isPlaying || !!feedback || !answer.trim()}
          >
            <Text style={styles.buttonText}>Responder</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.options}>
          {options.map((option) => {
            const eliminated = eliminatedOptions.includes(option);

            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.option,
                  eliminated && styles.eliminated,
                ]}
                disabled={!isPlaying || !!feedback || eliminated}
                onPress={() => guess(option)}
              >
                <Text style={styles.optionText}>
                  {eliminated ? '❌ Opción eliminada' : option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <TouchableOpacity
        style={styles.hintButton}
        onPress={requestHint}
        disabled={!isPlaying || !!feedback}
      >
        <Text style={styles.hintText}>💡 Pedir pista (-2 segundos)</Text>
      </TouchableOpacity>

      {!!hintText && (
        <Text style={styles.hintResult}>
          Pista: {hintText}
        </Text>
      )}

      {!!feedback && (
        <Text style={styles.feedback}>{feedback}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4F46E5',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  options: {
    gap: 10,
  },
  option: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A5B4FC',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  eliminated: {
    backgroundColor: '#E5E7EB',
    borderColor: '#D1D5DB',
  },
  optionText: {
    color: '#1E1B4B',
    fontSize: 16,
    fontWeight: '600',
  },
  hintButton: {
    padding: 13,
    alignItems: 'center',
    marginTop: 8,
  },
  hintText: {
    color: '#4338CA',
    fontWeight: 'bold',
  },
  hintResult: {
    textAlign: 'center',
    color: '#4338CA',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    letterSpacing: 2,
  },
  feedback: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3730A3',
    marginTop: 10,
  },
});
