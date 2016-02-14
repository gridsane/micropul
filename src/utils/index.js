export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function curried(fn, ...args) {
  return (...nArgs) => fn.apply(this, [...args, ...nArgs]);
}
