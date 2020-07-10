const checkName = (cmds) => {
  let sorted = Array.from(cmds).sort((a, b) => (a.name <= b.name ? -1 : 1));
  for (let i = 0; i < sorted.length - 1; i++)
    if (sorted[i].name === sorted[i + 1].name) throw new Error("name duplicated: " + sorted[i].name);
};

const getIndex = (cmds, name) => {
  let startIndex = name === undefined ? 0 : cmds.findIndex((item) => item.name === name);
  if (startIndex === -1) throw new Error("start name not found: " + name);
  return startIndex;
};

const toLogs = (method, cmds, i) => {
  if (method != undefined) return method({ index: i, name: cmds[i].name, func: cmds[i].func, param: cmds[i].param });
};

module.exports = class {
  /**
   * @param {(param:{index:number,name:string,func:()=>{},param:[]})=>{}} logMethod
   */
  constructor(storage = {}, logMethod) {
    this.storage = storage;
    this._localcmd = [];
    this._NOOP = (s, n) => n();
    this._logMethod = logMethod;
  }

  /**
   * @param {(storage:{}, next:(name?:string)=>{}, ...param)=>{}} func
   */
  add(name, func, ...param) {
    this._localcmd.push({ name, func, param });
  }

  /**
   * have to call next() in each function
   */
  async run(name) {
    checkName(this._localcmd);
    for (let i = getIndex(this._localcmd, name); i < this._localcmd.length; ) {
      toLogs(this._logMethod, this._localcmd, i);
      let next = (names) => (i = names === undefined ? i + 1 : this._localcmd.findIndex((item) => item.name === names));
      await this._localcmd[i].func(this.storage, next, ...this._localcmd[i].param);
    }
  }

  /**
   * doesn't have to call next() in each function
   */
  async runAuto(name) {
    checkName(this._localcmd);
    for (let i = getIndex(this._localcmd, name); i < this._localcmd.length; i++) {
      toLogs(this._logMethod, this._localcmd, i);
      let next = (names) => (i = names === undefined ? i : this._localcmd.findIndex((item) => item.name === names));
      await this._localcmd[i].func(this.storage, next, ...this._localcmd[i].param);
    }
  }
};
