class Adaline {
  constructor() {
    this.dataset = require('./iris.json'); // Carrega o dataset Iris a partir de um arquivo JSON
    this.learningRate = 0.01; // Taxa de aprendizado
    this.maxEpochs = 100000; // Número máximo de épocas (iterações) de treinamento
    this.errorTolerance = 0.0001; // Tolerância para a convergência do erro
    this.classes = this.extractClasses(); // Lista de classes únicas no dataset
    this.classifiers = {}; // Armazenará os classificadores para cada classe
  }

  // Extrai as classes únicas presentes no dataset
  extractClasses() {
    const classes = new Set();
    for (let i = 0; i < this.dataset.length; i++) {
      classes.add(this.dataset[i][this.dataset[i].length - 1]);
    }
    return Array.from(classes);
  }

  // Inicializa os pesos do classificador Adaline de forma aleatória
  initializeWeights() {
    const numFeatures = this.dataset[0].length - 1;
    return Array.from({ length: numFeatures }, () => Math.random() * 1);
  }

  // Realiza a previsão para uma amostra usando um classificador específico
  predict(sample, classifier) {
    let sum = 0;
    for (let i = 0; i < sample.length; i++) {
      sum += sample[i] * classifier.weights[i];
    }
    return sum;
  }

  // Atualiza os pesos do classificador com base no erro
  updateWeights(error, sample, classifier) {
    for (let i = 0; i < classifier.weights.length; i++) {
      classifier.weights[i] += this.learningRate * error * sample[i];
    }
  }

  // Treina um classificador Adaline usando a abordagem "Um contra Todos" para uma classe específica
  trainOneVsAll(classLabel) {
    const numFeatures = this.dataset[0].length - 1;
    const positiveClassLabel = classLabel;

    const classifier = {
      classLabel: positiveClassLabel,
      weights: this.initializeWeights(),
    };

    for (let epoch = 0; epoch < this.maxEpochs; epoch++) {
      let errorSum = 0;

      for (let i = 0; i < this.dataset.length; i++) {
        const sample = this.dataset[i].slice(0, numFeatures);
        const target = this.dataset[i][numFeatures] === positiveClassLabel ? 1 : -1;
        const prediction = this.predict(sample, classifier);
        const error = target - prediction;

        errorSum += Math.abs(error);
        this.updateWeights(error, sample, classifier);
      }

      if (errorSum / this.dataset.length < this.errorTolerance) {
        console.log(`Convergência alcançada para a classe ${positiveClassLabel} na época ${epoch + 1}`);
        break;
      }
    }

    return classifier;
  }

  // Treina classificadores Adaline para todas as classes usando a abordagem "Um contra Todos"
  train() {
    for (const classLabel of this.classes) {
      this.classifiers[classLabel] = this.trainOneVsAll(classLabel);
    }
  }

  // Testa o modelo e calcula a acurácia no conjunto de teste
  test() {
    let correct = 0;

    for (let i = 0; i < this.dataset.length; i++) {
      const sample = this.dataset[i].slice(0, this.dataset[i].length - 1);
      const trueClass = this.dataset[i][this.dataset[i].length - 1];

      let maxPrediction = -Infinity;
      let predictedClass = null;

      // Classificar a amostra usando todos os classificadores e encontrar a classe com a maior previsão
      for (const classLabel in this.classifiers) {
        const classifier = this.classifiers[classLabel];
        const prediction = this.predict(sample, classifier);

        if (prediction > maxPrediction) {
          maxPrediction = prediction;
          predictedClass = classLabel;
        }
      }

      if (predictedClass === trueClass) {
        correct++;
      }
    }

    const accuracy = (correct / this.dataset.length) * 100;
    console.log(`Acurácia no conjunto de teste: ${accuracy.toFixed(2)}%`);
  }
}

const adaline = new Adaline();
adaline.train(); // Treina os classificadores
adaline.test(); // Testa o modelo e exibe a acurácia
