export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function curried(fn, ...args) {
  return (...nArgs) => fn.apply(this, [...args, ...nArgs]);
}

export function atIndex(arr, index) {
  index = Math.abs(index % arr.length);
  return arr.slice(index, index + 1)[0];
}

export function shuffle(input) {
  let output = [...input];
  let currentIndex = output.length;
  let temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = output[currentIndex];
    output[currentIndex] = output[randomIndex];
    output[randomIndex] = temporaryValue;
  }

  return output;
}

export function arg2str(...args) {
  return args.join('_');
}
