import { tatoebaCollections } from "./library.js?v=10";

export const pairs = [
  { id: "en-es", from: "English", language: "Spanish", voice: "es-ES" },
  { id: "es-en", from: "Spanish", language: "English", voice: "en-US" },
  { id: "en-fr", from: "English", language: "French", voice: "fr-FR" },
];

export const collections = [
  {
    id: "kitchen",
    pairId: "en-es",
    language: "Spanish",
    from: "English",
    name: "In the kitchen",
    voice: "es-ES",
    sentences: [
      ["The coffee is hot.", "El café está caliente.", "caliente", "está agrees with the coffee"],
      ["I lock the door.", "Cierro la puerta con llave.", "llave"],
      ["I need a glass of water.", "Necesito un vaso de agua.", "vaso"],
      ["The soup needs salt.", "La sopa lleva sal.", "sal"],
      ["I put the bread on the table.", "Pongo el pan en la mesa.", "mesa"],
      ["Today I cook rice.", "Hoy cocino arroz.", "arroz"],
      ["The knife is sharp.", "El cuchillo está afilado.", "afilado"],
      ["I buy milk in the morning.", "Compro leche por la mañana.", "leche"],
      ["The hot coffee is on the table.", "El café caliente está en la mesa.", "caliente|mesa", "adjective before the noun"],
      ["Wash the plate.", "Lava el plato.", "plato"],
      ["The oven is on.", "El horno está encendido.", "horno"],
      ["I cut the onion.", "Corto la cebolla.", "cebolla"],
    ],
  },
  {
    id: "travel",
    pairId: "en-es",
    language: "Spanish",
    from: "English",
    name: "On the way",
    voice: "es-ES",
    sentences: [
      ["The train leaves at eight.", "El tren sale a las ocho.", "tren"],
      ["I lost my passport.", "Perdí mi pasaporte.", "pasaporte"],
      ["Where is the station?", "¿Dónde está la estación?", "estación"],
      ["I want a one-way ticket.", "Quiero un boleto de ida.", "boleto"],
      ["The hotel is nearby.", "El hotel queda cerca.", "hotel"],
      ["I carry a small suitcase.", "Llevo una maleta pequeña.", "maleta"],
      ["The flight is delayed.", "El vuelo está retrasado.", "vuelo"],
      ["I ask for a map at the desk.", "Pido un mapa en recepción.", "mapa"],
      ["The delayed flight leaves the airport.", "El vuelo retrasado sale del aeropuerto.", "vuelo|aeropuerto"],
      ["I wait at the platform.", "Espero en el andén.", "andén"],
      ["The ticket is expensive.", "El boleto es caro.", "caro"],
      ["We take a taxi.", "Tomamos un taxi.", "taxi"],
    ],
  },
  {
    id: "house",
    pairId: "es-en",
    language: "English",
    from: "Spanish",
    name: "At home",
    voice: "en-US",
    sentences: [
      ["El café está caliente.", "The coffee is hot.", "hot", "hot describes the coffee"],
      ["Cierro la puerta.", "I close the door.", "close"],
      ["Necesito un vaso de agua.", "I need a glass of water.", "glass"],
      ["La sopa lleva sal.", "The soup needs salt.", "salt"],
      ["Pongo el pan en la mesa.", "I put the bread on the table.", "table"],
      ["Hoy cocino arroz.", "Today I cook rice.", "rice"],
      ["El cuchillo está afilado.", "The knife is sharp.", "sharp"],
      ["Compro leche por la mañana.", "I buy milk in the morning.", "milk"],
      ["El café caliente está en la mesa.", "The hot coffee is on the table.", "hot|table", "two words in one sentence"],
      ["Lava el plato.", "Wash the plate.", "plate"],
      ["El horno está encendido.", "The oven is on.", "oven"],
      ["Corto la cebolla.", "I cut the onion.", "onion"],
    ],
  },
  {
    id: "morning",
    pairId: "en-fr",
    language: "French",
    from: "English",
    name: "Morning",
    voice: "fr-FR",
    sentences: [
      ["I drink coffee.", "Je bois du café.", "café"],
      ["It is cold outside.", "Il fait froid dehors.", "froid"],
      ["I open the window.", "J'ouvre la fenêtre.", "fenêtre"],
      ["We leave early.", "Nous partons tôt.", "tôt"],
      ["The cat is still asleep.", "Le chat dort encore.", "chat"],
      ["She reads the paper.", "Elle lit le journal.", "journal"],
      ["The cold cat opens the window.", "Le chat froid ouvre la fenêtre.", "froid|fenêtre"],
      ["I make the bed.", "Je fais le lit.", "lit"],
      ["The bread is fresh.", "Le pain est frais.", "frais"],
      ["He closes the door.", "Il ferme la porte.", "porte"],
    ],
  },
  ...tatoebaCollections,
];

export function allSentences() {
  return collections.flatMap((collection) =>
    collection.sentences.map(([meaning, text, cloze, grammar = ""], index) => {
      const clozes = String(cloze)
        .split("|")
        .map((word) => word.trim())
        .filter(Boolean);
      return {
        id: `${collection.id}-${index}`,
        collectionId: collection.id,
        pairId: collection.pairId,
        language: collection.language,
        from: collection.from,
        voice: collection.voice,
        collectionName: collection.name,
        meaning,
        text,
        cloze: clozes.join("|"),
        clozes,
        grammar,
        custom: false,
      };
    }),
  );
}
