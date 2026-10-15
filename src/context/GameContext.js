import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GameContext = createContext();

const FLAGS_API =
  'https://countriesnow.space/api/v0.1/countries/flag/images';

const CAPITALS_API =
  'https://countriesnow.space/api/v0.1/countries/capital';

const RANKING_KEY = '@fun_with_flags_ranking';

export function GameProvider({ children }) {
  const [countries, setCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [ranking, setRanking] = useState([]);
  const [mode, setMode] = useState('flags');
  const [timeLeft, setTimeLeft] = useState(15);
  const [hint, setHint] = useState('');
  const [answer, setAnswer] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [options, setOptions] = useState([]);
  const [usedCountries, setUsedCountries] = useState([]);
  const [eliminatedOptions, setEliminatedOptions] = useState([]);

  const countriesRef = useRef([]);
  const usedRef = useRef([]);
  const savedRef = useRef(false);

  // Cargar países y capitales al iniciar la aplicación.
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError('');

        const [flagsResponse, capitalsResponse] = await Promise.all([
          fetch(FLAGS_API),
          fetch(CAPITALS_API),
        ]);

        if (!flagsResponse.ok || !capitalsResponse.ok) {
          throw new Error('No se pudieron consultar las APIs.');
        }

        const flagsJson = await flagsResponse.json();
        const capitalsJson = await capitalsResponse.json();

        if (!flagsJson.data || !capitalsJson.data) {
          throw new Error('La respuesta de las APIs no es válida.');
        }

        const capitalMap = new Map(
          capitalsJson.data.map((item) => [
            item.name?.trim().toLowerCase(),
            item.capital,
          ])
        );

        const list = flagsJson.data
          .map((item) => {
            const name = item.name?.trim();
            const flag = item.flag;

            return {
              name,
              flag,
              capital: capitalMap.get(name?.toLowerCase()),
            };
          })
          .filter((country) => country.name && country.flag);

        if (list.length < 4) {
          throw new Error('No hay suficientes países para jugar.');
        }

        setCountries(list);
        countriesRef.current = list;

        const storedRanking = await AsyncStorage.getItem(RANKING_KEY);
        if (storedRanking) {
          setRanking(JSON.parse(storedRanking));
        }
      } catch (err) {
        setError(
          'No se pudieron cargar los países. Revisá tu conexión e intentá nuevamente.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function pickCountry(list, used) {
    const available = list.filter(
      (country) => !used.includes(country.name)
    );

    // Cuando se terminan los países, comienza una nueva vuelta.
    const pool = available.length > 0 ? available : list;

    if (pool.length === 0) return null;

    const selected = pool[Math.floor(Math.random() * pool.length)];

    const newUsed = available.length > 0
      ? [...used, selected.name]
      : [selected.name];

    setUsedCountries(newUsed);
    usedRef.current = newUsed;

    return selected;
  }

  function createOptions(country, list, currentMode) {
    if (!country) return [];

    const correctAnswer =
      currentMode === 'capital' ? country.capital : country.name;

    if (!correctAnswer) return [];

    const alternatives = list
      .filter((item) => {
        const value =
          currentMode === 'capital' ? item.capital : item.name;

        return value && value !== correctAnswer;
      })
      .map((item) =>
        currentMode === 'capital' ? item.capital : item.name
      );

    const uniqueAlternatives = [...new Set(alternatives)];

    for (let i = uniqueAlternatives.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [uniqueAlternatives[i], uniqueAlternatives[j]] = [
        uniqueAlternatives[j],
        uniqueAlternatives[i],
      ];
    }

    return [correctAnswer, ...uniqueAlternatives.slice(0, 2)].sort(
      () => Math.random() - 0.5
    );
  }

  function nextCountry() {
    const list = countriesRef.current;
    if (!list.length) return;

    let selected = pickCountry(list, usedRef.current);

    // En modo capitales, elegir un país que tenga capital disponible.
    if (mode === 'capital' && !selected?.capital) {
      const valid = list.filter((country) => country.capital);
      if (!valid.length) {
        setError('No se encontraron capitales para jugar.');
        return;
      }

      selected = pickCountry(valid, usedRef.current);
    }

    setCurrentCountry(selected);
    setTimeLeft(15);
    setHint('');
    setAnswer('');
    setFeedback('');
    setEliminatedOptions([]);
    setOptions(createOptions(selected, list, mode));
  }

  function startGame(name = playerName, selectedMode = mode) {
    if (!name.trim()) {
      setError('Ingresá tu nombre para empezar.');
      return;
    }

    const list = countriesRef.current;
    if (!list.length) {
      setError('Los países todavía no se cargaron.');
      return;
    }

    setError('');
    setPlayerName(name.trim());
    setMode(selectedMode);
    setScore(0);
    setUsedCountries([]);
    usedRef.current = [];
    setIsPlaying(true);
    savedRef.current = false;

    let selected = pickCountry(
      selectedMode === 'capital'
        ? list.filter((country) => country.capital)
        : list,
      []
    );

    setCurrentCountry(selected);
    setTimeLeft(15);
    setHint('');
    setFeedback('');
    setAnswer('');
    setEliminatedOptions([]);
    setOptions(createOptions(selected, list, selectedMode));
  }

  function guess(value) {
    if (!isPlaying || !currentCountry || feedback) return;

    const expected =
      mode === 'capital' ? currentCountry.capital : currentCountry.name;

    const correct =
      value.trim().toLocaleLowerCase() ===
      expected?.trim().toLocaleLowerCase();

    if (correct) {
      setScore((previous) => previous + 10 + timeLeft);
      setFeedback(`¡Correcto! Era ${currentCountry.name}.`);
      setTimeout(() => {
        if (isPlaying) nextCountry();
      }, 900);
    } else {
      setScore((previous) => Math.max(0, previous - 1));
      setFeedback('¡Incorrecto! Probá otra vez.');
    }
  }

  function requestHint() {
    if (!currentCountry || !isPlaying || feedback) return;

    setTimeLeft((previous) => Math.max(0, previous - 2));

    const word =
      mode === 'capital' ? currentCountry.capital : currentCountry.name;

    if (!word) return;

    const hiddenLetters = [...word]
      .map((letter, index) => ({ letter, index }))
      .filter(
        (item) =>
          /[a-záéíóúüñ]/i.test(item.letter) &&
          !hint.includes(`${item.index}:${item.letter}`)
      );

    if (!hiddenLetters.length) return;

    const chosen =
      hiddenLetters[Math.floor(Math.random() * hiddenLetters.length)];

    setHint((previous) =>
      `${previous}${chosen.index}:${chosen.letter};`
    );
  }

  function getHintText() {
    if (!currentCountry || !hint) return '';

    const word =
      mode === 'capital' ? currentCountry.capital : currentCountry.name;

    const revealed = new Map(
      hint
        .split(';')
        .filter(Boolean)
        .map((entry) => {
          const [index, letter] = entry.split(':');
          return [Number(index), letter];
        })
    );

    return [...word]
      .map((letter, index) => {
        if (!/[a-záéíóúüñ]/i.test(letter)) return letter;
        return revealed.has(index) ? revealed.get(index) : '_';
      })
      .join(' ');
  }

  function eliminateOption() {
    if (mode !== 'capital' || !isPlaying || feedback) return;

    const correct = currentCountry?.capital;
    const available = options.filter(
      (option) =>
        option !== correct && !eliminatedOptions.includes(option)
    );

    if (!available.length) return;

    const removed = available[
      Math.floor(Math.random() * available.length)
    ];

    setEliminatedOptions((previous) => [...previous, removed]);
  }

  async function finishGame() {
    setIsPlaying(false);

    if (savedRef.current || !playerName.trim()) return;
    savedRef.current = true;

    const updated = [
      ...ranking,
      {
        name: playerName,
        score,
        date: new Date().toISOString(),
      },
    ]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    setRanking(updated);

    try {
      await AsyncStorage.setItem(RANKING_KEY, JSON.stringify(updated));
    } catch {
      setError('No se pudo guardar el ranking.');
    }
  }

  function resetScore() {
    setScore(0);
    setTimeLeft(15);
    setHint('');
    setFeedback('');
    setAnswer('');
    setEliminatedOptions([]);
  }

  // Temporizador de 15 segundos por ronda.
  useEffect(() => {
    if (!isPlaying || !currentCountry || feedback) return;

    if (timeLeft <= 0) {
      setFeedback('¡Se acabó el tiempo!');
      const timeout = setTimeout(() => {
        if (isPlaying) nextCountry();
      }, 1000);

      return () => clearTimeout(timeout);
    }

    const interval = setInterval(() => {
      setTimeLeft((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentCountry, timeLeft, feedback]);

  // En el modo capitales, se elimina una opción cada 5 segundos.
  useEffect(() => {
    if (!isPlaying || mode !== 'capital' || feedback) return;
    if (timeLeft === 0 || timeLeft % 5 !== 0) return;

    if (timeLeft === 15) return;

    eliminateOption();
  }, [timeLeft]);

  const value = {
    countries,
    currentCountry,
    score,
    playerName,
    setPlayerName,
    ranking,
    mode,
    setMode,
    timeLeft,
    hint,
    hintText: getHintText(),
    answer,
    setAnswer,
    isPlaying,
    loading,
    error,
    feedback,
    options,
    eliminatedOptions,
    startGame,
    guess,
    nextCountry,
    resetScore,
    requestHint,
    finishGame,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useGame debe utilizarse dentro de GameProvider.');
  }

  return context;
}
