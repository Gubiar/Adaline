class Adaline {
    constructor() {
    //   this.data = require('./data.json');
    //   this.operationData = require('./operatiorData.json');
      this.n = 0.0025;
      this.precision = Math.pow(10, -6);
      this.p = this.data.length;
    }
  
    train(dataset, {weights, learningRating = 0.1, maxEpochs = 1000, errorTolerance = 0.0001}) {
      let epochs = 0;
      let errorPerEpoch = [];
      if(!weights){
        weights = Array.from({ length: data.length }, () => Math.random() * 1);
      }
      return [weights, epochs, errorPerEpoch];
    }
  
    test() {
    }

    normalizeDataset(dataset){

    }
  }

  
  const adaline = new Adaline();
  adaline.train();
  adaline.test();
  
