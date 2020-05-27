module.exports = class {
  constructor(storage = {}) {
    this.storage = storage;
    this._localcmd = [];
    this._NOOP = (s, n) => n();
  }

  /**
   * @param {(storage:{}, next:(name?:string)=>{}, ...param)=>{}} func
   */
  add(name, func, ...param) {
    this._localcmd.push({ name, func, param });
  }

  async run(name) {
    let sorted = Array.from(this._localcmd).sort((a, b) => (a.name <= b.name ? -1 : 1));
    for (let i = 0; i < sorted.length - 1; i++)
      if (sorted[i].name === sorted[i + 1].name) throw new Error("name duplicated: " + sorted[i].name);

    let startIndex = name === undefined ? 0 : this._localcmd.findIndex((item) => item.name === name);
    if (startIndex === -1) throw new Error("start name not found: " + name);

    for (let i = startIndex; i < this._localcmd.length; ) {
      let next = (names) => (i = names === undefined ? i + 1 : this._localcmd.findIndex((item) => item.name === names));
      await this._localcmd[i].func(this.storage, next, ...this._localcmd[i].param);
    }
  }
};
